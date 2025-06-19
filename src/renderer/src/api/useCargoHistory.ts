import { array, object, string, date, boolean } from 'yup';
import { InferType } from 'yup';
import { useQuery } from '@tanstack/react-query';
import client from './axiosClient';

const historySchema = array(
  object({
    id: string().required(),
    cargo_id: string().required(),
    action: string().oneOf(['CREATED', 'LOAD', 'OFFLOAD', 'SHIFTED', 'UPDATED']).required(),
    description: string().nullable(),
    actor: string().nullable(),
    timestamp: date().required()
  })
).required();

const customCargoMetadataSchema = object({
  id: string().required(),
  is_default: boolean().required(),
  custom_name: string().required(),
  format: string().required()
})
  .optional()
  .nullable();

const schema = array(
  object({
    id: string().required(),
    status: string().oneOf(['ON_AMR', 'AT_LOCATION', 'SHIFT']).required(),
    metadata: string().optional().nullable(),
    createdAt: date().required(),
    updatedAt: date().required(),
    register_robot_id: string().nullable(),
    script_robot_id: string().nullable(),
    shelfConfigId: string().nullable(),
    custom_cargo_metadata_id: string().nullable(),

    history: historySchema,
    custom_cargo_metadata: customCargoMetadataSchema
  })
).required();

export type CargoListData = InferType<typeof schema>;

const getData = async (): Promise<CargoListData> => {
  const { data } = await client.get<unknown>('api/cargo-history/history');
  return await schema.validate(data, { stripUnknown: true });
};

const useCargoHistory = () => {
  return useQuery(['cargo-history'], () => getData());
};

export default useCargoHistory;
