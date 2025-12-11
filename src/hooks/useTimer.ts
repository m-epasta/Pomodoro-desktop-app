import { useState, useEffect, useCallback } from 'react';
import { invoke } from '@tauri-apps/api/core';
import { isPermissionGranted, requestPermission, sendNotification } from '@tauri-apps/plugin-notification';
import { formatTime } from '../utils/time';

export enum TimerState {
    Paused = 'Paused',
    Running = 'Running',
    Break = 'Break',
}

const MIN_SESSION_MINUTES = 25;
const MAX_SESSION_MINUTES = 40;

export const useTimer = () => {
    const [timerState, setTimerState] = useState<TimerState>(TimerState.Paused);
    const [timerDuration, setTimerDuration] = useState(0);
    const [sessionLength, setSessionLength] = useState(25 * 60);

    useEffect(() => {
        let interval: number | undefined;

        if (timerState !== TimerState.Paused) {
            interval = setInterval(() => {
                setTimerDuration((prev) => prev + 1);
            }, 1000);
        }

        return () => clearInterval(interval);
    }, [timerState]);

    useEffect(() => {
        const updateTitle = async () => {
            let title = '';
            if (timerState === TimerState.Paused) {
                title = 'Paused';
            } else if (timerState === TimerState.Running) {
                if (timerDuration > sessionLength) {
                    title = `Finished session: ${formatTime(timerDuration)}`;
                } else {
                    title = `In session: ${formatTime(sessionLength - timerDuration)}`;
                }
            } else if (timerState === TimerState.Break) {
                if (timerDuration > sessionLength) {
                    title = `Finished break: ${formatTime(timerDuration)}`;
                } else {
                    title = `In break: ${formatTime(sessionLength - timerDuration)}`;
                }
            }

            try {
                await invoke('set_title', { title });
            } catch (error) {
                console.error('Failed to set title:', error);
            }
        };

        updateTitle();
    }, [timerState, timerDuration, sessionLength]);

    // Request notification permission on mount
    useEffect(() => {
        const initNotifications = async () => {
            let permissionGranted = await isPermissionGranted();
            if (!permissionGranted) {
                const permission = await requestPermission();
                permissionGranted = permission === 'granted';
            }
        };
        initNotifications();
    }, []);

    // Trigger notification when timer ends
    useEffect(() => {
        if (timerState === TimerState.Running && timerDuration === sessionLength) {
            sendNotification({
                title: 'Pomodoro Finished!',
                body: 'Time to take a break.',
            });
        } else if (timerState === TimerState.Break && timerDuration === sessionLength) {
            sendNotification({
                title: 'Break Finished!',
                body: 'Ready to focus again?',
            });
        }
    }, [timerState, timerDuration, sessionLength]);

    const startTimer = useCallback(() => setTimerState(TimerState.Running), []);
    const pauseTimer = useCallback(() => setTimerState(TimerState.Paused), []);

    const resetTimer = useCallback(() => {
        setTimerState(TimerState.Paused);
        setTimerDuration(0);
        // Keep current session length
    }, []);

    const takeBreak = useCallback(() => {
        setTimerState(TimerState.Break);
        setTimerDuration(0);

        // Hardcoded break times
        // 25m work -> 5m break
        // 30m work -> 6m break
        // 35m work -> 8m break
        // 40m work -> 10m break
        const breakMap: Record<number, number> = {
            [25 * 60]: 5 * 60,
            [30 * 60]: 6 * 60,
            [35 * 60]: 8 * 60,
            [40 * 60]: 10 * 60,
        };

        const breakSeconds = breakMap[sessionLength] || Math.max(5 * 60, Math.round(sessionLength / 4));
        setSessionLength(breakSeconds);
    }, [sessionLength]);

    const finishBreak = useCallback(() => {
        setTimerState(TimerState.Running);
        setTimerDuration(0);
        setSessionLength(25 * 60);
    }, []);

    const increaseSessionLength = useCallback(() => {
        setSessionLength((prev) => {
            const newLength = prev + 5 * 60;
            return newLength <= MAX_SESSION_MINUTES * 60 ? newLength : prev;
        });
    }, []);

    const decreaseSessionLength = useCallback(() => {
        setSessionLength((prev) => {
            const newLength = prev - 5 * 60;
            return newLength >= MIN_SESSION_MINUTES * 60 ? newLength : prev;
        });
    }, []);

    return {
        timerState,
        timerDuration,
        sessionLength,
        startTimer,
        pauseTimer,
        resetTimer,
        takeBreak,
        finishBreak,
        increaseSessionLength,
        decreaseSessionLength,
        MIN_SESSION_MINUTES,
        MAX_SESSION_MINUTES,
    };
};
