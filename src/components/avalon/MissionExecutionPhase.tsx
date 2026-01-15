/**
 * 阿瓦隆桌游助手 - 任务执行阶段
 */

'use client';

import React, { useState, useEffect } from 'react';
import { Game, Player, MissionResult } from '../../../lib/avalon/types';
import { useAvalonStore } from '../../../lib/avalon/store';

interface MissionExecutionPhaseProps {
  game: Game;
  currentPlayer: Player | undefined;
}

export function MissionExecutionPhase({ game, currentPlayer }: MissionExecutionPhaseProps) {
  const [hasActed, setHasActed] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const currentMission = game.state.missions[game.state.currentMission];
  const submitMissionResult = useAvalonStore(state => state.submitMissionResult);

  const isInTeam = currentMission.team.includes(currentPlayer?.id || '');
  const hasCurrentPlayerActed = currentMission.results.has(currentPlayer?.id || '');
  const allActed = currentMission.results.size === currentMission.team.length;

  useEffect(() => {
    setHasActed(hasCurrentPlayerActed);
    setShowResults(allActed);
  }, [hasCurrentPlayerActed, allActed]);

  const handleSubmitResult = (result: MissionResult) => {
    if (!currentPlayer || !isInTeam) return;
    submitMissionResult(result);
  };

  const fails = Array.from(currentMission.results.values()).filter(r => r === MissionResult.Fail).length;
  const requiredFails = game.config.requiredFails[game.state.currentMission];

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold mb-2">任务执行</h2>
        <div className="text-sm text-gray-600">
          需要 {currentMission.team.length} 人参与 · 需要 {requiredFails > 1 ? requiredFails : ''}个失败即失败
        </div>
      </div>

      {/* 显示团队成员 */}
      <div className="mb-6">
        <div className="text-sm font-semibold text-gray-500 mb-3">任务团队成员</div>
        <div className="flex flex-wrap justify-center gap-2">
          {currentMission.team.map(playerId => {
            const player = game.players.find(p => p.id === playerId);
            const hasActed = currentMission.results.has(playerId);

            return (
              <span
                key={playerId}
                className={`px-4 py-2 border-2 rounded-lg font-medium ${
                  hasActed ? 'border-green-400 bg-green-50' : 'border-purple-400 bg-purple-50'
                }`}
              >
                {player?.name}
              </span>
            );
          })}
        </div>
      </div>

      {/* 如果所有人都执行了，显示结果 */}
      {showResults && currentMission.finalResult && (
        <div className="mb-6 p-6 rounded-lg text-center">
          <div className={`text-3xl font-bold mb-2 ${
            currentMission.finalResult === MissionResult.Success ? 'text-green-600' : 'text-red-600'
          }`}>
            {currentMission.finalResult === MissionResult.Success ? '🎉 任务成功' : '💀 任务失败'}
          </div>
          <div className="text-sm text-gray-600">
            {fails} 个失败票 {requiredFails > 1 ? `(需要 ${requiredFails} 个)` : ''}
          </div>

          {/* 显示成功/失败的具体人数 */}
          {fails > 0 && (
            <div className="mt-3 text-sm text-gray-700">
              共有 {fails} 人选择破坏任务
            </div>
          )}
        </div>
      )}

      {/* 执行任务按钮 */}
      {isInTeam && !hasActed && currentPlayer && (
        <div>
          <div className="text-center mb-4">
            <p className="font-medium">你好, {currentPlayer.name}</p>
            <p className="text-sm text-gray-600">
              {currentPlayer.faction === 'Good'
                ? '作为好人，你只能执行成功'
                : '作为坏人，你可以选择破坏任务'}
            </p>
          </div>

          {currentPlayer.faction === 'Good' ? (
            <button
              onClick={() => handleSubmitResult(MissionResult.Success)}
              disabled={hasActed}
              className="w-full py-4 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors text-lg"
            >
              <span className="text-2xl mr-2">🎯</span>
              执行成功
            </button>
          ) : (
            <div className="flex gap-4">
              <button
                onClick={() => handleSubmitResult(MissionResult.Success)}
                disabled={hasActed}
                className="flex-1 py-4 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors text-lg"
              >
                <span className="text-2xl mr-2">🎯</span>
                执行成功
              </button>
              <button
                onClick={() => handleSubmitResult(MissionResult.Fail)}
                disabled={hasActed}
                className="flex-1 py-4 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors text-lg"
              >
                <span className="text-2xl mr-2">🔥</span>
                破坏任务
              </button>
            </div>
          )}
        </div>
      )}

      {/* 已执行提示 */}
      {hasActed && !showResults && (
        <div className="text-center py-4 bg-gray-50 rounded-lg">
          <p className="font-medium">你已执行</p>
          <p className="text-sm text-gray-600">等待其他团队成员...</p>
          <p className="text-xs text-gray-500 mt-2">
            已执行: {currentMission.results.size} / {currentMission.team.length}
          </p>
        </div>
      )}

      {/* 如果不是团队成员，显示提示 */}
      {!isInTeam && currentPlayer && (
        <div className="text-center py-4 bg-gray-50 rounded-lg">
          <p className="text-gray-600">你不是本次任务的成员</p>
          <p className="text-sm text-gray-500 mt-2">等待任务团队执行...</p>
          <p className="text-xs text-gray-500 mt-2">
            已执行: {currentMission.results.size} / {currentMission.team.length}
          </p>
        </div>
      )}

      {/* 如果不是当前玩家，显示提示 */}
      {!currentPlayer && (
        <div className="text-center py-4 bg-gray-50 rounded-lg">
          <p>请将设备传递给任务团队成员</p>
          <p className="text-sm text-gray-600 mt-2">
            已执行: {currentMission.results.size} / {currentMission.team.length}
          </p>
        </div>
      )}
    </div>
  );
}
