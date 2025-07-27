import { useState, useEffect, useCallback } from 'react';
import type { PomodoroSettings } from '../types';

export interface PomodoroState {
  isRunning: boolean;
  timeLeft: number; // 秒
  currentSession: 'work' | 'shortBreak' | 'longBreak';
  sessionCount: number;
  totalSessions: number;
}

const DEFAULT_SETTINGS: PomodoroSettings = {
  workDuration: 25,
  shortBreakDuration: 5,
  longBreakDuration: 15,
  sessionsUntilLongBreak: 4,
  isEnabled: true,
};

export const usePomodoro = (
  settings: PomodoroSettings = DEFAULT_SETTINGS,
  onSessionComplete?: (session: PomodoroState['currentSession']) => void
) => {
  const [state, setState] = useState<PomodoroState>({
    isRunning: false,
    timeLeft: settings.workDuration * 60,
    currentSession: 'work',
    sessionCount: 0,
    totalSessions: 0,
  });

  const handleSessionComplete = useCallback(() => {
    setState(prev => {
      const newSessionCount = prev.currentSession === 'work' ? prev.sessionCount + 1 : prev.sessionCount;
      const newTotalSessions = prev.currentSession === 'work' ? prev.totalSessions + 1 : prev.totalSessions;
      
      let nextSession: PomodoroState['currentSession'];
      let nextTimeLeft: number;

      if (prev.currentSession === 'work') {
        // 作業セッション完了 -> 休憩
        if (newSessionCount % settings.sessionsUntilLongBreak === 0) {
          nextSession = 'longBreak';
          nextTimeLeft = settings.longBreakDuration * 60;
        } else {
          nextSession = 'shortBreak';
          nextTimeLeft = settings.shortBreakDuration * 60;
        }
      } else {
        // 休憩完了 -> 作業
        nextSession = 'work';
        nextTimeLeft = settings.workDuration * 60;
      }

      onSessionComplete?.(prev.currentSession);

      return {
        ...prev,
        isRunning: false,
        timeLeft: nextTimeLeft,
        currentSession: nextSession,
        sessionCount: newSessionCount,
        totalSessions: newTotalSessions,
      };
    });
  }, [settings, onSessionComplete]);

  // タイマー更新
  useEffect(() => {
    let interval: number | null = null;

    if (state.isRunning && state.timeLeft > 0) {
      interval = setInterval(() => {
        setState(prev => ({
          ...prev,
          timeLeft: prev.timeLeft - 1,
        }));
      }, 1000);
    } else if (state.timeLeft === 0) {
      // セッション完了
      handleSessionComplete();
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [state.isRunning, state.timeLeft, handleSessionComplete]);

  const start = useCallback(() => {
    if (!settings.isEnabled) return;
    setState(prev => ({ ...prev, isRunning: true }));
  }, [settings.isEnabled]);

  const pause = useCallback(() => {
    setState(prev => ({ ...prev, isRunning: false }));
  }, []);

  const reset = useCallback(() => {
    setState(prev => ({
      ...prev,
      isRunning: false,
      timeLeft: prev.currentSession === 'work' 
        ? settings.workDuration * 60 
        : prev.currentSession === 'shortBreak' 
          ? settings.shortBreakDuration * 60 
          : settings.longBreakDuration * 60,
    }));
  }, [settings]);

  const skip = useCallback(() => {
    setState(prev => ({ ...prev, timeLeft: 0 }));
  }, []);

  const formatTime = useCallback((seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }, []);

  return {
    state,
    start,
    pause,
    reset,
    skip,
    formatTime: (seconds?: number) => formatTime(seconds ?? state.timeLeft),
    isActive: settings.isEnabled,
  };
};
