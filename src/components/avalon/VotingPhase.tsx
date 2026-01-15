/**
 * 阿瓦隆桌游助手 - 投票阶段
 */

'use client';

import React, { useState, useEffect } from 'react';
import { Game, Player } from '../../../lib/avalon/types';
import { useAvalonStore } from '../../../lib/avalon/store';

interface VotingPhaseProps {
  game: Game;
  currentPlayer: Player | undefined;
}

export function VotingPhase({ game, currentPlayer }: VotingPhaseProps) {
  const [hasVoted, setHasVoted] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const currentMission = game.state.missions[game.state.currentMission];
  const vote = useAvalonStore(state => state.vote);

  const hasCurrentPlayerVoted = currentMission.votes.has(currentPlayer?.id || '');
  const allVoted = currentMission.votes.size === game.players.length;

  useEffect(() => {
    setHasVoted(hasCurrentPlayerVoted);
    setShowResults(allVoted);
  }, [hasCurrentPlayerVoted, allVoted]);

  const handleVote = (approved: boolean) => {
    if (hasVoted || !currentPlayer) return;
    vote(approved);
  };

  const approvals = Array.from(currentMission.votes.values()).filter(v => v).length;
  const rejects = currentMission.votes.size - approvals;

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold mb-2">团队投票</h2>
        <p className="text-gray-600">请投票决定是否通过该团队</p>
      </div>

      {/* 显示团队 */}
      <div className="mb-6">
        <div className="text-sm font-semibold text-gray-500 mb-3">任务团队</div>
        <div className="flex flex-wrap justify-center gap-2">
          {currentMission.team.map(playerId => {
            const player = game.players.find(p => p.id === playerId);
            return (
              <span
                key={playerId}
                className="px-4 py-2 bg-purple-100 border-2 border-purple-400 rounded-lg font-medium"
              >
                {player?.name}
              </span>
            );
          })}
        </div>
      </div>

      {/* 如果所有人都投票了，显示结果 */}
      {showResults && (
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <div className="text-center mb-4">
            <div className={`text-2xl font-bold ${
              currentMission.approved ? 'text-green-600' : 'text-red-600'
            }`}>
              {currentMission.approved ? '✓ 团队通过' : '✗ 团队未通过'}
            </div>
            <div className="text-sm text-gray-600">
              同意: {approvals} · 反对: {rejects}
            </div>
          </div>

          {/* 显示每个人的投票结果 */}
          {currentMission.approved && (
            <div className="text-center">
              <p className="text-sm text-gray-600">任务团队准备执行任务</p>
            </div>
          )}

          {!currentMission.approved && (
            <div className="text-center">
              <p className="text-sm text-gray-600">
                连续失败投票: {game.state.failedVotesInRow} / 5
              </p>
              <p className="text-xs text-gray-500 mt-1">
                下一位队长将成为 {game.players.find(p => p.id === game.state.currentLeaderId)?.name}
              </p>
            </div>
          )}
        </div>
      )}

      {/* 投票按钮 */}
      {!hasVoted && currentPlayer && (
        <div className="flex gap-4">
          <button
            onClick={() => handleVote(false)}
            disabled={hasVoted}
            className="flex-1 py-4 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors text-lg"
          >
            <span className="text-2xl mr-2">✗</span>
            反对
          </button>
          <button
            onClick={() => handleVote(true)}
            disabled={hasVoted}
            className="flex-1 py-4 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors text-lg"
          >
            <span className="text-2xl mr-2">✓</span>
            同意
          </button>
        </div>
      )}

      {/* 已投票提示 */}
      {hasVoted && !showResults && (
        <div className="text-center py-4 bg-gray-50 rounded-lg">
          <p className="font-medium">你已投票</p>
          <p className="text-sm text-gray-600">等待其他玩家投票...</p>
          <p className="text-xs text-gray-500 mt-2">
            已投票: {currentMission.votes.size} / {game.players.length}
          </p>
        </div>
      )}

      {/* 如果不是当前玩家，显示提示 */}
      {!currentPlayer && (
        <div className="text-center py-4 bg-gray-50 rounded-lg">
          <p>请将设备传递给其他玩家投票</p>
          <p className="text-sm text-gray-600 mt-2">
            已投票: {currentMission.votes.size} / {game.players.length}
          </p>
        </div>
      )}
    </div>
  );
}
