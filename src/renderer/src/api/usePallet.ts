import { useQuery } from '@tanstack/react-query'
import { array, object, string } from 'yup'
import client from './axiosClient'

const getPallet = async () => {
  const { data } = await client.get<unknown>('api/setting/all-pallet')

  const schema = () =>
    array(
      object({
        id: string().required(),
        name: string().required(),
        color: string().required()
      }).required()
    ).optional()

  return schema().validate(data, { stripUnknown: true })
}

const usePallet = () => {
  return useQuery(['all-pallet'], {
    queryFn: () => {
      return getPallet()
    }
  })
}

export default usePallet
