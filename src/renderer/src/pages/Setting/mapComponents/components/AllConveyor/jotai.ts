import { atom } from 'jotai';

export const IsEditConveyor = atom<{
  stationId: string;
  forkHeight: number;
  activeLoad: boolean;
  activeOffload: boolean;
  loadMissionId: string;
  offloadMissionId: string;
} | null>(null);
