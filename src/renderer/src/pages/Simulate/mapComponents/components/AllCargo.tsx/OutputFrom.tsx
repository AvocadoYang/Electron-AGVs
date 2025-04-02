import useMap from '@renderer/api/useMap';
import useSpecificShelf from '@renderer/api/useSpecificShelf';
import { outputFormData, selectedLocation } from '@renderer/pages/Simulate/utils/status';
import {
  Button,
  Flex,
  Form,
  FormInstance,
  InputNumber,
  Select,
  Switch,
  Tooltip,
  Typography
} from 'antd';
import { useAtomValue } from 'jotai';
import { FC, useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { QuestionCircleOutlined } from '@ant-design/icons';
import useMockRobot from '@renderer/api/useMockRobot';

const MissionStatus = styled.div`
  margin: 0;
  position: relative;
  top: 0;
  right: 0;
  font-size: 1.2em;
  display: flex;
  flex-direction: row;
  gap: 1em;
  align-items: center;
`;

const OutputFrom: FC<{
  form: FormInstance<unknown>;
  tempSaveData: () => void;
}> = ({ form, tempSaveData }) => {
  const { t } = useTranslation();
  const tempFormData = useAtomValue(outputFormData);
  const selectLocation = useAtomValue(selectedLocation);
  const { data: shelf } = useSpecificShelf(selectLocation as string);
  const [isSetMission, setIsSetMission] = useState(false);

  const data = useMap();
  const ref = useRef(null);

  const shelves = useMemo(() => {
    return (
      data.data?.locations
        .filter((v) => v.areaType === '存貨區')
        .filter((v) => v.locationId !== selectLocation)
        .map((v) => ({ label: v.locationId, value: v.locationId })) || []
    );
  }, [data.data?.locations]);

  const { data: name, isLoading: loadingCar } = useMockRobot();

  const AmrOption = useMemo(() => {
    const result =
      name?.robot
        ?.filter((v) => v.script_placement_location !== 'unset')
        .map((v) => ({
          value: v.id,
          label: v.id
        })) || [];

    return [{ label: t('sim.modal.none'), value: 'none' }, ...result];
  }, [name]);

  useEffect(() => {
    if (!shelf) return;

    const loadTaskCount =
      shelf.TitleBridgeLocs?.filter((v) => v.missionType === 'load').length || 0;

    setIsSetMission(loadTaskCount > 0);
  }, [shelf]);

  useEffect(() => {
    if (tempFormData !== null && ref.current !== null) {
      form.setFieldsValue({
        is_active: tempFormData.is_active,
        cargo_number: tempFormData.cargo_number,
        output_cargo_speed: tempFormData.output_cargo_speed,
        specify_car: tempFormData.specify_car || [],
        placement: tempFormData?.placement || []
      });
      return;
    }
  }, [tempFormData]);

  return (
    <>
      <Form ref={ref} form={form} name="control-hooks" style={{ maxWidth: 600 }}>
        <Form.Item name="is_active" label={t('utils.active')}>
          <Switch checkedChildren={t('utils.active')} unCheckedChildren={t('utils.inactive')} />
        </Form.Item>

        <Form.Item name="cargo_number" label={t('sim.cargo.output.cargo_number')}>
          <InputNumber min={1} />
        </Form.Item>

        <Form.Item name="output_cargo_speed" label={t('sim.cargo.output.speed')}>
          <InputNumber min={1} />
        </Form.Item>

        <Form.Item name="specify_car" label={t('sim.cargo.output.specify_car')}>
          <Select mode="multiple" options={AmrOption} loading={loadingCar} />
        </Form.Item>

        <Flex gap="large">
          <Form.Item name="placement" label={t('sim.cargo.output.placement')}>
            <Select mode="multiple" size="large" style={{ width: 200 }} options={shelves} />
          </Form.Item>
          <Button onClick={tempSaveData}>{t('sim.modal.select_locations')}</Button>
        </Flex>
      </Form>

      <MissionStatus>
        <Tooltip placement="top" title={t('sim.modal.valid_mission_info')}>
          <QuestionCircleOutlined />
        </Tooltip>

        <Typography.Text type={isSetMission ? 'success' : 'danger'}>
          {isSetMission ? t('sim.modal.valid_mission') : t('sim.modal.not_mission_set')}
        </Typography.Text>
      </MissionStatus>
    </>
  );
};

export default OutputFrom;
