import React from 'react';
import { Coffee, Pause, Play, RotateCcw } from 'lucide-react';
import { TimerState } from '../hooks/useTimer';
import { useSound } from '../hooks/useSound';
import './TimerControls.scss';

interface TimerControlsProps {
    timerState: TimerState;
    startTimer: () => void;
    pauseTimer: () => void;
    resetTimer: () => void;
    takeBreak: () => void;
    finishBreak: () => void;
}

export const TimerControls: React.FC<TimerControlsProps> = ({
    timerState,
    startTimer,
    pauseTimer,
    resetTimer,
    takeBreak,
    finishBreak,
}) => {
    const { playClick } = useSound();

    const handleAction = (action: () => void) => {
        playClick();
        action();
    };

    const Button = ({ onClick, icon: Icon, primary = false, title }: any) => (
        <button
            onClick={() => handleAction(onClick)}
            title={title}
            className={`btn-control ${primary ? 'btn-primary' : 'btn-secondary'}`}
        >
            <Icon size={32} strokeWidth={2.5} />
        </button>
    );

    return (
        <div className="timer-controls">
            {timerState === TimerState.Running && (
                <>
                    <Button onClick={takeBreak} icon={Coffee} title="Take a Break" />
                    <Button onClick={pauseTimer} icon={Pause} primary title="Pause" />
                    <Button onClick={resetTimer} icon={RotateCcw} title="Reset" />
                </>
            )}

            {timerState === TimerState.Paused && (
                <>
                    <Button onClick={takeBreak} icon={Coffee} title="Take a Break" />
                    <Button onClick={startTimer} icon={Play} primary title="Start" />
                    <Button onClick={resetTimer} icon={RotateCcw} title="Reset" />
                </>
            )}

            {timerState === TimerState.Break && (
                <button
                    onClick={finishBreak}
                    className="btn-resume"
                >
                    <Play size={24} fill="currentColor" />
                    <span>Resume Focus</span>
                </button>
            )}
        </div>
    );
};
