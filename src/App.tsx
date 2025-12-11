import { useTimer } from './hooks/useTimer';
import { TimerDisplay } from './components/TimerDisplay';
import { TimerControls } from './components/TimerControls';
import './App.scss';

function App() {
    const {
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
    } = useTimer();

    return (
        <div className="app-container">
            {/* Ambient Background Glow */}
            <div className="ambient-glow glow-primary" />
            <div className="ambient-glow glow-secondary" />

            {/* Main Container */}
            <div className="main-content">
                {/* Header */}
                <div className="app-header">
                    <h1>POMODORO</h1>
                    <p>Focus Timer</p>
                </div>

                <TimerDisplay
                    timerState={timerState}
                    timerDuration={timerDuration}
                    sessionLength={sessionLength}
                    increaseSessionLength={increaseSessionLength}
                    decreaseSessionLength={decreaseSessionLength}
                />

                <div className="spacer" /> {/* Spacer */}

                <TimerControls
                    timerState={timerState}
                    startTimer={startTimer}
                    pauseTimer={pauseTimer}
                    resetTimer={resetTimer}
                    takeBreak={takeBreak}
                    finishBreak={finishBreak}
                />
            </div>
        </div>
    );
}

export default App;
