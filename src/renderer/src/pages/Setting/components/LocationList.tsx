import {
  Form,
  InputNumber,
  Table,
  Typography,
  Select,
  FormInstance,
  Button,
  Checkbox,
  InputRef,
  Input,
  TableColumnType,
  Space,
} from 'antd';
import { FC, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { DeleteTwoTone, SearchOutlined } from '@ant-design/icons';
import styled from 'styled-components';
import { useAtom } from 'jotai';
import { catchError, distinctUntilChanged, filter, of } from 'rxjs';
import { nanoid } from 'nanoid';
import { FilterDropdownProps } from 'antd/es/table/interface';
import { hoverLocation } from '~/configs/globalState';

const Oper = styled.div`
  display: flex;
  gap: 4em;
`;

const Wrapper = styled.div`
  min-width: 75em;
  background-color: #fff;
`;

type LocationType = {
  locationId: number;
  x: number;
  y: number;
  areaType: string;
  rotation: number;
  canRotate: boolean;
};

type DataIndex = keyof LocationType;

interface EditableCellProps extends React.HTMLAttributes<HTMLElement> {
  editing: boolean;
  dataIndex: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  title: any;
  key: string;
  inputType: string;
  record: LocationType;
  index: number;
  children: React.ReactNode;
}

const EditableCell: React.FC<EditableCellProps> = ({
  editing,
  dataIndex,
  title,
  inputType,
  record,
  index,
  children,
  ...restProps
}) => {
  const { t } = useTranslation();

  const areaTypeOption = [
    { value: 'Extra', label: t('none') },
    { value: '充電區', label: t('charge_station') },
    { value: '預派點', label: t('prepare_side') },
    { value: '存貨區', label: t('shelve') },
    { value: '待命區', label: t('wait_side') },
  ];

  const canRotateOption = [
    { value: true, label: t('yes') },
    { value: false, label: t('no') },
  ];

  let inputNode;

  switch (dataIndex) {
    case 'locationId':
      inputNode = <InputNumber disabled />;
      break;
    case 'x':
      inputNode = <InputNumber style={{ width: '150px' }} />;
      break;
    case 'y':
      inputNode = <InputNumber style={{ width: '150px' }} />;
      break;
    case 'areaType':
      inputNode = (
        <Select options={areaTypeOption} style={{ width: '150px' }} />
      );
      break;
    case 'rotation':
      inputNode = <InputNumber style={{ width: '50px' }} />;
      break;
    case 'canRotate':
      inputNode = <Select options={canRotateOption} />;
      break;
    default:
      <InputNumber />;
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
              message: `Please Input !`,
            },
          ]}
        >
          {inputNode}
        </Form.Item>
      ) : (
        children
      )}
    </td>
  );
};

EditableCell.propTypes = {
  editing: PropTypes.bool.isRequired,
  dataIndex: PropTypes.string.isRequired,
  title: PropTypes.node.isRequired,
  inputType: PropTypes.string.isRequired,
  record: PropTypes.shape({
    locationId: PropTypes.number.isRequired,
    x: PropTypes.number.isRequired,
    y: PropTypes.number.isRequired,
    areaType: PropTypes.string.isRequired,
    rotation: PropTypes.number.isRequired,
    canRotate: PropTypes.bool.isRequired,
  }).isRequired,
  index: PropTypes.number.isRequired,
  children: PropTypes.node.isRequired,
};

