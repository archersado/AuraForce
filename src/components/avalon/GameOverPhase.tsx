/**
 * 阿瓦隆桌游助手 - 游戏结束阶段
 */

'use client';

import React, { useState } from 'react';
import { Game } from '../../../lib/avalon/types';
import { Faction } from '../../../lib/avalon/types';
import { useAvalonStore } from '../../../lib/avalon/store';
import { Role, ROLE_NAMES, ROLE_FACTION } from '../../../lib/avalon/types';

interface GameOverPhaseProps {
  game: Game;
}

export function GameOverPhase({ game }: GameOverPhaseProps) {
  const [showRoles, setShowRoles] = useState(false);
  const [assassinTarget, setAssassinTarget] = useState<string | null>(null);

  const assassinate = useAvalonStore(state => state.assassinate);
  const resetGame = useAvalonStore(state => state.resetGame);

  const result = (() => {
    if (game.state.failedVotesInRow >= 5) {
      return { winner: Faction.Evil, reason: '五次团队投票失败，坏人获胜' };
    }
    if (game.state.evilWins >= 3) {
      return { winner: Faction.Evil, reason: '坏人赢得3个任务' };
    }
    if (game.state.goodWins >= 3) {
      if (game.state.assassinSucceed === true) {
        return { winner: Faction.Evil, reason: '刺客成功刺杀梅林，坏人获胜' };
      } else if (game.state.assassinSucceed === false) {
        return { winner: Faction.Good, reason: '好人赢得3个任务，刺客未刺中梅林，好人获胜' };
      }
      return { winner: Faction.Good, reason: '好人赢得3个任务' };
    }
    return { winner: Faction.Good, reason: '游戏结束' };
  })();

  const showAssassination = result.winner === Faction.Good && game.state.assassinSucceed === undefined;
  const assassin = game.players.find(p => p.role === Role.Assassin);
  const merlin = game.players.find(p => p.role === Role.Merlin);

  const handleAssassinate = () => {
    if (!assassinTarget || !assassin) return;
    assassinate(assassin.id, assassinTarget);
    setShowRoles(true);
  };

  return (
    <div className="max-w-2xl mx-auto">
      {/* 游戏结果 */}
      <div className={`bg-white rounded-lg shadow-lg p-8 mb-6 text-center ${
        result.winner === Faction.Good ? 'border-4 border-green-500' : 'border-4 border-red-500'
      }`}>
        <div className={`text-4xl font-bold mb-4 ${
          result.winner === Faction.Good ? 'text-green-600' : 'text-red-600'
        }`}>
          {result.winner === Faction.Good ? '🎉 好人获胜!' : '🔥 坏人获胜!'}
        </div>
        <div className="text-xl text-gray-700 mb-2">{result.reason}</div>
      </div>

      {/* 刺杀阶段 */}
      {showAssassination && assassin && (
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-2xl font-bold text-center mb-4">刺客选择</h2>
          <div className="text-center mb-6 bg-red-50 p-4 rounded-lg">
            <p className="text-lg mb-2">
              <span className="font-bold">{assassin.name}</span> (刺客)
            </p>
            <p className="text-sm text-red-800">
              好人已经赢得了3个任务。你现在有机会通过刺杀梅林来让坏人获胜！
            </p>
          </div>

          <div className="mb-4">
            <label className="text-sm font-semibold mb-2 block">选择你认为的梅林：</label>
            <div className="grid grid-cols-2 gap-3">
              {game.players.filter(p => p.id !== assassin.id).map(player => (
                <button
                  key={player.id}
                  onClick={() => setAssassinTarget(player.id)}
                  className={`p-3 border-2 rounded-lg text-center transition-all ${
                    assassinTarget === player.id
                      ? 'border-red-500 bg-red-50'
                      : 'border-gray-300 hover:border-red-300'
                  }`}
                >
                  {player.name}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={handleAssassinate}
            disabled={!assassinTarget}
            className="w-full py-3 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            确认刺杀
          </button>
        </div>
      )}

      {/* 查看所有角色 */}
      {(!showAssassination || game.state.assassinSucceed !== undefined) && (
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">所有角色揭晓</h2>
            <button
              onClick={() => setShowRoles(!showRoles)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              {showRoles ? '隐藏角色' : '显示角色'}
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {game.players.map(player => (
              <div
                key={player.id}
                className={`p-3 border-2 rounded-lg text-center ${
                  showRoles
                    ? ROLE_FACTION[player.role] === Faction.Good
                      ? 'border-blue-400 bg-blue-50'
                      : 'border-red-400 bg-red-50'
                    : 'border-gray-200'
                }`}
              >
                <div className="font-medium">{player.name}</div>
                {showRoles && (
                  <div className="text-sm mt-1">
                    <div className="font-semibold">{ROLE_NAMES[player.role]}</div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 重新开始按钮 */}
      <div className="flex gap-4">
        <button
          onClick={resetGame}
          className="flex-1 py-3 bg-gray-600 text-white font-semibold rounded-lg hover:bg-gray-700 transition-colors"
        >
          返回首页
        </button>
        <button
          onClick={resetGame}
          className="flex-1 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
        >
          新游戏
        </button>
      </div>
    </div>
  );
}
