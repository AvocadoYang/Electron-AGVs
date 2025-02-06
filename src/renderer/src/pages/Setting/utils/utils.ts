/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { LocationType } from '@renderer/utils/jotai'

export const getLocationInfoById = (locationId: string, locationList: Array<LocationType>) => {
  const result = locationList.filter((v) => v.locationId.toString() === locationId)
  return result[0]
}

export const getMoveIndex = (array, dragItem) => {
  const { active, over } = dragItem
  let activeIndex = 0
  let overIndex = 0
  try {
    // 找出active和over的index
    array.forEach((item, index) => {
      if (active.id === item.key) {
        activeIndex = index
      }
      if (over.id === item.key) {
        overIndex = index
      }
    })
  } catch (error) {
    overIndex = activeIndex // 如果有問題就復位
  }
  return { activeIndex, overIndex }
}
