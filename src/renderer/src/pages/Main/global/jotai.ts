import { atom } from 'jotai';

export enum ViewBtn {
  mapView,
  missionView,
  infoView,
  alertView
}

export const viewBtn = atom<ViewBtn>(ViewBtn.missionView);

export const Open2DMap = atom<boolean>(false);

export const Open3DMap = atom<boolean>(false);

export const OpenQuickMission = atom<boolean>(false);

export const OpenAssignMission = atom<boolean>(false);

export const OpenAutoMission = atom<boolean>(false);

export const OpenInputMission = atom<boolean>(false);

export const OpenCarCardInfo = atom<boolean>(false);

export const OpenMissionCardInfo = atom<boolean>(false);

export type Quick_Mission = {
  actionType: 'load' | 'offload';
  locationId: string;
  level: number;
};

export const QuickMissionPayload = atom<Quick_Mission[]>();
