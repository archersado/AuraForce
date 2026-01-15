/**
 * 阿瓦隆桌游助手 - 队伍选择阶段
 */

'use client';

import React, { useState } from 'react';
import { Game, Player } from '../../../lib/avalon/types';
import { useAvalonStore } from '../../../lib/avalon/store';

interface TeamSelectionPhaseProps {
  game: Game;
  currentPlayer: Player | undefined;
}

export function TeamSelectionPhase({ game, currentPlayer }: TeamSelectionPhaseProps) {
  const [selectedPlayers, setSelectedPlayers] = useState<string[]>([]);

  const currentMissionSize = game.config.missionSizes[game.state.currentMission];
  const isLeader = currentPlayer?.id === game.state.currentLeaderId;
  const selectTeam = useAvalonStore(state => state.selectTeam);

  const handlePlayerToggle = (playerId: string) => {
    if (!isLeader) return;

    setSelectedPlayers(prev => {
      if (prev.includes(playerId)) {
        return prev.filter(id => id !== playerId);
      } else if (prev.length < currentMissionSize) {
        return [...prev, playerId];
      }
      return prev;
    });
  };

  const handleConfirmTeam = () => {
    if (selectedPlayers.length !== currentMissionSize) {
      alert(`请选择 ${currentMissionSize} 名玩家参与任务`);
      return;
    }
    selectTeam(selectedPlayers);
  };

  const currentMission = game.state.missions[game.state.currentMission];

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold mb-2">任务 {game.state.currentMission + 1}</h2>
        <p className="text-gray-600">
          {currentMission.team.length > 0 ? '团队投票阶段' : '队长选择任务团队'}
        </p>
      </div>

      {/* 如果已经有团队，显示团队信息 */}
      {currentMission.team.length > 0 ? (
        <div className="text-center">
          <div className="mb-4">
            <div className="text-lg font-semibold mb-2">选定的任务团队</div>
            <div className="flex flex-wrap justify-center gap-2">
              {currentMission.team.map(playerId => {
                const player = game.players.find(p => p.id === playerId);
                return (
                  <span
                    key={playerId}
                    className="px-4 py-2 bg-purple-100 border-2 border-purple-400 rounded-lg font-medium"
                  >
                    {player?.name || 'Unknown'}
                  </span>
                );
              })}
            </div>
          </div>
          <p className="text-gray-600">请所有玩家对团队进行投票</p>
        </div>
      ) : (
        <>
          {isLeader ? (
            <>
              <div className="mb-4 text-center">
                <p className="text-lg">
                  请选择 <strong>{currentMissionSize}</strong> 名玩家参与任务
                </p>
                <p className="text-gray-600">
                  已选择: {selectedPlayers.length} / {currentMissionSize}
                </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 mb-6">
                {game.players.map((player, index) => {
                  const isSelected = selectedPlayers.includes(player.id);
                  const isLeader = player.id === game.state.currentLeaderId;

                  // 队长不能选自己进入第一轮任务（可选规则）
                  const isDisabled = isLeader && game.state.currentMission === 0;

                  return (
                    <button
                      key={player.id}
                      onClick={() => !isDisabled && handlePlayerToggle(player.id)}
                      disabled={!isLeader}
                      className={`p-4 rounded-lg border-2 text-center transition-all ${
                        isSelected
                          ? 'border-purple-500 bg-purple-100 text-purple-900'
                          : isDisabled
                          ? 'border-gray-200 bg-gray-50 text-gray-400 cursor-not-allowed'
                          : 'border-gray-200 bg-white hover:border-purple-300 text-gray-900'
                      }`}
                    >
                      <div className="font-medium text-lg">{player.name}</div>
                      {isLeader && <div className="text-xs text-yellow-700 mt-1">👑 队长</div>}
                    </button>
                  );
                })}
              </div>

              <button
                onClick={handleConfirmTeam}
                disabled={selectedPlayers.length !== currentMissionSize}
                className="w-full py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
              >
                确认团队
              </button>
            </>
          ) : (
            <div className="text-center py-8 bg-gray-50 rounded-lg">
              <p className="text-lg">
                等待队长 <strong>{game.players.find(p => p.id === game.state.currentLeaderId)?.name}</strong> 选择任务团队
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
}
