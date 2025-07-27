import React, { useState } from 'react';
import { Clock, Calendar, Target, Plus, Edit3, Trash2 } from 'lucide-react';
import type { Task } from '../types';

interface TaskManagerProps {
  tasks: Task[];
  onTaskCreate: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onTaskDelete: (taskId: string) => void;
  onProgressUpdate: (taskId: string, progress: number, message?: string) => void;
}

export const TaskManager: React.FC<TaskManagerProps> = ({
  tasks,
  onTaskCreate,
  onTaskDelete,
  onProgressUpdate,
}) => {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    totalPomodoros: 8,
    deadline: '',
  });

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTask.title.trim()) return;

    onTaskCreate({
      title: newTask.title,
      description: newTask.description,
      totalPomodoros: newTask.totalPomodoros,
      completedPomodoros: 0,
      progress: 0,
      deadline: newTask.deadline ? new Date(newTask.deadline) : undefined,
    });

    setNewTask({ title: '', description: '', totalPomodoros: 8, deadline: '' });
    setShowCreateForm(false);
  };

  const handleProgressChange = (taskId: string, newProgress: number) => {
    onProgressUpdate(taskId, newProgress);
  };

  const calculateEstimatedBedtime = (task: Task): Date | null => {
    if (task.progress >= 100) return null;
    
    const remainingWork = (100 - task.progress) / 100;
    const remainingPomodoros = Math.ceil(remainingWork * task.totalPomodoros);
    const estimatedMinutes = remainingPomodoros * 30; // 25分作業 + 5分休憩
    
    const now = new Date();
    const bedtime = new Date(now.getTime() + estimatedMinutes * 60000);
    return bedtime;
  };

  const formatTime = (date: Date): string => {
    return date.toLocaleTimeString('ja-JP', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <div className="task-manager">
      <div className="task-header">
        <h2>📝 タスク管理</h2>
        <button
          onClick={() => setShowCreateForm(true)}
          className="btn btn-primary"
        >
          <Plus size={16} />
          新しいタスク
        </button>
      </div>

      {showCreateForm && (
        <form onSubmit={handleCreateTask} className="task-form">
          <div className="form-group">
            <label htmlFor="title">タスク名 *</label>
            <input
              type="text"
              id="title"
              value={newTask.title}
              onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
              placeholder="例: 数学のレポート作成"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">説明</label>
            <textarea
              id="description"
              value={newTask.description}
              onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
              placeholder="タスクの詳細説明..."
              rows={3}
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="pomodoros">予想ポモドーロ数</label>
              <input
                type="number"
                id="pomodoros"
                value={newTask.totalPomodoros}
                onChange={(e) => setNewTask({ ...newTask, totalPomodoros: parseInt(e.target.value) })}
                min="1"
                max="20"
              />
            </div>

            <div className="form-group">
              <label htmlFor="deadline">締切日（任意）</label>
              <input
                type="datetime-local"
                id="deadline"
                value={newTask.deadline}
                onChange={(e) => setNewTask({ ...newTask, deadline: e.target.value })}
              />
            </div>
          </div>

          <div className="form-actions">
            <button type="submit" className="btn btn-primary">
              作成
            </button>
            <button
              type="button"
              onClick={() => setShowCreateForm(false)}
              className="btn btn-secondary"
            >
              キャンセル
            </button>
          </div>
        </form>
      )}

      <div className="task-list">
        {tasks.map((task) => {
          const estimatedBedtime = calculateEstimatedBedtime(task);
          const isOverdue = task.deadline && new Date() > task.deadline;
          
          return (
            <div 
              key={task.id} 
              className={`task-card ${task.progress >= 100 ? 'completed' : ''} ${isOverdue ? 'overdue' : ''}`}
            >
              <div className="task-content">
                <div className="task-title">
                  <h3>{task.title}</h3>
                  {task.description && (
                    <p className="task-description">{task.description}</p>
                  )}
                </div>

                <div className="task-meta">
                  <div className="meta-item">
                    <Target size={14} />
                    <span>{task.completedPomodoros}/{task.totalPomodoros} ポモドーロ</span>
                  </div>
                  
                  {task.deadline && (
                    <div className="meta-item">
                      <Calendar size={14} />
                      <span>{task.deadline.toLocaleDateString('ja-JP')}</span>
                    </div>
                  )}
                  
                  {estimatedBedtime && (
                    <div className="meta-item bedtime">
                      <Clock size={14} />
                      <span>予想就寝時刻: {formatTime(estimatedBedtime)}</span>
                    </div>
                  )}
                </div>

                <div className="progress-section">
                  <div className="progress-header">
                    <span>進捗: {task.progress}%</span>
                  </div>
                  <div className="progress-bar">
                    <div 
                      className="progress-fill"
                      style={{ width: `${task.progress}%` }}
                    />
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={task.progress}
                    onChange={(e) => handleProgressChange(task.id, parseInt(e.target.value))}
                    className="progress-slider"
                  />
                </div>
              </div>

              <div className="task-actions">
                <button
                  onClick={() => {/* TODO: 編集機能を実装 */}}
                  className="btn btn-icon"
                  title="編集"
                >
                  <Edit3 size={16} />
                </button>
                <button
                  onClick={() => onTaskDelete(task.id)}
                  className="btn btn-icon btn-danger"
                  title="削除"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {tasks.length === 0 && !showCreateForm && (
        <div className="empty-state">
          <p>まだタスクがありません</p>
          <p>新しいタスクを作成して進捗を追跡しましょう！</p>
        </div>
      )}
    </div>
  );
};