const LocationList: FC<{
  showEditLocationList: boolean;
  editLocationList: LocationType[];

  deleteListItem: (id: number) => void;
  formLocation: FormInstance<unknown>;
  savePos: (b: boolean) => void;
}> = ({
  showEditLocationList,
  editLocationList,
  formLocation,

  deleteListItem,
  savePos,
}) => {
  const [, setHoverLoc] = useAtom(hoverLocation);
  const searchInput = useRef<InputRef>(null);
  const [editingKey, setEditingKey] = useState<number | null>(null);
  const isEditing = (record: LocationType) => record.locationId === editingKey;
  const { t } = useTranslation();
  const edit = (record: Partial<LocationType> & { locationId: number }) => {
    formLocation.setFieldValue('x', record.x);
    formLocation.setFieldValue('y', record.y);
    formLocation.setFieldValue('canRotate', record.canRotate);
    formLocation.setFieldValue('areaType', record.areaType);
    formLocation.setFieldValue('rotation', record.rotation);
    formLocation.setFieldValue('locationId', record.locationId);
    setEditingKey(record.locationId);
  };

  const handleSearch = (confirm: FilterDropdownProps['confirm']) => {
    confirm();
  };

  const handleReset = (clearFilters: () => void) => {
    clearFilters();
  };

  const getColumnSearchProps = (
    dataIndex: DataIndex,
  ): TableColumnType<LocationType> => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
      close,
    }) => (
      <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
        <Input
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() => handleSearch(confirm)}
          style={{ marginBottom: 8, display: 'block' }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(confirm)}
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            {t('search')}
          </Button>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters)}
            size="small"
            style={{ width: 90 }}
          >
            {t('reset')}
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              confirm({ closeDropdown: false });
            }}
          >
            {t('filter')}
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              close();
            }}
          >
            {t('cecal')}
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered: boolean) => (
      <SearchOutlined style={{ color: filtered ? '#1677ff' : undefined }} />
    ),
    onFilter: (value, record) =>
      record[dataIndex]
        .toString()
        .toLowerCase()
        .includes((value as string).toLowerCase()),
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100);
      }
    },
    render: (text: string) => text,
  });

  const cancel = () => {
    setEditingKey(null);
  };

  const save = () => {
    savePos(true);

    setEditingKey(null);
  };

  const handleHover = (id: number) => {
    if (!id) return;
    of(id.toString())
      .pipe(
        distinctUntilChanged((prev, curr) => prev !== curr),
        filter((v) => v !== undefined),
        catchError((error) => {
          console.log('An error occurred:', error);
          return of('');
        }),
      )
      .subscribe((v) => {
        setHoverLoc(v);
      });
  };

  const columns = [
    {
      title: t('location'),
      dataIndex: 'locationId',
      key: 'locationId',
      editable: true,
      width: '150px',
      sorter: (a: LocationType, b: LocationType) => a.locationId - b.locationId,
      ...getColumnSearchProps('locationId'),
    },
    {
      title: 'X',
      dataIndex: 'x',
      editable: true,
      width: '100px',
      key: 'x',
    },
    {
      title: 'Y',
      dataIndex: 'y',
      editable: true,
      width: '100px',
      key: 'y',
    },
    {
      title: t('yaw'),
      dataIndex: 'rotation',
      editable: true,
      key: 'rotation',
      width: '100px',
    },
    {
      title: '是否可旋轉',
      dataIndex: 'canRotate',
      key: 'canRotate',
      editable: true,
      width: '100px',
      render: (_: unknown, record: LocationType) => {
        return <Checkbox checked={record.canRotate} />;
      },
    },
    {
      title: t('area_type'),
      dataIndex: 'areaType',
      editable: true,
      key: 'areaType',
      width: '150px',
      sorter: (a: LocationType, b: LocationType) =>
        a.areaType.localeCompare(b.areaType),
      render: (_: unknown, record: LocationType) => {
        switch (record.areaType) {
          case 'Extra':
            return t('none');
          default:
            return record.areaType;
        }
      },
    },
    {
      dataIndex: 'operation',
      key: 'operation',

      render: (_: unknown, record: LocationType) => {
        const editable = isEditing(record);
        return editable ? (
          <span>
            <Typography.Link onClick={() => save()} style={{ marginRight: 8 }}>
              {t('save')}
            </Typography.Link>
            <Typography.Link
              onClick={() => cancel()}
              style={{ marginRight: 8 }}
            >
              {t('cancel')}
            </Typography.Link>
          </span>
        ) : (
          <Oper>
            <Typography.Link
              disabled={editingKey !== null}
              onClick={() => edit(record)}
            >
              {t('edit')}
            </Typography.Link>
            <DeleteTwoTone
              twoToneColor="#f30303"
              onClick={() => deleteListItem(record.locationId)}
            />
          </Oper>
        );
      },
    },
  ];

  const mergedColumns = columns.map((col) => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record: LocationType) => ({
        record,
        inputType: col.dataIndex,
        dataIndex: col.dataIndex,
        key: col.key,
        title: col.title,
        editing: isEditing(record),
      }),
    };
  });

  return (
    <Wrapper onMouseLeave={() => setHoverLoc('')}>
      {showEditLocationList ? (
        <Form form={formLocation} component={false}>
          <Table
            rowKey={() => nanoid()}
            components={{
              body: {
                cell: EditableCell,
              },
            }}
            dataSource={editLocationList}
            columns={mergedColumns as []}
            style={{ width: '800px' }}
            // scroll={{ x: 1500, y: 900 }}
            pagination={{
              onChange: cancel,
              pageSize: 20,
            }}
            onRow={(record) => ({
              onMouseEnter: () => {
                handleHover(record.locationId);
              },
            })}
          />
        </Form>
      ) : (
        []
      )}
    </Wrapper>
  );
};

export default LocationList;
