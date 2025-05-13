import useMap from '@renderer/api/useMap';
import useSpecificShelf from '@renderer/api/useSpecificShelf';
import { outputFormData, selectedLocation } from '@renderer/pages/Simulate/utils/status';
import { Button, Flex, Form, FormInstance, InputNumber, Select, Switch, Tooltip } from 'antd';
import { useAtomValue } from 'jotai';
import { FC, useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { QuestionCircleOutlined } from '@ant-design/icons';
import { useMockInfo } from '@renderer/sockets/useMockInfo';

const StyledForm = styled(Form)`
  background: #fff;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
`;

const MissionStatus = styled.div<{ $isValid: boolean }>`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 20px;
  padding: 10px;
  background: ${({ $isValid }) => ($isValid ? '#e6ffe6' : '#fff1f0')};
  border-radius: 8px;
  border: 1px solid ${({ $isValid }) => ($isValid ? '#b7eb8f' : '#ffa39e')};
  color: ${({ $isValid }) => ($isValid ? '#389e0d' : '#cf1322')};
  font-weight: 500;
`;

const OutputFrom: FC<{ form: FormInstance; tempSaveData: () => void }> = ({
  form,
  tempSaveData
}) => {
  const { t } = useTranslation();
  const tempFormData = useAtomValue(outputFormData);
  const selectLocation = useAtomValue(selectedLocation);
  const { data: shelf } = useSpecificShelf(selectLocation as string);
  const [isSetMission, setIsSetMission] = useState(false);
  const data = useMap();
  const ref = useRef(null);

  const shelves = useMemo(
    () =>
      data.data?.locations
        .filter((v) => v.areaType === '存貨區' && v.locationId !== selectLocation)
        .map((v) => ({ label: v.locationId, value: v.locationId })) || [],
    [data.data?.locations]
  );

  const mockRobot = useMockInfo();
  const AmrOption = useMemo(
    () => [
      { label: t('sim.modal.none'), value: 'none' },
      ...(mockRobot?.robot
        ?.filter((v) => v.script_placement_location !== 'unset')
        .map((v) => ({ value: v.id, label: v.id })) || [])
    ],
    [mockRobot, t]
  );

  useEffect(() => {
    if (!shelf) return;
    const loadTaskCount =
      shelf.TitleBridgeLocs?.filter((v) => v.missionType === 'load').length || 0;
    setIsSetMission(loadTaskCount > 0);
  }, [shelf]);

  useEffect(() => {
    if (tempFormData && ref.current) {
      form.setFieldsValue({
        is_active: tempFormData.is_active,
        cargo_number: tempFormData.cargo_number,
        respawn_cargo: tempFormData.respawn_cargo,
        output_cargo_speed: tempFormData.output_cargo_speed,
        specify_car: tempFormData.specify_car || [],
        placement: tempFormData.placement || []
      });
    }
  }, [tempFormData, form]);

  return (
    <StyledForm ref={ref} form={form} layout="vertical">
      <Form.Item name="is_active" label={t('utils.active')} valuePropName="checked">
        <Switch checkedChildren={t('utils.active')} unCheckedChildren={t('utils.inactive')} />
      </Form.Item>

      <Form.Item name="respawn_cargo" label={t('sim.cargo.output.respawn_cargo')}>
        <Switch checkedChildren={t('utils.active')} unCheckedChildren={t('utils.inactive')} />
      </Form.Item>

      <Form.Item name="cargo_number" label={t('sim.cargo.output.cargo_number')}>
        <InputNumber min={1} style={{ width: '100%' }} placeholder="Enter number" />
      </Form.Item>

      <Form.Item name="output_cargo_speed" label={t('sim.cargo.output.speed')}>
        <InputNumber min={1000} style={{ width: '100%' }} placeholder="Enter speed" />
      </Form.Item>

      <Form.Item name="specify_car" label={t('sim.cargo.output.specify_car')}>
        <Select mode="multiple" options={AmrOption} placeholder="Select AMRs" />
      </Form.Item>

      <Flex gap="middle" align="center">
        <Form.Item name="placement" label={t('sim.cargo.output.placement')} style={{ flex: 1 }}>
          <Select mode="multiple" options={shelves} placeholder="Select locations" />
        </Form.Item>
        <Button onClick={tempSaveData}>{t('sim.modal.select_locations')}</Button>
      </Flex>

      <MissionStatus $isValid={isSetMission}>
        <Tooltip placement="top" title={t('sim.modal.valid_mission_info')}>
          <QuestionCircleOutlined />
        </Tooltip>
        <span>{isSetMission ? t('sim.modal.valid_mission') : t('sim.modal.not_mission_set')}</span>
      </MissionStatus>
    </StyledForm>
  );
};

export default OutputFrom;
