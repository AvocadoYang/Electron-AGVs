import { useQuery } from '@tanstack/react-query';
import client from './axiosClient';
import { array, object, string, boolean, number } from 'yup';

const schema = object({
  data: array(
    object({
      id: string().required(),
      isUsing: boolean().required(),
      fileName: string().required(),
      mapOriginX: number().required(),
      mapOriginY: number().required(),
      mapWidth: number().required(),
      mapHeight: number().required()
    })
  ).required(),
  status: string().required()
});
const getAllMapInfo = async () => {
  const { data } = await client.get<unknown>('api/setting/get-allMapData');
  const validateData = await schema.validate(data);
  return validateData;
};

const useAllMapInfo = () => {
  return useQuery(['all-map-Info'], getAllMapInfo);
};

export default useAllMapInfo;
