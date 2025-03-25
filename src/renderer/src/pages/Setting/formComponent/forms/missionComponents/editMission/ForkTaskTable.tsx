import React, { FC, useState } from 'react';
import {
  DeleteTwoTone,
  EditOutlined,
  EyeInvisibleOutlined,
  EyeOutlined,
  ImportOutlined,
  MenuOutlined
} from '@ant-design/icons';
import { Button, Flex, Popconfirm, Table, Tooltip, message } from 'antd';
import { ColumnsType } from 'antd/es/table';
import type { DragEndEvent } from '@dnd-kit/core';
import { DndContext } from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import useTaskFork from '../../../../../../api/useTaskFork';
import client from '@renderer/api/axiosClient';
import ImportMissionForm from './ImportMissionForm';
import { Fork_mission_Slice } from './mission';
import { Err } from '@renderer/utils/responseErr';
import CarControlTranslate from './CarControlTranslate';

enum YawGenre {
  CUSTOM,
  SELECT,
  CALCULATE_BY_AGV_AND_SHELF_ANGLE
}

interface RowProps extends React.HTMLAttributes<HTMLTableRowElement> {
  'data-row-key': string;
  'children': React.ReactNode;
}

const ActiveBox = styled.div`
  min-width: 4em;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-around;
`;

type DotStyle = {
  $active: boolean;
};

const Dot = styled.div<DotStyle>`
  border-radius: 99%;
  width: 7px;
  height: 7px;
  background-color: ${(prop) => (prop.$active ? '#979797' : '#2bea00')};
`;

const SpanBlock = styled.div`
  min-width: 5em;
  letter-spacing: 2px;
`;

