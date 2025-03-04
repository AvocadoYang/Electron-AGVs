import { ControlTwoTone, DeleteTwoTone, EditOutlined } from '@ant-design/icons';
import client from '@renderer/api/axiosClient';
import { MTType } from '@renderer/api/useMissionTitle';
import { Err } from '@renderer/utils/responseErr';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Button, Flex, message, Popconfirm, Table, Tag } from 'antd';
import { ColumnsType } from 'antd/es/table';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { TitleMission } from './mission';

const TagWrapper = styled.div`
  display: flex;
  gap: 1em;
`;

const MissionTable: FC<{
  setEditMissionKey: React.Dispatch<React.SetStateAction<string>>;
  setOpenMissionModel: React.Dispatch<React.SetStateAction<boolean>>;
  selectedMissionKey: string;
  setSelectedMissionKey: React.Dispatch<React.SetStateAction<string>>;
  setSelectedMissionCar: React.Dispatch<React.SetStateAction<string>>;
  allMissionTitle: MTType;
}> = ({
  setEditMissionKey,
  setOpenMissionModel,
  setSelectedMissionKey,
  setSelectedMissionCar,
  allMissionTitle
}) => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();
  const [messageApi, contextHolders] = message.useMessage();
  const deleteMutation = useMutation({
    mutationFn: (deleteId: string) => {
      return client.post(
        'api/setting/delete-mission-title',
        {
          id: deleteId
        },
        {
          headers: { authorization: `Bearer ${localStorage.getItem('_KMT')}` }
        }
      );
    },
    onSuccess: async () => {
      await queryClient.refetchQueries({
        queryKey: ['all-mission-title']
      });
      await queryClient.refetchQueries({
        queryKey: ['all-relate-task']
      });

      setSelectedMissionKey('');
    },
    onError(error: Err) {
      messageApi.error(error.response.data.msg);
    }
  });

  const handleDelete = (key: string) => {
    deleteMutation.mutate(key);
  };

  const handleClick = async (record: TitleMission) => {
    if (record.Car) {
      setSelectedMissionCar(record.Car.value);
    }
    setSelectedMissionKey(record.id);
    try {
      await queryClient.refetchQueries({ queryKey: ['all-relate-task'] });
    } catch (e) {
      console.log(e);
    }
  };

  const showModal = (key: string) => {
    setEditMissionKey(key);
    setOpenMissionModel(true);
    setSelectedMissionKey('');
  };

  const columns: ColumnsType<TitleMission> = [
    {
      title: t('mission.add_mission.name'),
      dataIndex: 'name',
      key: 'name',
      render: (text: string) => <p>{text}</p>,
      // sorter: (a, b) => a.name.localeCompare(b.name),
      defaultSortOrder: 'ascend'
    },
    {
      title: t('mission.add_mission.car'),
      dataIndex: 'car_type',
      key: 'car_type',
      render: (_, record) => {
        return <p>{record.Car?.name}</p>;
      },
      sorter: (a, b) => a.name.localeCompare(b.name)
    },
    {
      title: t('mission.add_mission.tag'),
      dataIndex: 'tag',
      key: 'tag',
      render: (_, record) => {
        const tags = record.MissionTitleBridgeCategory?.map((c, idx) => (
          <Tag key={c.Category.id || idx} color={c.Category.color}>
            {c.Category.tagName}
          </Tag>
        ));
        return <TagWrapper>{tags || <></>}</TagWrapper>;
      }
    },
    {
      title: '',
      dataIndex: 'operation',
      key: 'operation',
      render: (_, record) => {
        return (
          <>
            <Flex gap="small">
              <Popconfirm title="Sure to delete?" onConfirm={() => handleDelete(record.id)}>
                <Button
                  icon={<DeleteTwoTone twoToneColor="#f30303" />}
                  color="danger"
                  variant="filled"
                  type="link"
                >
                  {t('utils.delete')}
                </Button>
              </Popconfirm>

              <Button
                onClick={() => showModal(record.id)}
                color="primary"
                variant="filled"
                icon={<EditOutlined />}
              >
                {t('mission.add_mission.edit_info')}
              </Button>

              <Button
                onClick={() => handleClick(record)}
                color="purple"
                variant="filled"
                icon={<ControlTwoTone twoToneColor="#5273e0" />}
              >
                {t('mission.add_mission.edit_detail')}
              </Button>
            </Flex>
          </>
        );
      }
    }
  ];

  return (
    <>
      {contextHolders}
      <Table
        bordered
        dataSource={allMissionTitle}
        columns={columns as []}
        rowKey={(record) => record.id}
      />
    </>
  );
};

export default MissionTable;
