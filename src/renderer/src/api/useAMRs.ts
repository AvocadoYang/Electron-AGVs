import { useQuery } from '@tanstack/react-query';
import { array, object, string } from 'yup';
import client from './axiosClient';

const getAmrs = async () => {
  const { data } = await client.get<unknown>('amr');

  const schema = () =>
    array(
      object({
        id: string().required()
      }).required()
    ).required();

  return schema().validate(data, { stripUnknown: true });
};

const useAMRs = () => {
  return useQuery(['amr'], getAmrs);
};

export default useAMRs;
