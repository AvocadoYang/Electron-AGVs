import { FC, useEffect } from 'react';
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
import { QuestionCircleOutlined } from '@ant-design/icons';
import { IsEditConveyor } from './jotai';
import { ErrorResponse } from '@renderer/utils/globalType';
import { errorHandler } from '@renderer/utils/utils';
import client from '@renderer/api/axiosClient';
import { useMutation } from '@tanstack/react-query';
import useAllMissionTitles from '@renderer/api/useMissionTitle';

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
  const taskOption = misTitle
    ?.filter((g) =>
      g.MissionTitleBridgeCategory.some((s) => s.Category?.tagName === 'dynamic-mission')
    )
    .map((v) => ({ value: v.id, label: v.name ?? `Mission ${v.id}` }));

  const updateMutation = useMutation({
    mutationFn: (data: {
      stationId: string;
      forkHeight: number;
      activeLoad: boolean;
      activeOffload: boolean;
      loadMissionId: string;
      offloadMissionId: string;
    }) => {
      return client.post('/api/peripherals/update-conveyor-config', data);
    },
    onSuccess: () => {
      messageApi.success(t('utils.success'));
      setOpenModal(null);
    },
    onError: (e: ErrorResponse) => errorHandler(e, messageApi)
  });

  useEffect(() => {
    if (openModal) {
      form.setFieldsValue({
        forkHeight: openModal.forkHeight,
        activeLoad: openModal.activeLoad,
        activeOffload: openModal.activeOffload,
        loadMissionId: openModal.loadMissionId,
        offloadMissionId: openModal.offloadMissionId
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
        width={480}
        footer={
          <Button type="primary" onClick={handleSubmit} loading={updateMutation.isLoading}>
            {t('utils.save')}
          </Button>
        }
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
                  <Tooltip>
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
            rules={[{ required: true, message: t('shelf.cargo_mission.offload_mission_required') }]}
          >
            <Select options={taskOption} placeholder={t('utils.select')} showSearch />
          </Form.Item>

          <Form.Item label={t('conveyor.enable_loading')} name="activeLoad" valuePropName="checked">
            <Switch />
          </Form.Item>

          <Form.Item
            label={t('conveyor.enable_offloading')}
            name="activeOffload"
            valuePropName="checked"
          >
            <Switch />
          </Form.Item>
        </StyledForm>
      </Modal>
    </>
  );
};

export default EditConveyorModal;
