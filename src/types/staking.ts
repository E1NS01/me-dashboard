export interface Staker {
  wallet: string;
  uiStakingPower: number;
  uiAmount: number;
  startTs: number;
  endTs: number;
  duration: number;
}

export interface StakingData {
  id: number;
  timestamp: string;
  staker: number;
  stakingPower: number;
  stakedME: number;
}

export interface ChartRanges {
  activeStakerRange: [number, number];
  stakedMERange: [number, number];
  stakingPowerRange: [number, number];
}
