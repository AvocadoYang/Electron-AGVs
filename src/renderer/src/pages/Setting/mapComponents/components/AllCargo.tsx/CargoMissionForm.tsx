import { Form, Select, Input, FormInstance, Skeleton } from 'antd';
import { FC, useEffect } from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import useAllMissionTitles from '@renderer/api/useMissionTitle';
import useYaw from '@renderer/api/useYaw';
import useRegionName from '@renderer/api/useLocRegionName';
import useSpecificShelf from '@renderer/api/useSpecificShelf';

const Wrapper = styled.div`
  width: 100%;
`;

const H1 = styled.h1`
  margin: 0;
  font-weight: bolder;
  text-align: center;
`;

const CargoMissionForm: FC<{
  locId: string
  locName: string | null
  form: FormInstance<unknown>
}> = ({ locId, locName, form }) => {
  const { data: misTitle } = useAllMissionTitles();
  const { data: yaw } = useYaw();
  const { data: region } = useRegionName();
  const { data: shelf } = useSpecificShelf(locId);
  const { t } = useTranslation();

  const taskOption = misTitle?.map((v) => {
    return { value: v.id, label: v.name };
  });

  const dirOption = yaw?.map((v) => {
    return { value: v.id, label: v.yaw };
  });

  const regionOption = region?.map((v) => {
    return { value: v?.id, label: v?.name };
  });

  useEffect(() => {
    if (!shelf) return;

    const tasks = shelf.TitleBridgeLocs?.filter((v) => v.missionType === 'normal').map((v) => {
      return v.Title?.id;
    });

    const loadTask = shelf.TitleBridgeLocs?.filter((v) => v.missionType === 'load').map((v) => {
      return v.Title?.id;
    })[0];

    const offloadTask = shelf.TitleBridgeLocs?.filter((v) => v.missionType === 'offload').map(
      (v) => {
        return v.Title?.id;
      }
    )[0];

    form.setFieldValue('titleId', tasks);
    form.setFieldValue('load', loadTask);
    form.setFieldValue('offload', offloadTask);
    form.setFieldValue('region', shelf.loc_regions?.id);
    form.setFieldValue('yaw', shelf.Dir?.id);
  }, [form, shelf]);

  if (!shelf) return <Skeleton active />;
  return (
    <Wrapper>
      <Form
        form={form}
        labelCol={{ span: 5 }}
        wrapperCol={{ span: 14 }}
        layout="horizontal"
        size="large"
        title={` ${locId}的任務設定 `}
      >
        <H1>{locName || ''}</H1>

        <Form.Item label={t('shelf.cargo_mission.load_mission')} name="load">
          <Select options={taskOption} />
        </Form.Item>

        <Form.Item label={t('shelf.cargo_mission.offload_mission')} name="offload">
          <Select options={taskOption} />
        </Form.Item>

        <Form.Item label={t('shelf.cargo_mission.location_name')} name="name">
          <Input />
        </Form.Item>

        <Form.Item label={t('shelf.cargo_mission.region_name')} name="region">
          <Select options={regionOption} />
        </Form.Item>

        <Form.Item label={t('shelf.cargo_mission.yaw')} name="yaw">
          <Select options={dirOption} />
        </Form.Item>
      </Form>
    </Wrapper>
  );
};

export default CargoMissionForm;
