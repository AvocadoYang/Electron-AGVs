/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { LocationType } from '@renderer/utils/jotai'

export const getLocationInfoById = (locationId: string, locationList: Array<LocationType>) => {
  const result = locationList.filter((v) => v.locationId.toString() === locationId)
  return result[0]
}
