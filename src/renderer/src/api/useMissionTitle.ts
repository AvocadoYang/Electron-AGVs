import { useQuery } from '@tanstack/react-query';
import { InferType, array, boolean, number, object, string, date } from 'yup';
import client from './axiosClient';

const schema = array(
  object({
    id: string().required(),
    name: string().required(),
    MissionTitleBridgeCategory: array(
      object({
        id: string().required(),
        missionTitleId: string().required(),
        categoryId: string().required(),
        Category: object({
          id: string().required(),
          tagName: string().required(),
          color: string().required()
        }).optional()
      })
    ).required(),
    carId: string().required(),
    createdAt: date(),
    Car: object({
      id: string().required(),
      name: string().required(),
      value: string().required(),
      CarConfig: object({
        id: string().required(),
        tolerance: number().required(),
        lookahead: number().required(),
        roughly_pass: boolean().required(),
        max_forward: number().required(),
        min_forward: number().required(),
        max_backward: number().required(),
        min_backward: number().required(),
        carTypeId: string().required()
      })
        .required()
        .nullable()
    })
      .required()
      .nullable(),

    actions: array(
      object({
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
        titleId: string().required(),
        is_define_height: string().required(),
        f_height: number().required(),
        CarControl: object({
          id: string().required(),
          name: string().required(),
          genreName: string().required(),
          from: number().required(),
          to: number().required(),
          control: array(string().required()).required(),
          f_move: number().required(),
          f_shift: number().required(),
          f_tilt: number().required(),
          c_config: number().required(),
          c_modify_dis: number().required(),
          carTypeId: string().required()
        }).nullable()
      })
        .required()
        .nullable()
    ).optional()
  }).required()
);

const getAllMissionTitle = async () => {
  const { data } = await client.get<unknown>('api/setting/all-mission-title');

  const parsed = await schema.validate(data, { stripUnknown: true });
  return parsed;
};

export type MTType = InferType<typeof schema>

const useAllMissionTitles = () => {
  return useQuery(['all-mission-title'], getAllMissionTitle);
};

export default useAllMissionTitles;
