import React from 'react';
import { Play, Pause, RotateCcw, SkipForward } from 'lucide-react';
import { usePomodoro } from '../hooks/usePomodoro';
import type { PomodoroSettings } from '../types';

interface PomodoroTimerProps {
  settings: PomodoroSettings;
  onSessionComplete?: (session: 'work' | 'shortBreak' | 'longBreak') => void;
}

export const PomodoroTimer: React.FC<PomodoroTimerProps> = ({
  settings,
  onSessionComplete,
}) => {
  const { state, start, pause, reset, skip, formatTime, isActive } = usePomodoro(
    settings,
    onSessionComplete
  );

  if (!isActive) {
    return (
      <div className="pomodoro-timer disabled">
        <p>ポモドーロタイマーは無効になっています</p>
      </div>
    );
  }

  const getSessionLabel = () => {
    switch (state.currentSession) {
      case 'work':
        return '作業時間';
      case 'shortBreak':
        return '短い休憩';
      case 'longBreak':
        return '長い休憩';
      default:
        return '';
    }
  };

  const getProgressPercentage = () => {
    const totalTime = state.currentSession === 'work' 
      ? settings.workDuration * 60
      : state.currentSession === 'shortBreak' 
        ? settings.shortBreakDuration * 60 
        : settings.longBreakDuration * 60;
    
    return ((totalTime - state.timeLeft) / totalTime) * 100;
  };

  return (
    <div className="pomodoro-timer">
      <div className="timer-header">
        <h3>{getSessionLabel()}</h3>
        <span className="session-count">
          セッション: {state.sessionCount}/{settings.sessionsUntilLongBreak}
        </span>
      </div>

      <div className="timer-display">
        <div 
          className="timer-circle"
          style={{
            background: `conic-gradient(
              #4f46e5 ${getProgressPercentage()}%, 
              #e5e7eb ${getProgressPercentage()}%
            )`
          }}
        >
          <div className="timer-inner">
            <span className="time-text">{formatTime()}</span>
          </div>
        </div>
      </div>

      <div className="timer-controls">
        <button
          onClick={state.isRunning ? pause : start}
          className="control-btn primary"
          disabled={!isActive}
        >
          {state.isRunning ? <Pause size={20} /> : <Play size={20} />}
          {state.isRunning ? 'ポーズ' : 'スタート'}
        </button>

        <button
          onClick={reset}
          className="control-btn secondary"
          disabled={!isActive}
        >
          <RotateCcw size={16} />
          リセット
        </button>

        <button
          onClick={skip}
          className="control-btn secondary"
          disabled={!isActive}
        >
          <SkipForward size={16} />
          スキップ
        </button>
      </div>

      <div className="session-stats">
        <p>完了セッション: {state.totalSessions}</p>
      </div>
    </div>
  );
};
