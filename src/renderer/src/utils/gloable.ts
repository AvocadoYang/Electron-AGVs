import { atom } from 'jotai';
import { LocationType } from './jotai';


export const startMousePoint = atom(false)


export const tempEditLocationList = atom<Array<LocationType>>([])
