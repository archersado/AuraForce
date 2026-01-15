/**
 * 阿瓦隆桌游助手 - 游戏状态管理 (Zustand)
 */

import { create } from 'zustand';
import { Game, Player, Role, MissionResult } from './types';
import {
  createGame,
  initializePlayer,
  getPlayerView,
  selectTeam,
  submitVote,
  submitMissionResult,
  assassinateMerlin,
  getGameResult,
} from './game-logic';

interface AvalonState {
  // 游戏状态
  game: Game | null;
  currentPlayerId: string | null;

  // 初始化游戏
  initGame: (playerCount: number, additionalRoles: Role[], playerNames: string[]) => void;
  joinAsPlayer: (playerId: string) => void;
  resetGame: () => void;

  // 游戏操作
  selectTeam: (teamPlayerIds: string[]) => void;
  vote: (approved: boolean) => void;
  submitMissionResult: (result: MissionResult) => void;
  assassinate: (targetId: string) => void;

  // 获取当前玩家视图
  getCurrentPlayer: () => Player | undefined;
  getPlayerView: () => ReturnType<typeof getPlayerView> | null;
  getGameResult: () => ReturnType<typeof getGameResult>;
}

export const useAvalonStore = create<AvalonState>((set, get) => ({
  game: null,
  currentPlayerId: null,

  initGame: (playerCount: number, additionalRoles: Role[], playerNames: string[]) => {
    try {
      const game = createGame(playerCount, additionalRoles);
      const players = playerNames.map((name, index) => initializePlayer(game, name, index));

      set({
        game: {
          ...game,
          players,
          state: {
            ...game.state,
            currentLeaderId: players[0].id,
            phase: 'TeamSelection' as any,
          },
        },
        currentPlayerId: null,
      });
    } catch (error) {
      console.error('Failed to initialize game:', error);
      throw error;
    }
  },

  joinAsPlayer: (playerId: string) => {
    set({ currentPlayerId: playerId });
  },

  resetGame: () => {
    set({ game: null, currentPlayerId: null });
  },

  selectTeam: (teamPlayerIds: string[]) => {
    const { game } = get();
    if (!game) return;

    try {
      const updatedGame = selectTeam(game, teamPlayerIds);
      set({ game: updatedGame });
    } catch (error) {
      console.error('Failed to select team:', error);
      throw error;
    }
  },

  vote: (approved: boolean) => {
    const { game, currentPlayerId } = get();
    if (!game || !currentPlayerId) return;

    try {
      const updatedGame = submitVote(game, currentPlayerId, approved);
      set({ game: updatedGame });
    } catch (error) {
      console.error('Failed to submit vote:', error);
      throw error;
    }
  },

  submitMissionResult: (result: MissionResult) => {
    const { game, currentPlayerId } = get();
    if (!game || !currentPlayerId) return;

    try {
      const updatedGame = submitMissionResult(game, currentPlayerId, result);
      set({ game: updatedGame });
    } catch (error) {
      console.error('Failed to submit mission result:', error);
      throw error;
    }
  },

  assassinate: (targetId: string) => {
    const { game } = get();
    if (!game) return;

    try {
      const updatedGame = assassinateMerlin(game, game.players.find(p => p.role === 'Assassin')?.id || '', targetId);
      set({ game: updatedGame });
    } catch (error) {
      console.error('Failed to assassinate:', error);
      throw error;
    }
  },

  getCurrentPlayer: () => {
    const { game, currentPlayerId } = get();
    return game?.players.find(p => p.id === currentPlayerId);
  },

  getPlayerView: () => {
    const { game, currentPlayerId } = get();
    const currentPlayer = game?.players.find(p => p.id === currentPlayerId);

    if (!game || !currentPlayer) {
      return null;
    }

    return getPlayerView(currentPlayer, game.players);
  },

  getGameResult: () => {
    const { game } = get();
    return game ? getGameResult(game) : null;
  },
}));
