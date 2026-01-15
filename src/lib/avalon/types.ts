/**
 * 阿瓦隆桌游助手 - 类型定义
 */

// 角色类型
export enum Role {
  // 好人阵营
  Mordred = 'Mordred',           // 莫德雷德 - 坏人，但梅林不知道他是坏人
  Oberon = 'Oberon',             // 奥伯伦 - 坏人，但看不到其他坏人
  Minion = 'Minion',             // 普通刺客
  Assassin = 'Assassin',         // 刺客 - 可以刺杀梅林
  Merlin = 'Merlin',             // 梅林 - 知道所有坏人是谁
  Percival = 'Percival',         // 帕西瓦尔 - 知道谁是梅林
  Servant = 'Servant',           // 普通亚瑟忠臣
}

export enum Faction {
  Good = 'Good',    // 好人阵营
  Evil = 'Evil',    // 坏人阵营
}

export interface Player {
  id: string;
  name: string;
  role: Role;
  faction: Faction;
  isAlive: boolean;
  revealedTo?: Role[]; // 该角色的身份已被哪些角色看到
}

// 任务配置
export interface MissionConfig {
  playerCount: number;
  missionSizes: number[];  // 每个任务需要的人数
  requiredFails: number[]; // 每个任务需要多少个失败才能失败
  maxFails: number;        // 最大失败次数
}

// 预设的玩家配置
export const MISSION_CONFIGS: Record<number, MissionConfig> = {
  5: {
    playerCount: 5,
    missionSizes: [2, 3, 2, 3, 3],
    requiredFails: [1, 1, 1, 1, 1],
    maxFails: 3,
  },
  6: {
    playerCount: 6,
    missionSizes: [2, 3, 4, 3, 4],
    requiredFails: [1, 1, 1, 1, 1],
    maxFails: 3,
  },
  7: {
    playerCount: 7,
    missionSizes: [2, 3, 3, 4, 4],
    requiredFails: [1, 1, 1, 2, 1],
    maxFails: 3,
  },
  8: {
    playerCount: 8,
    missionSizes: [3, 4, 4, 5, 5],
    requiredFails: [1, 1, 1, 2, 1],
    maxFails: 3,
  },
  9: {
    playerCount: 9,
    missionSizes: [3, 4, 4, 5, 5],
    requiredFails: [1, 1, 1, 2, 1],
    maxFails: 3,
  },
  10: {
    playerCount: 10,
    missionSizes: [3, 4, 4, 5, 5],
    requiredFails: [1, 1, 1, 2, 1],
    maxFails: 3,
  },
};

// 任务状态
export enum MissionResult {
  Success = 'Success',
  Fail = 'Fail',
}

export interface MissionState {
  missionNumber: number;
  team: string[];          // 任务团队成员ID
  votes: Map<string, boolean>;  // 投票结果: playerId -> approve (true) or reject (false)
  approved: boolean;       // 是否通过投票
  results: Map<string, MissionResult>;  // 执行结果: playerId -> result
  finalResult?: MissionResult;
}

// 游戏阶段
export enum GamePhase {
  Setup = 'Setup',           // 设置阶段
  TeamSelection = 'TeamSelection',  // 队长选择团队成员
  Voting = 'Voting',         // 投票阶段
  MissionExecution = 'MissionExecution',  // 执行任务阶段
  GameOver = 'GameOver',     // 游戏结束
}

export interface GameState {
  id: string;
  phase: GamePhase;
  currentMission: number;
  currentLeaderId: string;
  missions: MissionState[];
  failedVotesInRow: number;
  goodWins: number;
  evilWins: number;
  assassinSucceed?: boolean; // 刺客是否成功刺杀梅林
}

export interface Game {
  id: string;
  config: MissionConfig;
  roles: Role[];            // 使用的角色列表
  players: Player[];
  state: GameState;
  createdAt: Date;
}

// 角色信息
export interface RoleInfo {
  role: Role;
  faction: Faction;
  name: string;
  description: string;
  minPlayers?: number;
}
