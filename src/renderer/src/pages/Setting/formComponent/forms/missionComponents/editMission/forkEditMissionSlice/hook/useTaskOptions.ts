import { t } from 'i18next';
import { YawGenre } from '../../mission';
import {
  activeWaitRobot,
  actonList,
  forkHeightOption,
  selectLocationOption,
  waitRobotOption,
  yawOption
} from '../params';
import {
  Action_Type,
  Select_Active_Robot_Type,
  Select_Fork_Height_Type,
  Select_Location_Type,
  Select_Robot_Wait_Type
} from '../types';
import useMap from '@renderer/api/useMap';
import useName from '@renderer/api/useAmrName';
import { useMemo } from 'react';

const useTaskOptions = () => {
  const { data: mapData } = useMap();
  const { data: robots } = useName();
  const actionTranslate = (type: Action_Type) => {
    let text = '';
    switch (type) {
      case 'move':
        text = t('car_control_translate.move');
        break;
      case 'load':
        text = t('car_control_translate.load');
        break;
      case 'offload':
        text = t('car_control_translate.offload');
        break;
      case 'spin':
        text = t('car_control_translate.S');
        break;
      case 'charge':
        text = t('car_control_translate.charge');
        break;
      case 'cargo_limit':
        text = t('car_control_translate.cargo_limit');
        break;
      case 'load_from_other':
        text = t('car_control_translate.load_from_other');
        break;
      case 'offload_from_other':
        text = t('car_control_translate.offload_from_other');
        break;
      default:
        text = 'unknown movement';
    }
    return text;
  };

  const robotOption = useMemo(() => {
    return (
      robots?.map(({ id }) => ({
        label: id,
        value: id
      })) || []
    );
  }, [robots]);

  const locationsOption = useMemo(() => {
    return (
      mapData?.locations.map((v) => ({
        label: v.locationId,
        value: v.locationId
      })) || []
    );
  }, [mapData]);

  const NormalActionListOptions: { label: string; value: Action_Type }[] = actonList
    .slice(0, 4)
    .map((type) => ({
      label: actionTranslate(type),
      value: type
    }));

  const SpecialActionListOptions: { label: string; value: Action_Type }[] = actonList
    .slice(4, 8)
    .map((type) => ({
      label: actionTranslate(type),
      value: type
    }));

  const SelectLocationOptions: { label: string; value: Select_Location_Type }[] =
    selectLocationOption.map((type) => ({
      label: type,
      value: type
    }));

  const SelectYawOptions: { label: string; value: YawGenre }[] = [0, 1, 2].map(
    (type: YawGenre) => ({
      label: yawOption[type],
      value: type
    })
  );

  const SelectForkHeightOptions: { label: string; value: Select_Fork_Height_Type }[] =
    forkHeightOption.map((type) => ({
      label: type,
      value: type
    }));

  const SelectActiveWaitRobotOptions: { label: string; value: Select_Active_Robot_Type }[] =
    activeWaitRobot.map((type) => ({
      label: type,
      value: type
    }));

  const SelectWaitRobotOptions: { label: string; value: Select_Robot_Wait_Type }[] =
    waitRobotOption.map((type) => ({
      label:
        type === 'execute_first'
          ? t('mission.task_table.execute_first')
          : t('mission.task_table.wait_other_finish'),
      value: type
    }));

  return {
    robotOption,
    locationsOption,
    NormalActionListOptions,
    SpecialActionListOptions,
    SelectLocationOptions,
    SelectYawOptions,
    SelectForkHeightOptions,
    SelectActiveWaitRobotOptions,
    SelectWaitRobotOptions
  };
};

export default useTaskOptions;
