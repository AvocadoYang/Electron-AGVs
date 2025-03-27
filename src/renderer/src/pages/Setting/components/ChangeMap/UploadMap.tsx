import { InboxOutlined } from '@ant-design/icons';
import client from '@renderer/api/axiosClient';
import { useMutation } from '@tanstack/react-query';
import { Button, Form, InputNumber, message, UploadProps } from 'antd';
import Dragger from 'antd/es/upload/Dragger';
import { FC, memo, useState } from 'react';
import { ErrorResponse } from '@renderer/utils/globalType';
import { errorHandler } from '@renderer/utils/utils';

const UploadMap: FC = () => {
  const [form] = Form.useForm();
  const [file, setFile] = useState<File | null>(null);
  const [messageApi, contextHolders] = message.useMessage();

  const uploadMutation = useMutation({
    mutationFn: (formData: FormData) => {
      return client.post('api/setting/map-upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
    },
    onSuccess: () => {
      message.success('Map uploaded successfully!');
    },
    onError: (e: ErrorResponse) => errorHandler(e, messageApi)
  });

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      if (!file) {
        message.error('Please upload a file.');
        return;
      }

      const formData = new FormData();
      formData.append('filePath', file);
      formData.append('mapOriginX', values.mapOriginX);
      formData.append('mapOriginY', values.mapOriginY);

      uploadMutation.mutate(formData);
    } catch (err) {
      console.error('Validation Error:', err);
      message.error('Please complete all required fields.');
    }
  };

  const uploadProps: UploadProps = {
    accept: 'image/*',
    multiple: false,
    beforeUpload: (file) => {
      const isPNG = file.type === 'image/png';

      if (file.name.includes(' ')) {
        message.error(`${file.name} contains spaces, please rename the file.`);
        return false;
      }

      if (!isPNG) {
        message.error(`${file.name} is not a png file`);
        return false;
      }
      setFile(file);
      return false;
    },
    onRemove: () => {
      setFile(null);
    }
  };
  return (
    <>
      {contextHolders}
      <Form form={form} layout="vertical">
        <Form.Item
          name="mapOriginX"
          label="Map Origin X"
          rules={[{ required: true, message: 'Please enter the map origin X.' }]}
        >
          <InputNumber style={{ width: '100%' }} placeholder="Enter map origin X" />
        </Form.Item>
        <Form.Item
          name="mapOriginY"
          label="Map Origin Y"
          rules={[{ required: true, message: 'Please enter the map origin Y.' }]}
        >
          <InputNumber style={{ width: '100%' }} placeholder="Enter map origin Y" />
        </Form.Item>
        <Form.Item label="Upload Map File">
          <Dragger {...uploadProps}>
            <p className="ant-upload-drag-icon">
              <InboxOutlined />
            </p>
            <p className="ant-upload-text">Click or drag file to this area to upload</p>
            <p className="ant-upload-hint">
              Please upload the map image file. Only one file is allowed.
            </p>
          </Dragger>
        </Form.Item>
      </Form>
      <Button key="upload" type="primary" onClick={handleOk} loading={uploadMutation.isLoading}>
        Upload Map
      </Button>
      ,
    </>
  );
};

export default memo(UploadMap);
