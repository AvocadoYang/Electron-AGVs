import { atom } from 'jotai';
import { OutputForm } from '../type/common';
import { ZoneValue } from './type';

export const isSelectCargo = atom<boolean>(false);
export const outputFormData = atom<OutputForm | null>(null);
export const selectLocations = atom<string[] | null>(null);

export const SelectByZone = atom<boolean>(true);
export const zoneValue = atom<ZoneValue>({ startX: 0, startY: 0, endX: 0, endY: 0 });
