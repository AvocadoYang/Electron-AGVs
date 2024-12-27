import { atom } from 'jotai'

/** 1-1 編輯點位開關 */
export const EditLocationPanelSwitch = atom<boolean>(false)

/** 1-2 已存在點為開關 */
export const StoredLocationSwitch = atom<boolean>(false)

/** 1-3  顯示編輯中點位開關 */
export const EditingLocationSwitch = atom<boolean>(false)

/** 1-4 顯示所有點位表單 */
export const EditLocationListTableSwitch = atom<boolean>(false)

/** 2-1 編輯路徑開關 */
export const EditRoadPanelSwitch = atom<boolean>(false)

/** 2-2 已存在路徑為開關 */
export const StoredRoadSwitch = atom<boolean>(false)

/** 2-3 編輯中路徑為開關 */
export const EditingRoadSwitch = atom<boolean>(false)

/** 2-4 顯示所有路徑表單 */
export const EditRoadListFormSwitch = atom<boolean>(false)

export const SideSwitchToShowForm = atom<boolean>(false)
