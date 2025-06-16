import client from '@renderer/api/axiosClient';
import useCustomCargoFormat from '@renderer/api/useCustomCargoFormat';
import { ErrorResponse } from '@renderer/utils/globalType';
import { errorHandler } from '@renderer/utils/utils';
import { useMutation } from '@tanstack/react-query';
import { Form, Modal, Select, Input, message } from 'antd';
import { FC, Dispatch, SetStateAction, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

type DataType = {
  id: string;
  custom_name: string;
  is_default: boolean;
  format: string;
};

const EditCargoCarrier: FC<{
  amrId: string;
  isModalOpen: boolean;
  setIsModalOpen: Dispatch<SetStateAction<boolean>>;
}> = ({ amrId, isModalOpen, setIsModalOpen }) => {
  const { t } = useTranslation();
  const { data } = useCustomCargoFormat();
  const [format, setFormat] = useState<DataType | null>(null);
  const [form] = Form.useForm();
  const [dynamicFields, setDynamicFields] = useState<{ name: string; type: string }[]>([]);
  const [messageApi, contextHolder] = message.useMessage();

  const options = data?.map((v) => ({
    label: v?.custom_name,
    value: v?.id
  }));

  const editMutation = useMutation({
    mutationFn: (payload: { amrId: string; metadata: string; custom_cargo_metadata_id: string }) =>
      client.post('/api/amr/update-cargo-info', payload),
    onSuccess: () => {
      messageApi.success(t('utils.success'));
    },
    onError: (e: ErrorResponse) => errorHandler(e, messageApi)
  });

  useEffect(() => {
    if (!format || !format.format) return;

    try {
      const parsedFormat = JSON.parse(format.format);
      const fields = Object.entries(parsedFormat).map(([name, type]) => ({
        name,
        type: typeof type === 'string' ? type : 'string'
      }));
      setDynamicFields(fields);
    } catch (error) {
      console.error('Invalid JSON format:', error);
      setDynamicFields([]);
    }
  }, [format]);

  useEffect(() => {
    if (!data || data.length === 0) return;

    const defaultData = data.find((v) => v?.is_default) || data[0];
    setFormat(defaultData as DataType);
    form.setFieldsValue({ custom_cargo_metadata_id: defaultData?.id });
  }, [data, form]);

  const handleSelectChange = (value: string) => {
    const selectedFormat = data?.find((v) => v?.id === value);
    setFormat(selectedFormat as DataType);
  };

  const handleOk = () => {
    form
      .validateFields()
      .then((values) => {
        const formData = {
          custom_cargo_metadata_id: values.custom_cargo_metadata_id,
          metadata: dynamicFields.reduce(
            (acc, field) => {
              acc[field.name] = values[field.name];
              return acc;
            },
            {} as Record<string, any>
          )
        };
        console.log('Form data:', formData);

        editMutation.mutate({
          amrId,
          metadata: JSON.stringify(formData.metadata),
          custom_cargo_metadata_id: formData.custom_cargo_metadata_id
        });
        setIsModalOpen(false);
      })
      .catch((error) => {
        console.error('Form validation failed:', error);
      });
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    form.resetFields();
  };

  const renderInput = (type: string, _name: string) => {
    switch (type.toLowerCase()) {
      case 'string':
        return <Input />;
      case 'number':
        return <Input type="number" />;
      case 'boolean':
        return (
          <Select>
            <Select.Option value="true">{t('utils.yes')}</Select.Option>
            <Select.Option value="false">{t('utils.no')}</Select.Option>
          </Select>
        );
      default:
        return <Input />;
    }
  };

  return (
    <>
      {contextHolder}
      <Modal
        title={t('amr_card.update_cargo')}
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            label={t('customCargo.name')}
            name="custom_cargo_metadata_id"
            rules={[{ required: true, message: t('utils.required') }]}
          >
            <Select options={options} onChange={handleSelectChange} />
          </Form.Item>

          {dynamicFields.map((field) => (
            <Form.Item
              key={field.name}
              label={field.name}
              name={field.name}
              rules={[{ required: true, message: `${field.name} is required` }]}
            >
              {renderInput(field.type, field.name)}
            </Form.Item>
          ))}
        </Form>
      </Modal>
    </>
  );
};

export default EditCargoCarrier;
