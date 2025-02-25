import { useQuery } from '@tanstack/react-query'
import { array, object, string, boolean, date } from 'yup'
import api from './axiosClient'

export type CargoAreaInfo = {
  cargoName: string
  hasCargo: {
    [level: number]: boolean
  }
  areaId: string
  isDropping: boolean
}

const getLocations = async () => {
  const { data } = await api.get<unknown>('api/test/locations')
  const schema = () =>
    object({
      chargingStations: array(
        object({
          id: string().optional(),
          isInService: boolean().optional(),
          booker: string().optional().nullable(),
          info: object({
            responseTime: date().optional(),
            current: object({
              AUTO_MODE: boolean().optional(),
              COMPLETE: boolean().optional(),
              FAULT: boolean().optional(),
              PROCESS: boolean().optional(),
              STANDBY: boolean().optional()
            }).optional(),
            error: object({
              MODULE_COMMUNICATION_FAILURE: boolean().optional(),
              REVERSE_BATTERY_CONNECTION: boolean().optional(),
              BATTERY_NOT_CONNECTED: boolean().optional(),
              SHORT_CIRCUIT: boolean().optional(),
              OVER_VOLTAGE: boolean().optional(),
              OVER_CURRENT: boolean().optional(),
              TOTAL_FAULT: boolean().optional()
            }).optional(),
            other: object({
              INFRARED_IN_PLACE: boolean().optional(),
              COMPRESS: boolean().optional(),
              SCALING_FAILURE: boolean().optional(),
              REACH_OUT_CHARGE: boolean().optional(),
              RETURNING: boolean().optional(),
              IS_STRETCHING_OUT: boolean().optional(),
              RESET: boolean().optional()
            }).optional()
          })
            .optional()
            .nullable()
        }).required()
      ).required(),
      cargoArea: array(
        object({
          id: string().optional(),
          areaId: string().optional(),
          booker: string().optional(),
          occupier: string().optional(),
          info: object({
            name: string().optional().nullable(),
            layer: array().optional(),
            areaId: string().optional(),
            isDropping: boolean().optional()
          }).optional()
        }).required()
      ).required()
    }).required()
  try {
    await schema().validate(data)
  } catch (error) {
    console.log('use loaction has error')
    console.log(error)
    // 這邊如果有報錯 可以把require 改optional
  }
  const result = await schema().validate(data)
  return result
}
const useLocation = () => {
  return useQuery(['locations'], getLocations, {
    refetchInterval: 3000
  })
}

export default useLocation
