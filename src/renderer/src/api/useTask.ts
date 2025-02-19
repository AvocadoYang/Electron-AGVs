import { useQuery } from '@tanstack/react-query'
import { InferType, array, boolean, number, object, string } from 'yup'
import client from './axiosClient'

const schema = array(
  object({
    id: string().required(),
    order: number().required(),
    disable: boolean().required(),
    is_define_id: string().required(),
    locationId: number().required(),
    wait: number().required(),
    is_define_yaw: number().required(),
    yaw: number().required(),
    hasCargoToProcess: boolean().required(),
    waitOtherAmr: string().optional().nullable(),
    waitGenre: string().optional().nullable(),
    auto_preparatory_point: boolean().required(),
    is_define_height: string().required(),
    f_height: number().required(),
    titleId: string().optional().nullable(),
    genreId: string().optional().nullable(),
    CarControl: object({
      id: string().required(),
      name: string().required(),
      genreName: string().required()
    }).nullable(),
    missionTitle: object({
      Car: object({
        CarControl: array(
          object({
            id: string().required(),
            name: string().required(),
            genreName: string().required()
          })
        ).required()
      }).required()
    }).required()
  }).optional()
).optional()

const getRelateTask = async (key: string) => {
  const { data } = await client.post<unknown>('api/setting/relative-task', {
    key
  })
  const validatedData = await schema.validate(data, { stripUnknown: true })
  return validatedData
}

const useTask = (key: string) => {
  return useQuery(['all-relate-task', key], {
    queryFn: () => {
      return getRelateTask(key)
    },
    select: (data) => {
      if (!data) return []
      const newData = [...data]
      return newData.sort((a, b) => (a?.order || 0) - (b?.order || 0))
    },
    staleTime: Infinity,
    refetchOnWindowFocus: 'always',
    refetchInterval: 2000
  })
}
export type TaskType = InferType<typeof schema>

export default useTask
