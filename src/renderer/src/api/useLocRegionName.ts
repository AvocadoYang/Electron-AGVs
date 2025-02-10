import { useQuery } from '@tanstack/react-query'
import { InferType, array, number, object, string } from 'yup'
import client from './axiosClient'

const schema = array(
  object({
    id: number().required(),
    name: string().required(),
    Loc: array(
      object({
        locationId: string().required()
      })
    ).optional()
  }).optional()
).required()

const getRegionName = async () => {
  const { data } = await client.get<unknown>('api/setting/region-name')
  const result = await schema.validate(data, { stripUnknown: true })
  return result
}

const useRegionName = () => {
  return useQuery(['region-name'], () => getRegionName())
}
export type ChargeMissionType = InferType<typeof schema>

export default useRegionName
