import { useQuery } from '@tanstack/react-query';
import { array, boolean, number, object, string } from 'yup';
import client from './axiosClient';

const getScript = async (locationId: string | null) => {
  try {
    const { data } = await client.get('api/simulate/script-info', {
      params: { locationId }
    });

    const schema = object({
      id: string().required(),
      name: string().required(),
      output: object({
        id: string().optional(),
        is_active: boolean().optional(),
        cargo_number: number().optional(),
        respawn_cargo: boolean().optional(),
        output_cargo_speed: number().optional(),
        specify_car: array(string().optional()).optional().nullable(),
        placement: array(string().optional()).optional().nullable(),
        mission_script_id: string().optional(),
        locationId: string().optional()
      })
        .optional()
        .nullable(),
      input: object({
        id: string().optional(),
        is_active: boolean().optional(),
        input_cargo_speed: number().optional(),
        shift_locations: string().optional().nullable(),
        mission_script_id: string().optional(),
        locationId: string().optional()
      })
        .optional()
        .nullable()
    }).required();

    return await schema.validate(data, { stripUnknown: true });
  } catch (error) {
    console.error('Error fetching script info:', error);
    throw new Error('Failed to fetch script info'); // ❗ Throw an error instead of returning undefined
  }
};

const useLocationScriptInfo = (locationId: string | null) => {
  return useQuery(['location-script-info', locationId], {
    queryFn: () => getScript(locationId),
    enabled: !!locationId,
    retry: 1
  });
};

export default useLocationScriptInfo;
