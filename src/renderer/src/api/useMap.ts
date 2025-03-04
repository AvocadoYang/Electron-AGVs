/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { useQuery } from '@tanstack/react-query'
import { array, boolean, lazy, mixed, number, object, string } from 'yup'
import { MISSION_CONTROL_URL } from '../configs/config'
import api from './axiosClient'

const getMap = async () => {
  const { data } = await api.get<unknown>('map')
  const schema = object({
    locations: array(
      object({
        locationId: string().required(),
        x: number().required(),
        y: number().required(),
        canRotate: boolean().required(),
        areaType: string().required()
      }).required()
    ).required(),
    roads: array(
      object({
        roadId: string().required(),
        roadType: mixed<'oneWayRoad' | 'twoWayRoad'>()
          .oneOf(['oneWayRoad', 'twoWayRoad'])
          .required(),
        spot1Id: string().required(),
        spot2Id: string().required(),
        x1: number().required(),
        y1: number().required(),
        disabled: boolean().required(),
        limit: boolean().required(),
        x2: number().required(),
        y2: number().required(),
        validYawList: lazy((value) => {
          if (typeof value === 'string') return mixed<'*'>().oneOf(['*']).required()
          return array(number().min(0).max(360).required()).required()
        }),
        tolerance: number().optional(),
        cost: number().optional(),
        inflationRadius: number().optional()
      }).required()
    ).required(),
    zones: array(
      object({
        id: string().required(),
        name: string().required(),
        backgroundColor: string().required(),
        category: array(string().required()).required(),
        tagSetting: object({
          speed_limit: number().nullable(),
          hight_limit: number().nullable(),
          forbidden_car: array(string()).nullable()
        }),
        startPoint: object({
          startX: number().required(),
          startY: number().required()
        }).required(),
        endPoint: object({
          endX: number().required(),
          endY: number().required()
        }).required()
      })
    ).required(),
    mapWidth: number().positive().required(),
    mapHeight: number().positive().required(),
    mapOriginX: number().required(),
    mapOriginY: number().required(),
    mapResolution: number().positive().required(),
    imageUrl: string().optional()
  }).required()

  const parsed = await schema.validate(data, { stripUnknown: true })
  if (parsed.imageUrl) {
    parsed.imageUrl = `${MISSION_CONTROL_URL.replace('localhost', location.host).replace(
      '3001',
      '4000'
    )}${parsed.imageUrl}`
  }
  return parsed
}

const useMap = () => {
  return useQuery(['map'], getMap)
}

export default useMap
