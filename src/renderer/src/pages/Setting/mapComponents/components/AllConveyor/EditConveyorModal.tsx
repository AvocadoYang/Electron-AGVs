import { FC, useEffect } from 'react';
import { useAtom } from 'jotai';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { Button, Form, InputNumber, message, Modal, Switch, Typography } from 'antd';
import { IsEditConveyor } from './jotai';
import { ErrorResponse } from '@renderer/utils/globalType';
import { errorHandler } from '@renderer/utils/utils';
import client from '@renderer/api/axiosClient';
import { useMutation } from '@tanstack/react-query';

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
  const [openModal, setOpenModal] = useAtom(IsEditConveyor); // openModal contains the current conveyor's config
  const [form] = Form.useForm();
  const { t } = useTranslation();
  const [messageApi, contextHolder] = message.useMessage();

  // ✨ React Query mutation
  const updateMutation = useMutation({
    mutationFn: (data: {
      stationId: string;
      forkHeight: number;
      activeLoad: boolean;
      activeOffload: boolean;
    }) => {
      return client.post('/api/peripherals/update-conveyor-config', data);
    },
    onSuccess: () => {
      messageApi.success(t('utils.success'));
      setOpenModal(null);
    },
    onError: (e: ErrorResponse) => errorHandler(e, messageApi)
  });

  // ⏮ Sync form values when modal opens
  useEffect(() => {
    if (openModal) {
      form.setFieldsValue({
        forkHeight: openModal.forkHeight,
        activeLoad: openModal.activeLoad,
        activeOffload: openModal.activeOffload
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
    try {
      const values = await form.validateFields();
      updateMutation.mutate({
        stationId: openModal.stationId,
        ...values
      });
    } catch (e) {
      // Form validation errors, don't need to do anything here
    }
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
