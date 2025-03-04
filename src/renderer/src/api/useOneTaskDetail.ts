import { useQuery } from '@tanstack/react-query';
import { array, boolean, number, object, string } from 'yup';
import client from './axiosClient';

const schema = object({
  id: string().required(),
  order: number().required(),
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
}).required();

const getOneTask = async (key: string) => {
  const { data } = await client.post<unknown>('api/setting/one-task-detail', {
    key
  });
  const validatedData = await schema.validate(data, { stripUnknown: true });
  return validatedData;
};

const useOneTaskDetail = (key: string) => {
  return useQuery(['one-task-detail', key], {
    queryFn: () => {
      return getOneTask(key);
    },
    enabled: !!key
  });
};

export default useOneTaskDetail;
