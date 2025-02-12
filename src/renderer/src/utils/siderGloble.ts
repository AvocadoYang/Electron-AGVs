import { atom } from 'jotai'

/** 1-1 編輯點位開關 */
export const EditLocationPanelSwitch = atom<boolean>(false)

/** 1-2 快速編輯點位開關 */
export const QuickEditLocationPanelSwitch = atom<boolean>(false)

/** 1-3 顯示所有點位表單 */
export const EditLocationListTableSwitch = atom<boolean>(false)

/** 2-1 編輯路徑開關 */
export const EditRoadPanelSwitch = atom<boolean>(false)

/** 2-2 顯示所有路徑表單 */
export const RoadListTableSwitch = atom<boolean>(false)

/** 4-1 顯示 編輯貨架 */
export const EditShelfPanelSwitch = atom<boolean>(false)

/** 4-2 顯示 編輯貨架種類 */
export const EditShelfCategoryPanelSwitch = atom<boolean>(false)

/** 4-3 顯示 編輯YAW */
export const EditShelfYawPanelSwitch = atom<boolean>(false)

/** 4-4 顯示 編輯棧版 */
export const EditPalletSwitch = atom<boolean>(false)

export const SideSwitchToShowForm = atom<boolean>(false)

/** 地點tooltip */
export const isShowLocationTooltip = atom<boolean>(false)

/** 路線tooltip */
export const isShowRoadTooltip = atom<boolean>(false)

/** 顯示目前地點 */
export const isShowLocation = atom<boolean>(true)

/** 顯示目前路徑 */
export const isShowRoad = atom<boolean>(true)
