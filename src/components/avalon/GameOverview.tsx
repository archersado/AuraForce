/**
 * 阿瓦隆桌游助手 - 游戏概览面板
 */

'use client';

import React from 'react';
import { Game, Player } from '../../../lib/avalon/types';
import { MissionResult } from '../../../lib/avalon/types';

interface GameOverviewProps {
  game: Game;
  currentPlayer: Player | undefined;
}

export function GameOverview({ game, currentPlayer }: GameOverviewProps) {
  const currentMission = game.state.currentMission + 1;
  const currentMissionSize = game.config.missionSizes[game.state.currentMission];
  const currentLeader = game.players.find(p => p.id === game.state.currentLeaderId);

  const getMissionDisplay = (index: number) => {
    const mission = game.state.missions[index];
    const size = game.config.missionSizes[index];
    const requiredFails = game.config.requiredFails[index];

    let statusIcon = '⏳';
    if (mission.finalResult) {
      statusIcon = mission.finalResult === MissionResult.Success ? '🟢' : '🔴';
    } else if (index < game.state.currentMission) {
      statusIcon = mission.approved ? '⏸️' : '❌';
    }

    let bgColor = 'bg-gray-100';
    if (mission.finalResult) {
      bgColor = mission.finalResult === MissionResult.Success ? 'bg-green-100 border-green-400' : 'bg-red-100 border-red-400';
    } else if (index === game.state.currentMission) {
      bgColor = 'bg-blue-50 border-blue-400 border-2';
    }

    return (
      <div key={index} className={`${bgColor} border-2 rounded-lg p-3`}>
        <div className="flex items-center justify-between mb-2">
          <span className="font-semibold">任务 {index + 1}</span>
          <span className="text-xl">{statusIcon}</span>
        </div>
        <div className="text-sm text-gray-600">
          需要 {size} 人 · {requiredFails > 1 ? `${requiredFails} 个` : ''}失败即失败
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      {/* 当前游戏状态 */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="text-sm text-gray-500">当前阶段</div>
          <div className="text-lg font-bold">
            任务 {currentMission} · 队长: {currentLeader?.name || '...'}
          </div>
        </div>
        {currentPlayer && (
          <div className="text-right">
            <div className="text-sm text-gray-500">你在扮演</div>
            <div className="text-lg font-bold">{currentPlayer.name}</div>
          </div>
        )}
      </div>

      {/* 计分板 */}
      <div className="grid grid-cols-5 gap-2 mb-6">
        {game.state.missions.map((_, index) => getMissionDisplay(index))}
      </div>

      {/* 比分 */}
      <div className="flex justify-around py-3 bg-gray-100 rounded-lg">
        <div className="text-center">
          <div className="text-sm text-gray-500">好人</div>
          <div className="text-2xl font-bold text-green-600">{game.state.goodWins}</div>
        </div>
        <div className="text-center">
          <div className="text-sm text-gray-500">失败投票</div>
          <div className="text-2xl font-bold text-orange-600">
            {game.state.failedVotesInRow} / 5
          </div>
        </div>
        <div className="text-center">
          <div className="text-sm text-gray-500">坏人</div>
          <div className="text-2xl font-bold text-red-600">{game.state.evilWins}</div>
        </div>
      </div>

      {/* 玩家列表 */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <div className="text-sm font-semibold text-gray-500 mb-3">玩家列表</div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
          {game.players.map((player, index) => {
            const isCurrentLeader = player.id === game.state.currentLeaderId;
            const isCurrentPlayer = player.id === currentPlayer?.id;
            const currentMission = game.state.missions[game.state.currentMission];
            const isInTeam = currentMission.team.includes(player.id);

            return (
              <div
                key={player.id}
                className={`p-2 rounded-lg border-2 text-center ${
                  isCurrentLeader
                    ? 'border-yellow-400 bg-yellow-50'
                    : isCurrentPlayer
                    ? 'border-blue-400 bg-blue-50'
                    : isInTeam
                    ? 'border-purple-400 bg-purple-50'
                    : 'border-gray-200'
                }`}
              >
                <div className="font-medium">{player.name}</div>
                {isCurrentLeader && (
                  <div className="text-xs text-yellow-700">👑 队长</div>
                )}
                {isInTeam && !isCurrentLeader && (
                  <div className="text-xs text-purple-700">⚔️ 任务</div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
