import { nanoid } from 'nanoid';
import { FC, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Button,
  ColorPicker,
  Flex,
  Form,
  Input,
  Popconfirm,
  Table,
  Typography,
  message
} from 'antd';
import { CloseOutlined, DeleteTwoTone, EditOutlined } from '@ant-design/icons';
import { useMutation } from '@tanstack/react-query';
import useCategory from '@renderer/api/useCategory';
import client from '@renderer/api/axiosClient';
import SubmitButton from '@renderer/utils/SubmitButton';

// bitch ant design not support the type
interface Color {
  toHexString(): string;
}

interface DataType {
  id: string;
  tagName: string;
  color: string;
}

interface EditableCellProps extends React.HTMLAttributes<HTMLElement> {
  editing: boolean;
  dataIndex: string;

  title: string;
  inputType: string;
  record: DataType;
  index: number;
  children: React.ReactNode;
}

const EditableCell: React.FC<EditableCellProps> = ({
  editing,
  dataIndex,
  children,
  ...restProps
}) => {
  let inputNode;
  const { t } = useTranslation();
  switch (dataIndex) {
    case 'tagName':
      inputNode = <Input style={{ width: '150px' }} />;
      break;
    case 'color':
      inputNode = <ColorPicker format="hex" size="small" showText />;
      break;
    default:
      <Input />;
  }

  return (
    <td {...restProps}>
      {editing ? (
        <Form.Item
          name={dataIndex}
          style={{ margin: 0 }}
          rules={[
            {
              required: true,
              message: t('utils.required')
            }
          ]}
          hasFeedback
        >
          {inputNode}
        </Form.Item>
      ) : (
        children
      )}
    </td>
  );
};

const TagTable: FC = () => {
  const { t } = useTranslation();
  const { data: category, refetch } = useCategory();
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();
  const [editingKey, setEditingKey] = useState<string | null>(null);
  const isEditing = (record: DataType) => record?.id === editingKey;

  const editMutation = useMutation({
    mutationFn: (payload: DataType) => {
      return client.post('api/setting/edit-category', payload);
    },
    onSuccess() {
      void refetch();
    }
  });

  const addMutation = useMutation({
    mutationFn: () => {
      return client.post('api/setting/add-category');
    },
    onSuccess() {
      void refetch();
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (payload: { id: string }) => {
      return client.post('api/setting/delete-category', payload);
    },
    onSuccess() {
      void refetch();
    }
  });

  const edit = (record: Partial<DataType> & { id: string }) => {
    if (record.tagName === 'none') {
      void messageApi.warning(t('other.edit_mission_tag.forbidden_edit_default'));
      return;
    }

    form.setFieldValue('tagName', record.tagName);
    form.setFieldValue('color', record.color);

    setEditingKey(record.id);
  };

  const handleAdd = () => {
    addMutation.mutate();
  };

  const cancel = () => {
    setEditingKey(null);
  };

  const handleDelete = (record: Partial<DataType> & { id: string }) => {
    if (record.tagName === '強制') {
      void messageApi.warning(t('other.edit_mission_tag.forbidden_edit_default'));
      return;
    }

    deleteMutation.mutate({ id: record.id });
  };

  const isColorWithToHexString = (obj: Color): obj is { toHexString: () => string } => {
    return obj && typeof obj.toHexString === 'function';
  };

  const save = (key: string) => {
    const color = form.getFieldValue('color') as Color;

    const hexColor = isColorWithToHexString(color) ? color.toHexString() : (color as string);

    const payload = {
      id: key,
      tagName: form.getFieldValue('tagName') as string,
      color: hexColor
    };

    editMutation.mutate(payload);
    setEditingKey(null);
  };

  const columns = [
    {
      title: t('other.edit_mission_tag.tag'),
      dataIndex: 'tagName',
      key: 'tagName',
      width: 300,
      editable: true
    },
    {
      title: t('other.edit_mission_tag.color'),
      dataIndex: 'color',
      key: 'color',
      width: 100,
      editable: true,
      render: (_v: unknown, record: DataType) => {
        return (
          <ColorPicker
            disabled
            format="hex"
            size="small"
            showText
            value={record.color}
            onChange={(v) => form.setFieldValue('color', v.toHexString())}
          />
        );
      }
    },
    {
      title: '',
      width: 30,
      dataIndex: 'operation',
      key: nanoid(),

      render(_v: unknown, record: DataType) {
        const editable = isEditing(record);

        return editable ? (
          <Flex gap="small">
            <Typography.Link
              onClick={() => {
                save(record.id);
              }}
              style={{ marginRight: 8 }}
            >
              <SubmitButton isModel={false} form={form} text="save" />
            </Typography.Link>
            <Typography.Link
              onClick={() => {
                cancel();
              }}
              style={{ marginRight: 8 }}
            >
              <Button icon={<CloseOutlined />} color="danger" variant="filled" type="link">
                {t('utils.cancel')}
              </Button>
            </Typography.Link>
          </Flex>
        ) : (
          <Flex gap="small">
            <Typography.Link
              disabled={editingKey !== null}
              onClick={() => {
                edit(record);
              }}
            >
              <Button icon={<EditOutlined />} color="primary" variant="filled" type="link">
                {t('utils.edit')}
              </Button>
            </Typography.Link>
            <Popconfirm
              title={t('utils.delete')}
              description={t('utils.delete_warn')}
              onConfirm={() => handleDelete({ id: record.id })}
              onCancel={cancel}
              okText={t('utils.yes')}
              cancelText={t('utils.no')}
            >
              <Button
                icon={<DeleteTwoTone twoToneColor="#f30303" />}
                color="danger"
                variant="filled"
                type="link"
              >
                {t('utils.delete')}
              </Button>
            </Popconfirm>
          </Flex>
        );
      }
    }
  ];

  const mergedColumns = columns.map((col) => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record: DataType) => ({
        record,
        inputType: col.dataIndex,
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record)
      })
    };
  });

  return (
    <>
      {contextHolder}
      <Button color="primary" variant="filled" onClick={() => handleAdd()}>
        {t('utils.add')}
      </Button>
      <Form form={form} component={false}>
        <Table
          rowKey={() => nanoid()}
          components={{
            body: {
              cell: EditableCell
            }
          }}
          columns={mergedColumns}
          dataSource={category as DataType[]}
        />
      </Form>
    </>
  );
};

export default TagTable;
