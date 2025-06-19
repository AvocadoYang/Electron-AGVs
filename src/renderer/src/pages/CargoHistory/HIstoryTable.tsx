import useCargoHistory from '@renderer/api/useCargoHistory';
import { Typography, Table, Tag, Flex, Card, Space } from 'antd';
import moment from 'moment';
import { FC, useRef, useState } from 'react';
import styled from 'styled-components';
import ReactJsonView from '@uiw/react-json-view';
import { Input, Button } from 'antd';
import type { InputRef, TableColumnType } from 'antd';
import type { FilterDropdownProps } from 'antd/es/table/interface';
import { SearchOutlined } from '@ant-design/icons';
import Highlighter from 'react-highlight-words';
import { useTranslation } from 'react-i18next';

const { Text } = Typography;

const PageContainer = styled.div`
  padding: 24px;
  background-color: #f5f5f5;
`;

const HeaderContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-bottom: 16px;
`;

const StyledTable = styled(Table)`
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

const ActionWrapper = styled.div`
  width: 6em;
`;

const MetaCard = styled(Card)`
  width: 30%;
  min-height: 100%;
`;

const HisCard = styled(Card)`
  width: 70%;
  min-height: 100%;
`;

const NoDefine = styled.span`
  margin: 0;
  font-size: 1.5em;
  font-weight: 600;
  color: #a4a4a4;
`;

type CargoData = {
  id: string;
  status: string;
  metadata: string | null;
  createdAt: Date;
  register_robot?: { id: string };
  script_robot?: { id: string };
  ShelfConfig?: { id: string };
  custom_cargo_metadata?: { custom_name: string };
  history: {
    id: string;
    action: string;
    description?: string;
    actor?: string;
    timestamp: string;
  }[];
};

export enum CargoCurrentStatus {
  ON_AMR = 'ON_AMR',
  AT_LOCATION = 'AT_LOCATION',
  SHIFT = 'SHIFT'
}

export enum CargoAction {
  CREATED = 'CREATED',
  LOAD = 'LOAD',
  OFFLOAD = 'OFFLOAD',
  SHIFTED = 'SHIFTED',
  UPDATED = 'UPDATED'
}

