import React from 'react';
import type { User, RunnerPosition } from '../types';

interface MarathonTrackProps {
  users: User[];
  runnerPositions: RunnerPosition[];
  currentUserId?: string;
}

export const MarathonTrack: React.FC<MarathonTrackProps> = ({
  users,
  runnerPositions,
  currentUserId,
}) => {
  const getUserById = (userId: string) => users.find(u => u.id === userId);

  return (
    <div className="marathon-track">
      <div className="track-header">
        <h3>📍 進捗トラック</h3>
        <p>みんなの進捗状況をマラソンランナーで表示</p>
      </div>

      <div className="track-container">
        {/* スタートライン */}
        <div className="track-line start-line">
          <span className="line-label">スタート</span>
        </div>

        {/* メイントラック */}
        <div className="main-track">
          {runnerPositions.map((runner) => {
            const user = getUserById(runner.userId);
            const isCurrentUser = runner.userId === currentUserId;
            
            return (
              <div
                key={runner.userId}
                className={`runner ${isCurrentUser ? 'current-user' : ''} ${
                  runner.isResting ? 'resting' : 'running'
                }`}
                style={{
                  left: `${runner.position}%`,
                }}
              >
                <div className="runner-avatar">
                  {user?.avatar ? (
                    <img src={user.avatar} alt={user?.name} />
                  ) : (
                    <div className="avatar-placeholder">
                      {user?.name?.[0]?.toUpperCase() || '?'}
                    </div>
                  )}
                  {runner.isResting && (
                    <div className="rest-indicator">💤</div>
                  )}
                </div>
                <div className="runner-info">
                  <span className="runner-name">
                    {user?.name || 'Unknown'}
                    {isCurrentUser && ' (あなた)'}
                  </span>
                  <span className="runner-progress">{runner.position.toFixed(0)}%</span>
                  {user?.currentTask && (
                    <span className="current-task">{user.currentTask.title}</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* ゴールライン */}
        <div className="track-line finish-line">
          <span className="line-label">ゴール</span>
        </div>
      </div>

      {/* 進捗インジケーター */}
      <div className="progress-indicators">
        <div className="indicator">
          <span className="indicator-dot running"></span>
          <span>作業中</span>
        </div>
        <div className="indicator">
          <span className="indicator-dot resting"></span>
          <span>休憩中</span>
        </div>
        <div className="indicator">
          <span className="indicator-dot current"></span>
          <span>あなた</span>
        </div>
      </div>
    </div>
  );
};
