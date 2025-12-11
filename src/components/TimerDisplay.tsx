import React from 'react';
import { TimerState } from '../hooks/useTimer';
import { formatTime } from '../utils/time';
import { Minus, Plus } from 'lucide-react';
import { useSound } from '../hooks/useSound';
import './TimerDisplay.scss';

interface TimerDisplayProps {
    timerState: TimerState;
    timerDuration: number;
    sessionLength: number;
    increaseSessionLength: () => void;
    decreaseSessionLength: () => void;
}

export const TimerDisplay: React.FC<TimerDisplayProps> = ({
    timerState,
    timerDuration,
    sessionLength,
    increaseSessionLength,
    decreaseSessionLength,
}) => {
    const { playClick } = useSound();

    const handleAction = (action: () => void) => {
        playClick();
        action();
    };
    const isExpired = timerDuration > sessionLength;
    const timeLeft = isExpired ? timerDuration : sessionLength - timerDuration;
    const displayTime = formatTime(timeLeft);

    // Calculate progress for circular bar
    // If expired, we can just show full circle or pulsing
    const progress = isExpired
        ? 100
        : ((timerDuration) / sessionLength) * 100;

    const radius = 120;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (progress / 100) * circumference;

    const getStatusText = () => {
        switch (timerState) {
            case TimerState.Paused: return 'Ready to Focus?';
            case TimerState.Running: return isExpired ? 'Overtime' : 'Focusing';
            case TimerState.Break: return 'Recharging';
            default: return '';
        }
    };

    return (
        <div className="timer-display-container">
            {/* Circular Progress */}
            <div className="circular-progress-container">
                {/* Background Circle */}
                <svg>
                    <circle
                        cx="150"
                        cy="150"
                        r={radius}
                        stroke="currentColor"
                        strokeWidth="12"
                        fill="transparent"
                        className="bg-circle"
                    />
                    {/* Progress Circle */}
                    <circle
                        cx="150"
                        cy="150"
                        r={radius}
                        stroke="currentColor"
                        strokeWidth="12"
                        fill="transparent"
                        strokeDasharray={circumference}
                        strokeDashoffset={strokeDashoffset}
                        strokeLinecap="round"
                        className={`progress-circle ${timerState === TimerState.Break ? 'state-break' :
                            isExpired ? 'state-expired' : 'state-focus'
                            }`}
                    />
                </svg>

                {/* Time Display (Centered) */}
                <div className="time-text-container">
                    <div className="time-value">
                        {displayTime}
                    </div>
                    <div className={`status-text ${timerState === TimerState.Break ? 'state-break' : 'state-focus'
                        }`}>
                        {getStatusText()}
                    </div>
                </div>
            </div>

            {/* Session Controls */}
            <div className="session-controls">
                <button
                    onClick={() => handleAction(decreaseSessionLength)}
                    className="btn-adjust"
                    aria-label="Decrease time"
                >
                    <Minus size={20} />
                </button>

                <div className="label">
                    Session Length
                </div>

                <button
                    onClick={() => handleAction(increaseSessionLength)}
                    className="btn-adjust"
                    aria-label="Increase time"
                >
                    <Plus size={20} />
                </button>
            </div>
        </div>
    );
};