const HistoryTable: FC = () => {
  const { data, refetch, isFetching } = useCargoHistory();
  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');
  const searchInput = useRef<InputRef>(null);
  const { t } = useTranslation();

  const getColumnSearchProps = (dataIndex: keyof CargoData): TableColumnType<CargoData> => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }) => (
      <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
        <Input
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => handleSearch(selectedKeys as string[], confirm, dataIndex)}
          style={{ marginBottom: 8, display: 'block' }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys as string[], confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            Search
          </Button>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters)}
            size="small"
            style={{ width: 90 }}
          >
            Reset
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              confirm({ closeDropdown: false });
              setSearchText((selectedKeys as string[])[0]);
              setSearchedColumn(dataIndex);
            }}
          >
            Filter
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              close();
            }}
          >
            close
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered: boolean) => (
      <SearchOutlined style={{ color: filtered ? '#1677ff' : undefined }} />
    ),
    onFilter: (value, record) =>
      (record[dataIndex] ?? '')
        .toString()
        .toLowerCase()
        .includes((value as string).toLowerCase()),
    filterDropdownProps: {
      onOpenChange(open) {
        if (open) {
          setTimeout(() => searchInput.current?.select(), 100);
        }
      }
    },
    render: (text) =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ''}
        />
      ) : (
        text
      )
  });

  const handleSearch = (
    selectedKeys: React.Key[],
    confirm: FilterDropdownProps['confirm'],
    dataIndex: keyof CargoData
  ) => {
    confirm();
    setSearchText(String(selectedKeys[0] || ''));
    setSearchedColumn(dataIndex as string);
  };

  const handleReset = (clearFilters?: FilterDropdownProps['clearFilters']) => {
    clearFilters?.();
    setSearchText('');
    setSearchedColumn('');
  };

  const searchNestedObject = (obj: any, search: string): boolean => {
    const lowerSearch = search.toLowerCase();
    if (typeof obj === 'string') {
      return obj.toLowerCase().includes(lowerSearch);
    }
    if (Array.isArray(obj)) {
      return obj.some((item) => searchNestedObject(item, search));
    }
    if (typeof obj === 'object' && obj !== null) {
      return Object.values(obj).some((value) => searchNestedObject(value, search));
    }
    return String(obj).toLowerCase().includes(lowerSearch);
  };

  const getActionColor = (action: CargoAction): string => {
    switch (action) {
      case CargoAction.CREATED:
        return 'blue';
      case CargoAction.LOAD:
        return 'gold';
      case CargoAction.OFFLOAD:
        return 'green';
      case CargoAction.SHIFTED:
        return 'default';
      case CargoAction.UPDATED:
        return 'purple';
      default:
        return 'default';
    }
  };

  const columns = [
    {
      title: t('cargo_history.cargoId'),
      dataIndex: 'id',
      key: 'id',
      render: (id: string) => <Text code>{id.slice(0, 8)}...</Text>
    },
    {
      title: t('cargo_history.status'),
      dataIndex: 'status',
      key: 'status',
      render: (status: CargoCurrentStatus) => {
        switch (status) {
          case CargoCurrentStatus.ON_AMR:
            return <Tag color="yellow">{status}</Tag>;
          case CargoCurrentStatus.AT_LOCATION:
            return <Tag color="green">{status}</Tag>;
          case CargoCurrentStatus.SHIFT:
            return <Tag>{status}</Tag>;
          default:
            return <Tag>{status}</Tag>;
        }
      }
    },
    {
      title: t('cargo_history.customFormat'),
      dataIndex: ['custom_cargo_metadata', 'custom_name'],
      key: 'custom_cargo_metadata',
      render: (name: string | undefined) => name || '-'
    },
    {
      title: t('cargo_history.metadata'),
      dataIndex: 'metadata',
      key: 'metadata',
      ...getColumnSearchProps('metadata'),
      render: (meta: string | null) => {
        try {
          const parsed = meta ? JSON.parse(meta) : {};
          return (
            <pre style={{ fontSize: 12 }}>{JSON.stringify(parsed, null, 0).slice(0, 8)}...</pre>
          );
        } catch (e) {
          return <Text type="secondary">Invalid JSON</Text>;
        }
      }
    },
    {
      title: t('cargo_history.createdAt'),
      dataIndex: 'createdAt',
      key: 'createdAt',
      sorter: (a, b) => moment(a.createdAt).unix() - moment(b.createdAt).unix(),
      render: (_v, record: CargoData) => new Date(record.createdAt).toLocaleString()
    }
  ];

  return (
    <PageContainer>
      <HeaderContainer>
        <Button onClick={() => refetch()} loading={isFetching}>
          {t('cargo_history.refetch')}
        </Button>
      </HeaderContainer>
      <StyledTable<any>
        dataSource={data}
        columns={columns}
        pagination={{ pageSize: 20 }}
        rowKey="id"
        expandable={{
          expandedRowRender: (record: CargoData) => (
            <div style={{ width: '100%' }}>
              <Flex gap="small" style={{ width: '100%' }}>
                <MetaCard title={t('cargo_history.metadata')}>
                  {record.metadata ? (
                    <ReactJsonView
                      displayDataTypes={false}
                      value={JSON.parse(record.metadata as string)}
                      collapsed={false}
                      enableClipboard={false}
                      style={{ fontSize: 14 }}
                    />
                  ) : (
                    <NoDefine>{t('cargo_history.no_defined')}</NoDefine>
                  )}
                </MetaCard>
                <HisCard title={t('cargo_history.history')}>
                  <div style={{ marginTop: 8 }}>
                    {[...record.history]
                      .sort(
                        (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
                      )
                      .map((h) => (
                        <Flex key={h.id} gap="small" style={{ marginBottom: 4 }}>
                          <Text type="secondary" style={{ minWidth: 160 }}>
                            {moment(h.timestamp).format('YYYY-MM-DD HH:mm:ss')}
                          </Text>
                          <ActionWrapper>
                            <Tag color={getActionColor(h.action as CargoAction)}>{h.action}</Tag>
                          </ActionWrapper>
                          <span>{h.description}</span>
                        </Flex>
                      ))}
                  </div>
                </HisCard>
              </Flex>
            </div>
          )
        }}
      />
    </PageContainer>
  );
};

export default HistoryTable;