const DataRow = ({ children, ...props }: RowProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({
    id: props['data-row-key']
  });

  const style: React.CSSProperties = {
    ...props.style,
    transform: CSS.Transform.toString(transform && { ...transform, scaleY: 1 })?.replace(
      /translate3d\(([^,]+),/,
      'translate3d(0,'
    ),
    transition,
    ...(isDragging ? { position: 'relative', zIndex: 9999 } : {})
  };

  return (
    <tr {...props} ref={setNodeRef} style={style} {...attributes}>
      {React.Children.map(children, (child) => {
        if ((child as React.ReactElement).key === 'sort') {
          return React.cloneElement(child as React.ReactElement, {
            children: (
              <MenuOutlined
                ref={setActivatorNodeRef}
                style={{ touchAction: 'none', cursor: 'move' }}
                {...listeners}
              />
            )
          });
        }
        return child;
      })}
    </tr>
  );
};

const ForkTaskTable: FC<{
  showModal: (key: string) => void;
  selectedMissionKey: string;
  selectedMissionCar: string;
}> = ({ showModal, selectedMissionKey, selectedMissionCar }) => {
  const { data: taskDataSource } = useTaskFork(selectedMissionKey);

  const [messageApi, contextHolder] = message.useMessage();
  const queryClient = useQueryClient();
  const { t } = useTranslation();
  const [importConfig, setImportConfig] = useState<{ order: number; key: string } | null>(null);
  const [showImportMission, setShowImportMission] = useState(false);
  const sortTaskMutation = useMutation({
    mutationFn: (keyAndSort: { key: string; order: number }[]) => {
      return client.post('api/setting/update-task-order', keyAndSort);
    },
    onSuccess: async () => {
      await queryClient.refetchQueries({
        queryKey: ['all-relate-task-fork', selectedMissionKey]
      });
    },
    onError(error: Err) {
      messageApi.error(error.response.data.msg);
    }
  });
  const deleteTaskMutation = useMutation({
    mutationFn: (payload: { key: string; keyAndOrder: { key: string; order: number }[] }) => {
      return client.post('api/setting/delete-task', {
        targetKey: payload.key,
        newOrder: payload.keyAndOrder
      });
    },
    onSuccess: async () => {
      await queryClient.refetchQueries({ queryKey: ['all-relate-task-fork'] });
    },
    onError(error: Err) {
      messageApi.error(error.response.data.msg);
    }
  });

  const disableMutation = useMutation({
    mutationFn: (payload: { id: string; disable: boolean }) => {
      return client.post('api/setting/disable-task', payload);
    },
    onSuccess: async () => {
      void messageApi.success(t('utils.success'));
      await queryClient.refetchQueries({ queryKey: ['all-relate-task-fork'] });
    },
    onError(error: Err) {
      messageApi.error(error.response.data.msg);
    }
  });

  const deleteTask = (key: string) => {
    if (!taskDataSource) return;
    const targetIndex = taskDataSource.findIndex((v) => v?.id === key);
    if (targetIndex === -1) return;
    const updatedDataSource = taskDataSource.filter((v) => v?.id !== key);
    const updatedDataSourceWithOrder = updatedDataSource.map((item, index) => ({
      ...item,
      order: index
    }));
    const keyAndOrder = updatedDataSourceWithOrder.map((v) => ({
      key: v.id as string,
      order: v.order
    }));

    deleteTaskMutation.mutate({ key, keyAndOrder });
  };

  const onDragEnd = ({ active, over }: DragEndEvent) => {
    if (!taskDataSource) return;
    if (active.id !== over?.id) {
      const activeIndex = taskDataSource.findIndex((i) => i?.id === active.id);
      const overIndex = taskDataSource.findIndex((i) => i?.id === over?.id);
      const newData = arrayMove(taskDataSource, activeIndex, overIndex);

      const sorData = newData.map((v, i) => ({
        ...v,
        order: i
      }));

      const keyAndSort = sorData.map((v) => ({ key: v.id as string, order: v.order }));

      sortTaskMutation.mutate(keyAndSort);

      queryClient.setQueryData(['all-relate-task-fork', selectedMissionKey], sorData);
    }
  };

  const disableTask = (id: string, disable: boolean) => {
    disableMutation.mutate({ id, disable });
  };

  const showImportMissionModal = (order: number) => {
    setShowImportMission(true);
    setImportConfig({ key: selectedMissionKey, order: order + 1 });
  };

  const columns: ColumnsType<Fork_mission_Slice> = [
    {
      title: t('mission.task_table.sort'),
      key: 'sort',
      width: 100
    },
    {
      title: t('mission.task_table.sort'),
      key: 'order',
      dataIndex: 'order',
      render(_, record) {
        return record.process_order;
      }
    },
    {
      title: t('mission.task_table.status'),
      key: 'status',
      dataIndex: 'status',
      width: 100,
      render: (_v, record) => {
        return (
          <ActiveBox>
            <Dot $active={record.disable as boolean} />{' '}
            <>
              {record.disable ? t('mission.task_table.inactive') : t('mission.task_table.active')}
            </>
          </ActiveBox>
        );
      }
    },
    {
      title: t('mission.task_table.action'),
      children: [
        {
          title: t('mission.task_table.action'),
          dataIndex: 'genre',
          key: 'genre',
          width: 50,
          render: (_, record) => {
            if (record.operation.type === null) {
              return <p />;
            }

            return <CarControlTranslate word={record.operation.type} />;
          }
        },

        {
          title: t('mission.task_table.wait'),
          dataIndex: 'wait',
          key: 'wait',
          render: (_, record) => {
            return record.operation.wait;
          }
        },
        {
          title: t('mission.task_table.is_custom_location'),
          dataIndex: 'is_define_id',
          key: 'is_define_id',
          render: (_v, record) => {
            switch (record.operation.is_define_id) {
              case 'custom':
                return t('mission.task_table.custom');

              case 'auto':
                return t('mission.task_table.auto');

              case 'select':
                return t('mission.task_table.is_selectable');

              default:
                return <></>;
            }
          }
        },
        {
          title: t('mission.task_table.location'),
          dataIndex: 'locationId',
          key: 'locationId',
          render: (_, record) => {
            return record.operation.id;
          }
        },

        {
          title: t('mission.task_table.is_custom_yaw'),
          dataIndex: 'is_define_yaw',
          key: 'is_define_yaw',
          render: (_v, record) => {
            switch (record.operation.is_define_yaw) {
              case YawGenre.CUSTOM:
                return <SpanBlock>{t('mission.task_table.custom')}</SpanBlock>;
              case YawGenre.SELECT:
                return <SpanBlock>{t('mission.task_table.by_target_shelf_setting')}</SpanBlock>;
              case YawGenre.CALCULATE_BY_AGV_AND_SHELF_ANGLE:
                return (
                  <SpanBlock>{t('mission.task_table.calculate_by_agv_and_shelf_angle')}</SpanBlock>
                );
              default:
                return '';
            }
          }
        },
        {
          title: t('mission.task_table.yaw'),
          dataIndex: 'yaw',
          key: 'yaw',
          render: (_, record) => {
            return record.operation.yaw;
          }
        },
        {
          title: t('mission.task_table.auto_preparatory_point'),
          dataIndex: 'auto_preparatory_point',
          key: 'auto_preparatory_point',
          render: (_v, record) => {
            return record.operation.auto_preparatory_point ? t('utils.yes') : t('utils.no');
          }
        },

        {
          title: t('mission.task_table.is_define_heigh'),
          dataIndex: 'is_define_height',
          key: 'is_define_height',
          render: (_, record) => {
            switch (record.io.fork.is_define_height) {
              case 'custom':
                return t('mission.task_table.custom');

              case 'auto':
                return t('mission.task_table.auto');

              case 'select':
                return t('mission.task_table.is_selectable');

              default:
                return <></>;
            }
          }
        },
        {
          title: t('mission.task_table.height'),
          dataIndex: 'f_height',
          key: 'f_height',
          render: (_, record) => {
            return record.io.fork.height;
          }
        },

        {
          title: t('mission.task_table.has_cargo_to_process'),
          dataIndex: 'hasCargoToProcess',
          key: 'hasCargoToProcess',
          render: (_, record) => {
            return record.operation.hasCargoToProcess ? t('utils.yes') : t('utils.no');
          }
        },

        {
          title: t('mission.task_table.amr_list'),
          dataIndex: 'waitOtherAmr',
          key: 'waitOtherAmr'
        },
        {
          title: t('mission.task_table.wait_genre'),
          dataIndex: 'waitGenre',
          key: 'waitGenre',
          render: (_, record) => {
            if (record.operation.waitGenre === 'first') {
              return t('mission.task_table.execute_first');
            }
            if (record.operation.waitGenre === 'second') {
              return t('mission.task_table.wait_other_finish');
            }
            return '';
          }
        }
      ]
    },
    {
      title: '',
      dataIndex: '',
      width: 150,
      render: (_v, record) => {
        return (
          <Flex gap="small">
            <Popconfirm title="Sure to delete?" onConfirm={() => deleteTask(record.id)}>
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
              icon={<EditOutlined />}
              color="primary"
              variant="filled"
              type="link"
            >
              {t('utils.edit')}
            </Button>

            <Button
              onClick={() => showImportMissionModal(record.process_order)}
              icon={<ImportOutlined />}
              color="primary"
              variant="filled"
              type="link"
            >
              {t('mission.task_table.import_mission')}
            </Button>

            <Tooltip
              placement="right"
              title={
                record.disable
                  ? t('mission.task_table.in_use')
                  : t('mission.task_table.stop_this_process')
              }
            >
              {record.disable ? (
                <Button
                  onClick={() => disableTask(record.id, false)}
                  icon={<EyeInvisibleOutlined />}
                  color="primary"
                  variant="filled"
                  type="link"
                ></Button>
              ) : (
                <Button
                  onClick={() => disableTask(record.id, true)}
                  icon={<EyeOutlined />}
                  color="primary"
                  variant="filled"
                  type="link"
                ></Button>
              )}
            </Tooltip>
          </Flex>
        );
      }
    }
  ];

  if (!taskDataSource) return [];
  return (
    <>
      {contextHolder}

      <DndContext onDragEnd={onDragEnd}>
        <SortableContext
          items={taskDataSource.map((i) => i?.id || '')}
          strategy={verticalListSortingStrategy}
        >
          <Table
            components={{
              body: {
                row: DataRow
              }
            }}
            rowKey={(record) => record?.id as string}
            columns={columns as []}
            dataSource={taskDataSource}
            bordered
            pagination={{ pageSize: 50 }}
          />
        </SortableContext>
      </DndContext>
      <ImportMissionForm
        showImportMission={showImportMission}
        setShowImportMission={setShowImportMission}
        importConfig={importConfig}
        selectedMissionCar={selectedMissionCar}
      />
    </>
  );
};

export default ForkTaskTable;
