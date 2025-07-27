import { useState, useEffect } from 'react';
import { PomodoroTimer } from './components/PomodoroTimer';
import { TaskManager } from './components/TaskManager';
import { MarathonTrack } from './components/MarathonTrack';
import { FriendsList } from './components/FriendsList';
import type { 
  Task, 
  User, 
  Friend, 
  PomodoroSettings, 
  RunnerPosition
} from './types';
import './App.css';

// モックデータ
const mockCurrentUser: User = {
  id: 'user-1',
  name: 'あなた',
  currentTask: undefined,
  estimatedBedtime: undefined,
};

const mockFriends: Friend[] = [
  {
    id: 'friend-1',
    user: {
      id: 'user-2',
      name: '田中さん',
      currentTask: {
        id: 'task-2',
        title: '化学レポート',
        totalPomodoros: 6,
        completedPomodoros: 3,
        progress: 50,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      estimatedBedtime: new Date(Date.now() + 2 * 60 * 60 * 1000), // 2時間後
    },
    status: 'active',
    lastSeen: new Date(Date.now() - 5 * 60 * 1000), // 5分前
  },
  {
    id: 'friend-2',
    user: {
      id: 'user-3',
      name: '佐藤さん',
      currentTask: {
        id: 'task-3',
        title: '看護実習準備',
        totalPomodoros: 10,
        completedPomodoros: 7,
        progress: 70,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      estimatedBedtime: new Date(Date.now() + 1.5 * 60 * 60 * 1000), // 1.5時間後
    },
    status: 'break',
    lastSeen: new Date(Date.now() - 2 * 60 * 1000), // 2分前
  },
];

function App() {
  const [currentUser, setCurrentUser] = useState<User>(mockCurrentUser);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [friends] = useState<Friend[]>(mockFriends);
  const [pomodoroSettings] = useState<PomodoroSettings>({
    workDuration: 25,
    shortBreakDuration: 5,
    longBreakDuration: 15,
    sessionsUntilLongBreak: 4,
    isEnabled: true,
  });

  // ランナーの位置を計算して状態を初期化
  const [runnerPositions, setRunnerPositions] = useState<RunnerPosition[]>([]);

  // タスク作成
  const handleTaskCreate = (taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newTask: Task = {
      ...taskData,
      id: `task-${Date.now()}`,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    setTasks(prev => [...prev, newTask]);
    
    // 現在のユーザーのタスクを更新
    if (tasks.length === 0) {
      setCurrentUser(prev => ({
        ...prev,
        currentTask: newTask,
      }));
    }
  };

  // タスク削除
  const handleTaskDelete = (taskId: string) => {
    setTasks(prev => prev.filter(task => task.id !== taskId));
    
    // 削除されたタスクが現在のタスクだった場合、他のタスクに切り替え
    if (currentUser.currentTask?.id === taskId) {
      const remainingTasks = tasks.filter(task => task.id !== taskId);
      setCurrentUser(prev => ({
        ...prev,
        currentTask: remainingTasks.length > 0 ? remainingTasks[0] : undefined,
      }));
    }
  };

  // 進捗更新
  const handleProgressUpdate = (taskId: string, progress: number) => {
    setTasks(prev => prev.map(task => 
      task.id === taskId 
        ? { ...task, progress, updatedAt: new Date() }
        : task
    ));

    // 現在のタスクの場合、ユーザー情報も更新
    if (currentUser.currentTask?.id === taskId) {
      setCurrentUser(prev => ({
        ...prev,
        currentTask: prev.currentTask ? { ...prev.currentTask, progress } : undefined,
      }));
    }
  };

  // ポモドーロセッション完了時の処理
  const handleSessionComplete = (sessionType: 'work' | 'shortBreak' | 'longBreak') => {
    if (sessionType === 'work' && currentUser.currentTask) {
      // 作業セッション完了時、進捗を更新
      const currentTask = tasks.find(t => t.id === currentUser.currentTask?.id);
      if (currentTask) {
        const newProgress = Math.min(100, currentTask.progress + (100 / currentTask.totalPomodoros));
        handleProgressUpdate(currentTask.id, newProgress);
      }
    }
  };

  // ランナー位置を定期更新
  useEffect(() => {
    const allUsers = [currentUser, ...friends.map(f => f.user)];
    
    const positions = allUsers.map(user => ({
      userId: user.id,
      position: user.currentTask?.progress || 0,
      isResting: friends.find(f => f.user.id === user.id)?.status === 'break' || false,
    }));
    
    setRunnerPositions(positions);
    
    // 就寝時刻を更新
    if (currentUser.currentTask) {
      const task = currentUser.currentTask;
      const remainingWork = (100 - task.progress) / 100;
      const remainingPomodoros = Math.ceil(remainingWork * task.totalPomodoros);
      const estimatedMinutes = remainingPomodoros * 30; // 25分作業 + 5分休憩
      
      const estimatedBedtime = new Date(Date.now() + estimatedMinutes * 60 * 1000);
      setCurrentUser(prev => ({
        ...prev,
        estimatedBedtime,
      }));
    } else {
      setCurrentUser(prev => ({
        ...prev,
        estimatedBedtime: undefined,
      }));
    }
  }, [tasks, currentUser.currentTask, friends, currentUser]);

  return (
    <div className="app">
      <header className="app-header">
        <h1>🌙 何時寝~NANJINE~</h1>
        <p>みんなで進捗をシェアして、一緒に頑張ろう！</p>
      </header>

      <main className="app-main">
        <div className="main-content">
          <div className="left-panel">
            <PomodoroTimer 
              settings={pomodoroSettings}
              onSessionComplete={handleSessionComplete}
            />
            
            <TaskManager
              tasks={tasks}
              onTaskCreate={handleTaskCreate}
              onTaskDelete={handleTaskDelete}
              onProgressUpdate={handleProgressUpdate}
            />
          </div>

          <div className="right-panel">
            <MarathonTrack
              users={[currentUser, ...friends.map(f => f.user)]}
              runnerPositions={runnerPositions}
              currentUserId={currentUser.id}
            />
            
            <FriendsList
              friends={friends}
              onFriendSelect={(friendId) => {
                console.log('Selected friend:', friendId);
                // TODO: フレンド詳細表示
              }}
            />
          </div>
        </div>
      </main>

      {currentUser.estimatedBedtime && (
        <div className="bedtime-notification">
          <span>😴 予想就寝時刻: {currentUser.estimatedBedtime.toLocaleTimeString('ja-JP', { 
            hour: '2-digit', 
            minute: '2-digit' 
          })}</span>
        </div>
      )}
    </div>
  );
}

export default App;
