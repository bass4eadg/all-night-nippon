// 基本的な型定義
export interface User {
  id: string;
  name: string;
  avatar?: string;
  currentTask?: Task;
  estimatedBedtime?: Date;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  totalPomodoros: number;
  completedPomodoros: number;
  progress: number; // 0-100のパーセンテージ
  deadline?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface PomodoroSession {
  id: string;
  taskId: string;
  startTime: Date;
  endTime?: Date;
  isCompleted: boolean;
  notes?: string;
}

export interface PomodoroSettings {
  workDuration: number; // 分
  shortBreakDuration: number; // 分
  longBreakDuration: number; // 分
  sessionsUntilLongBreak: number;
  isEnabled: boolean;
}

export interface Friend {
  id: string;
  user: User;
  status: 'active' | 'break' | 'sleeping' | 'offline';
  lastSeen: Date;
}

export interface ProgressUpdate {
  id: string;
  userId: string;
  taskId: string;
  progress: number;
  message?: string;
  timestamp: Date;
}

// マラソンランナーのビジュアル表現用
export interface RunnerPosition {
  userId: string;
  position: number; // 0-100のトラック上の位置
  isResting: boolean;
}
