import useCustomCargoFormat from '@renderer/api/useCustomCargoFormat';
import { Button, Flex, Form, Input, message, Modal, Select } from 'antd';
import { FC, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import ReactJsonView from '@uiw/react-json-view';
import { useMutation } from '@tanstack/react-query';
import client from '@renderer/api/axiosClient';
import { ErrorResponse } from '@renderer/utils/globalType';
import { errorHandler } from '@renderer/utils/utils';
import { useAtom, useAtomValue } from 'jotai';
import { GlobalCargoInfo, GlobalCargoInfoModal } from './jotaiState';
import { StyledForm, StyledJsonPreview } from './cargoDetailStyle';

type DataType = {
  id: string;
  custom_name: string;
  is_default: boolean;
  format: string;
};

const CargoDetail: FC = () => {
  const { t } = useTranslation();
  const { data } = useCustomCargoFormat();
  const [form] = Form.useForm();
  const [format, setFormat] = useState<DataType | null>(null);
  const [dynamicFields, setDynamicFields] = useState<{ name: string; type: string }[]>([]);
  const [messageApi, contextHolder] = message.useMessage();
  const { dbId, locationId, level, cargoInfoId, customCargoMetadataId, metadata } =
    useAtomValue(GlobalCargoInfo);

  const [openCargoModal, setOpenCargoModal] = useAtom(GlobalCargoInfoModal);

  const options = data?.map((v) => ({
    label: v?.custom_name,
    value: v?.id
  }));

  const editMutation = useMutation({
    mutationFn: (payload: {
      dbId: string;
      locationId: string;
      level: number;
      cargoInfoId: string | null;
      metadata: string;
      customCargoMetadataId: string;
    }) => client.post('/api/setting/update-cargo-info', payload),
    onSuccess: () => {
      messageApi.success(t('utils.success'));
      form.resetFields();
      setOpenCargoModal(false);
    },
    onError: (e: ErrorResponse) => errorHandler(e, messageApi)
  });

  const handleCancel = () => {
    setOpenCargoModal(false);
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

  const handleOk = () => {
    if (!dbId || !locationId) return;

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
          dbId,
          locationId,
          level,
          cargoInfoId,
          metadata: JSON.stringify(formData.metadata),
          customCargoMetadataId: formData.custom_cargo_metadata_id
        });
      })
      .catch((error) => {
        console.error('Form validation failed:', error);
      });
  };

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

    console.log(customCargoMetadataId, 'custom');
    console.log(metadata, 'metadata');

    // 可能被車輛送到一組未知的貨物格式
    if (!customCargoMetadataId && metadata) {
      console.log('Case 1: Display metadata read-only');
      setFormat(null);
      form.setFieldsValue({ custom_cargo_metadata_id: null });
      return;
    }

    // 當原本沒有貨物 使用者新創一組貨物
    if (!customCargoMetadataId && !metadata) {
      console.log('Case 2: User creating new cargo, start fresh');
      setFormat(null);
      form.resetFields(); // reset in case any leftover data
      return;
    }

    // 編輯已存在貨物資訊
    if (customCargoMetadataId && metadata && cargoInfoId) {
      console.log('Case 3: Editing existing cargo');

      const selectedFormat = data.find((v) => v?.id === customCargoMetadataId);
      if (!selectedFormat) {
        console.warn('Could not find format for ID:', customCargoMetadataId);
        return;
      }

      setFormat(selectedFormat as DataType);
      form.setFieldsValue({
        custom_cargo_metadata_id: customCargoMetadataId
      });

      try {
        const parsedMetadata = JSON.parse(metadata);
        form.setFieldsValue(parsedMetadata);
      } catch (err) {
        console.error('Failed to parse metadata JSON:', err);
      }
    }
  }, [data, form, customCargoMetadataId, metadata, cargoInfoId]);

  const handleSelectChange = (value: string) => {
    const selectedFormat = data?.find((v) => v?.id === value);
    setFormat(selectedFormat as DataType);
  };

  return (
    <>
      {contextHolder}
      <Modal
        title={t('amr_card.update_cargo')}
        open={openCargoModal}
        onCancel={handleCancel}
        mask={false}
        footer={<></>}
      >
        <StyledForm form={form} layout="vertical">
          <Form.Item
            label={t('customCargo.name')}
            name="custom_cargo_metadata_id"
            rules={[{ required: true, message: t('utils.required') }]}
          >
            <Select options={options} onChange={handleSelectChange} />
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
                {metadata && metadata !== 'null' ? (
                  <StyledJsonPreview>
                    <ReactJsonView
                      displayDataTypes={false}
                      value={metadata as {}}
                      collapsed={false}
                      enableClipboard={false}
                      style={{ fontSize: 14 }}
                    />
                  </StyledJsonPreview>
                ) : (
                  []
                )}
              </Flex>
            </>
          )}

          <Button onClick={() => handleOk()}>{t('utils.save')}</Button>
        </StyledForm>
      </Modal>
    </>
  );
};

export default CargoDetail;
