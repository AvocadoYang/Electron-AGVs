import { FC, useEffect, useMemo } from 'react';
import { useAtom } from 'jotai';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import {
  Button,
  Flex,
  Form,
  InputNumber,
  message,
  Modal,
  Select,
  Switch,
  Tooltip,
  Typography
} from 'antd';
import { MinusCircleOutlined, PlusOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import { IsEditConveyor } from './jotai';
import { ErrorResponse } from '@renderer/utils/globalType';
import { errorHandler } from '@renderer/utils/utils';
import client from '@renderer/api/axiosClient';
import { useMutation } from '@tanstack/react-query';
import useAllMissionTitles from '@renderer/api/useMissionTitle';
import useLoc, { LocWithoutArr, Relation } from '@renderer/api/useLoc';

const { Title } = Typography;

const StyledForm = styled(Form)`
  padding: 12px 4px;

  .ant-form-item-label > label {
    font-weight: 500;
    color: #4b5563;
  }

  .ant-form-item {
    margin-bottom: 18px;
  }

  .ant-input-number {
    width: 100%;
  }
`;

const StyledTitle = styled(Title)`
  margin-bottom: 24px !important;
  color: #1677ff !important;
  text-align: center;
`;

const EditConveyorModal: FC = () => {
  const [openModal, setOpenModal] = useAtom(IsEditConveyor);
  const [form] = Form.useForm();
  const { t } = useTranslation();
  const [messageApi, contextHolder] = message.useMessage();
  const { data: misTitle } = useAllMissionTitles();
  // const { data: yaw } = useYaw();
  const { data: loc } = useLoc(undefined);
  const taskOption = misTitle
    ?.filter((g) =>
      g.MissionTitleBridgeCategory.some((s) => s.Category?.tagName === 'dynamic-mission')
    )
    .map((v) => ({ value: v.id, label: v.name ?? `Mission ${v.id}` }));

  // const dirOption = yaw?.map((v) => ({ value: v.id, label: v.yaw }));

  const relationshipTypeOption = [
    { value: 'fixed', label: t('shelf.cargo_mission.relationship_fixed') },
    { value: 'non-fixed', label: t('shelf.cargo_mission.relationship_non_fixed') }
  ];

  const updateMutation = useMutation({
    mutationFn: (data: {
      stationId: string;
      forkHeight: number;
      activeLoad: boolean;
      activeOffload: boolean;
      loadMissionId: string;
      offloadMissionId: string;
      placement_priority: number;
      relationships: Relation;
    }) => {
      return client.post('/api/peripherals/update-conveyor-config', data);
    },
    onSuccess: () => {
      messageApi.success(t('utils.success'));
      setOpenModal(null);
    },
    onError: (e: ErrorResponse) => errorHandler(e, messageApi)
  });

  const relationOption = useMemo(() => {
    const info = loc as LocWithoutArr[];
    const mixData = info
      .filter((v) => v.areaType === 'Storage' && v.id !== openModal?.stationId)
      .sort((a, b) => Number(a.locationId) - Number(b.locationId))
      .map((v) => ({
        label: v.locationId,
        value: v.locationId
      }));
    return mixData;
  }, [loc, t]);

  useEffect(() => {
    if (openModal) {
      const relationshipArray = openModal.relationships
        ? Object.entries(openModal.relationships).map(([relatedLocId, relationshipType]) => ({
            relatedLocId,
            relationshipType
          }))
        : [];

      form.setFieldsValue({
        forkHeight: openModal.forkHeight,
        activeLoad: openModal.activeLoad,
        activeOffload: openModal.activeOffload,
        loadMissionId: openModal.loadMissionId,
        offloadMissionId: openModal.offloadMissionId,
        placement_priority: openModal.placement_priority,
        relationships: relationshipArray
      });
    }
  }, [openModal, form]);

  const handleCancel = () => {
    setOpenModal(null);
  };

  const handleSubmit = async () => {
    if (!openModal) {
      messageApi.warning('the station not found');
      return;
    }

    const values = await form.validateFields();
    updateMutation.mutate({
      stationId: openModal.stationId,
      ...values
    });
  };

  return (
    <>
      {contextHolder}
      <Modal
        title={null}
        open={openModal !== null}
        onCancel={handleCancel}
        centered
        footer={
          <Button type="primary" onClick={handleSubmit} loading={updateMutation.isLoading}>
            {t('utils.save')}
          </Button>
        }
      >
        <div
          style={{
            background: '#fff',
            padding: '24px',
            borderRadius: 8,
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
            maxHeight: '70vh',
            overflowY: 'auto'
          }}
        >
          <StyledForm form={form} layout="vertical" size="large">
            <StyledTitle level={3}>{t('conveyor.title')}</StyledTitle>

            <Form.Item
              label={t('conveyor.edit_fork_height')}
              name="forkHeight"
              rules={[{ required: true, message: t('conveyor.error_fork_height') }]}
            >
              <InputNumber min={0} />
            </Form.Item>

            <Form.Item
              label={
                <>
                  <Flex align="center" justify="center">
                    <Typography.Text>{t('shelf.cargo_mission.load_mission')}</Typography.Text>
                    <Tooltip title={t('shelf.cargo_mission.load_desc')}>
                      <QuestionCircleOutlined style={{ marginLeft: 8 }} />
                    </Tooltip>
                  </Flex>
                </>
              }
              name="loadMissionId"
              rules={[{ required: true, message: t('shelf.cargo_mission.load_mission_required') }]}
            >
              <Select options={taskOption} placeholder={t('utils.select')} showSearch />
            </Form.Item>

            <Form.Item
              label={
                <>
                  <Flex align="center" justify="center">
                    <Typography.Text>{t('shelf.cargo_mission.offload_mission')}</Typography.Text>
                    <Tooltip title={t('shelf.cargo_mission.offload_desc')}>
                      <QuestionCircleOutlined style={{ marginLeft: 8 }} />
                    </Tooltip>
                  </Flex>
                </>
              }
              name="offloadMissionId"
              rules={[
                { required: true, message: t('shelf.cargo_mission.offload_mission_required') }
              ]}
            >
              <Select options={taskOption} placeholder={t('utils.select')} showSearch />
            </Form.Item>

            {/* <Form.Item
              label={
                <>
                  <Flex align="center" justify="center">
                    <Typography.Text>{t('shelf.cargo_mission.yaw')}</Typography.Text>
                    <Tooltip title={t('shelf.cargo_mission.yaw_desc')}>
                      <QuestionCircleOutlined style={{ marginLeft: 8 }} />
                    </Tooltip>
                  </Flex>
                </>
              }
              name="yaw"
              rules={[{ required: true, message: t('shelf.cargo_mission.yaw_required') }]}
            >
              <Select options={dirOption} placeholder={t('utils.select')} showSearch />
            </Form.Item> */}

            <Form.Item
              label={t('conveyor.enable_loading')}
              name="activeLoad"
              valuePropName="checked"
            >
              <Switch />
            </Form.Item>

            <Form.Item
              label={t('conveyor.enable_offloading')}
              name="activeOffload"
              valuePropName="checked"
            >
              <Switch />
            </Form.Item>

            <Form.Item
              label={
                <>
                  <Flex align="center" justify="center">
                    <Typography.Text>{t('shelf.cargo_mission.priority')}</Typography.Text>
                    <Tooltip title={t('shelf.cargo_mission.priority_desc')}>
                      <QuestionCircleOutlined style={{ marginLeft: 8 }} />
                    </Tooltip>
                  </Flex>
                </>
              }
              name="placement_priority"
              rules={[
                { required: true, message: t('shelf.cargo_mission.priority_required') },
                { type: 'number', min: 0, message: t('shelf.cargo_mission.priority_min') }
              ]}
            >
              <InputNumber min={0} max={100} style={{ width: '100%' }} placeholder={'10'} />
            </Form.Item>

            <Form.Item
              label={
                <>
                  <Flex align="center" justify="center">
                    <Typography.Text>{t('shelf.cargo_mission.relationships')}</Typography.Text>
                    <Tooltip title={t('shelf.cargo_mission.relationships_desc')}>
                      <QuestionCircleOutlined style={{ marginLeft: 8 }} />
                    </Tooltip>
                  </Flex>
                </>
              }
            >
              <Form.List name="relationships">
                {(fields, { add, remove }) => (
                  <>
                    {fields.map(({ key, name, ...restField }) => (
                      <div key={key} style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
                        <Form.Item
                          {...restField}
                          name={[name, 'relatedLocId']}
                          rules={[
                            {
                              required: true,
                              message: t('shelf.cargo_mission.related_loc_required')
                            }
                          ]}
                          style={{ flex: 1 }}
                        >
                          <Select
                            options={relationOption}
                            placeholder={t('shelf.cargo_mission.select_location')}
                            showSearch
                          />
                        </Form.Item>
                        <Form.Item
                          {...restField}
                          name={[name, 'relationshipType']}
                          rules={[
                            {
                              required: true,
                              message: t('shelf.cargo_mission.relationship_type_required')
                            }
                          ]}
                          style={{ flex: 1 }}
                        >
                          <Select
                            options={relationshipTypeOption}
                            placeholder={t('shelf.cargo_mission.select_relationship_type')}
                          />
                        </Form.Item>
                        <MinusCircleOutlined
                          onClick={() => remove(name)}
                          style={{ alignSelf: 'center' }}
                        />
                      </div>
                    ))}
                    <Form.Item>
                      <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                        {t('shelf.cargo_mission.add_relationship')}
                      </Button>
                    </Form.Item>
                  </>
                )}
              </Form.List>
            </Form.Item>
          </StyledForm>
        </div>
      </Modal>
    </>
  );
};

export default EditConveyorModal;
