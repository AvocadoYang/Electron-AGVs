import { CargoInfo } from '@renderer/sockets/useCargoInfo';
import { atom } from 'jotai';

export const GlobalCargoInfoModal = atom<boolean>(false);
export const BaseGlobalCargoInfoModal = atom<boolean>(false);

export const GlobalCargoInfo = atom<{
  dbId: string | null;
  locationId: string | null;
  level: number;
  cargoInfoId: string | null;
  customCargoMetadataId: string | null;
  metadata: string | null;
}>({
  dbId: null,
  locationId: null,
  level: -1,
  cargoInfoId: null,
  customCargoMetadataId: null,
  metadata: null
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
