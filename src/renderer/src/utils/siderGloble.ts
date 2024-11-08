import { atom } from 'jotai'

/** 1-1 編輯點位開關 */
export const EditLocationPanelSwitch = atom<boolean>(false)

/** 1-2 已存在點為開關 */
export const StoredLocationSwitch = atom<boolean>(false)

/** 1-3  顯示編輯終點位開關 */
export const EditingLocationSwitch = atom<boolean>(false)

/** 2-1 編輯路徑開關 */
export const EditRoadPanelSwitch = atom<boolean>(false)
