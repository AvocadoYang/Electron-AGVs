import { CargoInfo } from '@renderer/sockets/useCargoInfo';
import { Cargo } from '@renderer/types/peripheral';
import { atom } from 'jotai';

export const GlobalCargoInfoModal = atom<boolean>(false);
export const BaseGlobalCargoInfoModal = atom<boolean>(false);

export const GlobalCargoInfo = atom<{
  dbId: string | null;
  locationId: string | null;
  level: number;
  cargo: Cargo[];
}>({
  dbId: null,
  locationId: null,
  level: -1,
  cargo: []
});

export const GlobalCargoData = atom<{
  id: string | null;
  locationId: string | null;
  shelfInfo: CargoInfo | null;
}>({
  id: null,
  locationId: null,
  shelfInfo: null
});
