import { useQuery } from '@tanstack/react-query'
import { array, object, string } from 'yup'
import client from './axiosClient'

const versionSchema = array(
  object({
    id: string().required(),
    name_ch: string().required(),
    name_en: string().required()
  }).required()
).required()

const getTable = async () => {
  const { data } = await client.get<unknown>('api/setting/warning_genre')

  const validatedData = await versionSchema.validate(data, {
    stripUnknown: true
  })
  return validatedData
}

const useWarningGenre = () => {
  return useQuery(['warning-genre'], getTable)
}

export default useWarningGenre
