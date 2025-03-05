import client from '@renderer/api/axiosClient';
import { GlobalLoadingPage } from '@renderer/utils/GlobalLoadingPage';
import { ErrorResponse } from '@renderer/utils/globalType';
import SubmitButton from '@renderer/utils/SubmitButton';
import { errorHandler } from '@renderer/utils/utils';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Flex, Form, Input, message, Modal, Typography } from 'antd';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { boolean, object, string } from 'yup';

type FieldType = {
  name: string;
};

const schema = object({
  id: string().required(),
  name: string().required(),
  isUsing: boolean().required()
}).required();

const FloatTitle = styled.div`
  position: fixed;
  left: 2em;
  top: 6em;
`;

const getSim = async () => {
  const { data } = await client.get<unknown>('api/simulate/current-script');
  const validatedData = await schema.validate(data, {
    stripUnknown: true
  });
  return validatedData;
};

const CreateScriptForm: FC = () => {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const [messageApi, contextHolders] = message.useMessage();
  const { data, isLoading, isError } = useQuery(['sim'], getSim);

  const createMutation = useMutation({
    mutationFn: (payload: FieldType) => {
      return client.post('api/simulate/create-script', payload);
    },
    onSuccess: () => {
      void messageApi.success(t('utils.success'));
    },
    onError: (e: ErrorResponse) => errorHandler(e, messageApi)
  });

  const onFinish = () => {
    const payload = form.getFieldsValue() as FieldType;
    createMutation.mutate(payload);
  };

  if (isLoading) return <GlobalLoadingPage />;
  return (
    <>
      {contextHolders}
      <FloatTitle>
        <Typography.Text type="secondary">
          {t('sim.modal.current')}：{data?.name}
        </Typography.Text>
      </FloatTitle>
      <Modal
        open={isError}
        title={t("sim.modal.haven't_set_default")}
        footer={() => <SubmitButton isModel form={form} onOk={onFinish} />}
      >
        <Flex vertical align="start" gap={24}>
          <Typography.Text>{t('sim.modal.do_you_want_to_create_one')}</Typography.Text>

          <Form form={form} autoComplete="off">
            <Form.Item<FieldType>
              label={t('sim.modal.name')}
              name="name"
              rules={[{ required: true, message: t('utils.required') }]}
            >
              <Input />
            </Form.Item>
          </Form>
        </Flex>
      </Modal>
    </>
  );
};

export default CreateScriptForm;
