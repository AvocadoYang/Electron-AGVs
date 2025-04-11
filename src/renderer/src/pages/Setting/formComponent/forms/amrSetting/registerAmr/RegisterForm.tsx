import { Button, Form, Input } from 'antd';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';

const RegisterForm: FC = () => {
  const [form] = Form.useForm();
  const { t } = useTranslation();

  const onFinish = (values: any) => {
    console.log(values);
  };

  return (
    <>
      <Form form={form} onFinish={onFinish}>
        <Form.Item name="full_name" label={t('setting_amr.amr_name')} rules={[{ required: true }]}>
          <Input />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit">
            {t('utils.submit')}
          </Button>
        </Form.Item>
      </Form>
    </>
  );
};

export default RegisterForm;
