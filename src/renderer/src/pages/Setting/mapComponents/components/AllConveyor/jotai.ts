import { Relation } from '@renderer/api/useLoc';
import { atom } from 'jotai';

export const IsEditConveyor = atom<{
  stationId: string;
  forkHeight: number;
  activeLoad: boolean;
  activeOffload: boolean;
  loadMissionId: string;
  offloadMissionId: string;
  placement_priority: number;
  relationships: Relation;
} | null>(null);
