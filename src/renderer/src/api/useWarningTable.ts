import { useQuery } from '@tanstack/react-query';
import { array, boolean, number, object, string } from 'yup';
import client from './axiosClient';

const versionSchema = array(
  object({
    id: number().required(),
    is_open_buzzer: boolean().required(),
    info_ch: string().required(),
    info_en: string().required(),
    solution_ch: string().required(),
    solution_en: string().required(),
    sensor_location_en: string().required(),
    sensor_location_ch: string().required(),

    genre_id: string().required(),
    genre_name_ch: string().required(),
    genre_name_en: string().required()
  }).optional()
).required();

const getTable = async () => {
  const { data } = await client.get<unknown>('api/setting/warning_list');

  const validatedData = await versionSchema.validate(data, {
    stripUnknown: true
  });
  return validatedData;
};

const useWarningTable = () => {
  return useQuery(['warning-table'], getTable);
};

export default useWarningTable;
