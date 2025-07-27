import React from 'react';
import { Clock, User, Zap } from 'lucide-react';
import type { Friend } from '../types';

interface FriendsListProps {
  friends: Friend[];
  onFriendSelect?: (friendId: string) => void;
}

export const FriendsList: React.FC<FriendsListProps> = ({
  friends,
  onFriendSelect,
}) => {
  const getStatusIcon = (status: Friend['status']) => {
    switch (status) {
      case 'active':
        return '🔥'; // 作業中
      case 'break':
        return '☕'; // 休憩中
      case 'sleeping':
        return '😴'; // 就寝
      case 'offline':
        return '💤'; // オフライン
      default:
        return '❓';
    }
  };

  const getStatusText = (status: Friend['status']) => {
    switch (status) {
      case 'active':
        return '作業中';
      case 'break':
        return '休憩中';
      case 'sleeping':
        return '就寝';
      case 'offline':
        return 'オフライン';
      default:
        return '不明';
    }
  };

  const getStatusColor = (status: Friend['status']) => {
    switch (status) {
      case 'active':
        return '#10b981'; // green
      case 'break':
        return '#f59e0b'; // yellow
      case 'sleeping':
        return '#6366f1'; // indigo
      case 'offline':
        return '#6b7280'; // gray
      default:
        return '#6b7280';
    }
  };

  const formatEstimatedBedtime = (bedtime?: Date): string => {
    if (!bedtime) return '未設定';
    
    const now = new Date();
    const diffMs = bedtime.getTime() - now.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    
    if (diffMs < 0) {
      return '就寝時刻を過ぎています';
    }
    
    if (diffHours > 0) {
      return `約${diffHours}時間${diffMinutes}分後`;
    }
    
    return `約${diffMinutes}分後`;
  };

  const getLastSeenText = (lastSeen: Date): string => {
    const now = new Date();
    const diffMs = now.getTime() - lastSeen.getTime();
    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMinutes / 60);
    const diffDays = Math.floor(diffHours / 24);
    
    if (diffMinutes < 1) {
      return 'たった今';
    } else if (diffMinutes < 60) {
      return `${diffMinutes}分前`;
    } else if (diffHours < 24) {
      return `${diffHours}時間前`;
    } else {
      return `${diffDays}日前`;
    }
  };

  return (
    <div className="friends-list">
      <div className="friends-header">
        <h3>👥 フレンド</h3>
        <span className="friends-count">{friends.length}人</span>
      </div>

      <div className="friends-container">
        {friends.map((friend) => (
          <div
            key={friend.id}
            className={`friend-card ${friend.status}`}
            onClick={() => onFriendSelect?.(friend.id)}
          >
            <div className="friend-avatar">
              {friend.user.avatar ? (
                <img src={friend.user.avatar} alt={friend.user.name} />
              ) : (
                <div className="avatar-placeholder">
                  <User size={20} />
                </div>
              )}
              <div 
                className="status-indicator"
                style={{ backgroundColor: getStatusColor(friend.status) }}
              >
                {getStatusIcon(friend.status)}
              </div>
            </div>

            <div className="friend-info">
              <div className="friend-name">
                <span>{friend.user.name}</span>
                <span className="status-text">{getStatusText(friend.status)}</span>
              </div>

              {friend.user.currentTask && (
                <div className="current-task">
                  <Zap size={12} />
                  <span>{friend.user.currentTask.title}</span>
                  <span className="task-progress">
                    {friend.user.currentTask.progress}%
                  </span>
                </div>
              )}

              <div className="friend-meta">
                {friend.user.estimatedBedtime && (
                  <div className="bedtime-info">
                    <Clock size={12} />
                    <span>就寝予定: {formatEstimatedBedtime(friend.user.estimatedBedtime)}</span>
                  </div>
                )}
                
                <div className="last-seen">
                  最終アクティブ: {getLastSeenText(friend.lastSeen)}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {friends.length === 0 && (
        <div className="empty-friends">
          <p>まだフレンドがいません</p>
          <p>友達を追加して一緒に頑張りましょう！</p>
        </div>
      )}
    </div>
  );
};
