import client from '@renderer/api/axiosClient';
import useCustomCargoFormat from '@renderer/api/useCustomCargoFormat';
import { useIsCarry } from '@renderer/sockets/useAMRInfo';
import { ErrorResponse } from '@renderer/utils/globalType';
import { errorHandler } from '@renderer/utils/utils';
import { useMutation } from '@tanstack/react-query';
import { Form, Modal, Select, Input, message, Switch, Flex } from 'antd';
import { FC, Dispatch, SetStateAction, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import ReactJsonView from '@uiw/react-json-view';

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
  const [hasCargo, setHasCargo] = useState(false);
  const { isCarry, metadata, customCargoMetadataId } = useIsCarry(amrId);

  const options = data?.map((v) => ({
    label: v?.custom_name,
    value: v?.id
  }));

  const editMutation = useMutation({
    mutationFn: (payload: {
      amrId: string;
      hasCargo: boolean;
      metadata: string;
      custom_cargo_metadata_id: string;
    }) => client.post('/api/amr/update-cargo-info', payload),
    onSuccess: () => {
      messageApi.success(t('utils.success'));
      setIsModalOpen(false);
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
    if (!isModalOpen) return;

    if (isCarry) {
      setHasCargo(true);
      try {
        const parsed = metadata ? JSON.parse(metadata) : {};

        form.setFieldsValue({
          hasCargo: true,
          ...parsed
        });
      } catch (err) {
        console.error('Failed to parse metadata from socket:', err);
      }
    }
  }, [isCarry, metadata, isModalOpen, form]);

  useEffect(() => {
    if (!data || data.length === 0) return;

    // console.log('render');
    // console.log(customCargoMetadataId, 'custom');

    if (customCargoMetadataId) {
      //   console.log('1');
      const customData = data.find((v) => v?.id === customCargoMetadataId);
      setFormat(customData as DataType);
      form.setFieldsValue({ custom_cargo_metadata_id: customData?.id });
    } else {
      const defaultData = data.find((v) => v?.is_default);
      //console.log('2');
      //可能是取到的貨格式沒有在定義內
      if (!defaultData || customCargoMetadataId === null) {
        //console.log('3');
        setFormat(null);
        form.setFieldsValue({ custom_cargo_metadata_id: null });
        return;
      }
      //  console.log('4');
      setFormat(defaultData as DataType);
      form.setFieldsValue({ custom_cargo_metadata_id: defaultData?.id });
    }
  }, [data, form, isCarry]);

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

        editMutation.mutate({
          amrId,
          metadata: JSON.stringify(formData.metadata),
          hasCargo,
          custom_cargo_metadata_id: formData.custom_cargo_metadata_id
        });
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
          <Form.Item label={t('customCargo.name')} name="custom_cargo_metadata_id">
            <Select options={options} onChange={handleSelectChange} />
          </Form.Item>

          <Form.Item
            label={t('shelf.layer_form.has_cargo')}
            name={`hasCargo`}
            valuePropName="checked"
          >
            <Switch
              value={hasCargo}
              onChange={() => setHasCargo(!hasCargo)}
              checkedChildren={t('shelf.layer_form.has_cargo')}
              unCheckedChildren={t('shelf.layer_form.no_cargo')}
            />
          </Form.Item>

          {format ? (
            dynamicFields.map((field) => (
              <Form.Item key={field.name} label={field.name} name={field.name}>
                {renderInput(field.type, field.name)}
              </Form.Item>
            ))
          ) : (
            <>
              <Flex vertical gap="middle">
                <p>{t('customCargo.not_defined_format')}</p>
                {metadata ? (
                  <ReactJsonView
                    displayDataTypes={false}
                    value={JSON.parse(metadata as string)}
                    collapsed={false}
                    enableClipboard={false}
                    style={{ fontSize: 14 }}
                  />
                ) : (
                  []
                )}
              </Flex>
            </>
          )}
        </Form>
      </Modal>
    </>
  );
};

export default EditCargoCarrier;
