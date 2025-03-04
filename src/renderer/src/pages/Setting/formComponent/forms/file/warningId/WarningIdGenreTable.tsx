import { DeleteOutlined } from '@ant-design/icons';
import client from '@renderer/api/axiosClient';
import useWarningGenre from '@renderer/api/useWarningGenre';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Button, Popconfirm, Table, TableProps } from 'antd';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';

interface DataType {
  id: string;
  name_ch: string;
  name_en: string;
}

const WarningIdGenreTable: FC = () => {
  const { data, refetch } = useWarningGenre();
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: (payload: { id: string }) => {
      return client.post('api/setting/delete-warning-genre', payload);
    },
    onSuccess: async () => {
      await queryClient.refetchQueries({
        queryKey: ['warning-table']
      });

      void refetch();
    }
  });

  const handleDelete = (id: string) => {
    deleteMutation.mutate({ id });
  };

  const columns: TableProps<DataType>['columns'] = [
    {
      title: t('file.warning_list.genre'),
      dataIndex: 'name',
      key: 'name',
      render: (_, record) => (
        <span>
          {record.name_ch} | {record.name_en}
        </span>
      )
    },
    {
      title: '',
      width: 30,
      dataIndex: 'operation',
      key: 'operation',

      render(_v: unknown, record: DataType) {
        return (
          <>
            <Popconfirm title="Sure to delete?" onConfirm={() => handleDelete(record.id)}>
              <Button
                icon={<DeleteOutlined color="#ff0707" />}
                color="danger"
                variant="filled"
                type="link"
              >
                {t('utils.delete')}
              </Button>
            </Popconfirm>
          </>
        );
      }
    }
  ];

  return <Table<DataType> rowKey={(record) => record.id} columns={columns} dataSource={data} />;
};

export default WarningIdGenreTable;
