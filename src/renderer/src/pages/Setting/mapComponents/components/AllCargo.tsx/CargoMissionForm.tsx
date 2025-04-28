import { Form, Select, Input, FormInstance, Skeleton, Typography } from 'antd';
import { FC, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import useAllMissionTitles from '@renderer/api/useMissionTitle';
import useYaw from '@renderer/api/useYaw';
import useRegionName from '@renderer/api/useLocRegionName';
import useSpecificShelf from '@renderer/api/useSpecificShelf';

const { Title } = Typography;

const CargoMissionForm: FC<{
  locId: string;
  locName: string | null;
  form: FormInstance<unknown>;
}> = ({ locId, locName, form }) => {
  const { data: misTitle } = useAllMissionTitles();
  const { data: yaw } = useYaw();
  const { data: region } = useRegionName();
  const { data: shelf } = useSpecificShelf(locId);
  const { t } = useTranslation();

  const taskOption = misTitle
    ?.filter((g) =>
      g.MissionTitleBridgeCategory.some((s) => s.Category?.tagName === 'dynamic-mission')
    )
    .map((v) => ({ value: v.id, label: v.name ?? `Mission ${v.id}` }));

  const dirOption = yaw?.map((v) => ({ value: v.id, label: v.yaw }));
  const regionOption = region?.map((v) => ({ value: v?.id, label: v?.name }));

  useEffect(() => {
    if (!shelf) return;

    const loadTask = shelf.TitleBridgeLocs?.filter((v) => v.missionType === 'load')[0]?.Title?.id;
    const offloadTask = shelf.TitleBridgeLocs?.filter((v) => v.missionType === 'offload')[0]?.Title
      ?.id;

    form.setFieldsValue({
      load: loadTask,
      offload: offloadTask,
      region: shelf.loc_regions?.id,
      yaw: shelf.Dir?.id
    });
  }, [form, shelf]);

  if (!shelf) return <Skeleton active paragraph={{ rows: 5 }} />;

  return (
    <div
      style={{
        width: '50%',
        background: '#fff',
        padding: '24px',
        borderRadius: 8,
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
      }}
    >
      <Form form={form} layout="vertical" size="large" initialValues={{ name: locName }}>
        <Title level={3} style={{ textAlign: 'center', marginBottom: '24px', color: '#1890ff' }}>
          {locName || t('shelf.cargo_mission.default_title')}
        </Title>

        <Form.Item
          label={t('shelf.cargo_mission.load_mission')}
          name="load"
          rules={[{ required: true }]}
        >
          <Select options={taskOption} placeholder={t('utils.select')} showSearch />
        </Form.Item>

        <Form.Item
          label={t('shelf.cargo_mission.offload_mission')}
          name="offload"
          rules={[{ required: true }]}
        >
          <Select options={taskOption} placeholder={t('utils.select')} showSearch />
        </Form.Item>

        <Form.Item label={t('shelf.cargo_mission.location_name')} name="name">
          <Input placeholder={t('shelf.cargo_mission.enter_name')} />
        </Form.Item>

        <Form.Item
          label={t('shelf.cargo_mission.region_name')}
          name="region"
          rules={[{ required: true }]}
        >
          <Select options={regionOption} placeholder={t('utils.select')} showSearch />
        </Form.Item>

        <Form.Item label={t('shelf.cargo_mission.yaw')} name="yaw" rules={[{ required: true }]}>
          <Select options={dirOption} placeholder={t('utils.select')} showSearch />
        </Form.Item>
      </Form>
    </div>
  );
};

export default CargoMissionForm;
