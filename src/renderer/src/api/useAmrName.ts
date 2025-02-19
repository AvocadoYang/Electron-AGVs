import { useQuery } from '@tanstack/react-query'
import { array, object, string } from 'yup'
import client from './axiosClient'

const getName = async () => {
  const { data } = await client.get<unknown>('api/test/all-amr-name')

  const schema = () =>
    array(
      object({
        id: string().required(),
        serialNumber: string().required()
      }).required()
    ).required()

  return schema().validate(data, { stripUnknown: true })
}

const useName = () => {
  return useQuery(['all-amr-name'], {
    queryFn: () => {
      return getName()
    }
  })
}

export default useName
