import { atom } from 'jotai';

export const IsEditConveyor = atom<{
  stationId: string;
  forkHeight: number;
  activeLoad: boolean;
  activeOffload: boolean;
} | null>(null);
