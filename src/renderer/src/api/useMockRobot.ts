import { useQuery } from '@tanstack/react-query';
import { array, boolean, object, string } from 'yup';
import client from './axiosClient';

const getName = async () => {
  const { data } = await client.get<unknown>('api/simulate/current-use-robot-and-simulate');

  const schema = () =>
    object({
      robot: array(
        object({
          id: string().required(),
          serialNum: string().required()
        })
      ).optional(),
      isSimulate: boolean().required(),
      scriptName: string().required()
    });
  return schema().validate(data, { stripUnknown: true });
};

const useMockRobot = () => {
  const queryResult = useQuery({
    queryKey: ['mock-robot'],
    queryFn: getName
    // refetchOnWindowFocus: false,
    // refetchOnMount: false,
    // refetchOnReconnect: false,
    // staleTime: Infinity,
    // cacheTime: Infinity
  });

  return {
    ...queryResult,
    refetch: queryResult.refetch
  };
};

export default useMockRobot;
