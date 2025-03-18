import useMap from '@renderer/api/useMap';
import {
  Button,
  Card,
  Flex,
  Table,
  Transfer,
  type GetProp,
  type TableColumnsType,
  type TableProps,
  type TransferProps
} from 'antd';
import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import { FC, useEffect, useMemo } from 'react';
import {
  isOpenCargoModal,
  isSelectCargo,
  outputFormData,
  targetKeyJotai,
  zoneValue
} from '../../utils/status';
import { debounceTime, of, switchMap } from 'rxjs';
import styled from 'styled-components';
import _ from 'lodash';
import GlobalLoading from '@renderer/utils/GlobalLoading';
import { useTranslation } from 'react-i18next';

const FloatBox = styled.div`
  position: fixed;
  left: 5em;
  bottom: 5em;
`;

type DataType = {
  locationId: string;
};

const ZoneItemTable: FC = () => {
  const [targetKeys, setTargetKeys] = useAtom(targetKeyJotai);
  const data = useMap();
  const value = useAtomValue(zoneValue);
  const [temp, setTemp] = useAtom(outputFormData);
  const setIsSelecting = useSetAtom(isSelectCargo);
  const setOpenModel = useSetAtom(isOpenCargoModal);
  const { t } = useTranslation();

  const columns: TableColumnsType<DataType> = [
    {
      dataIndex: 'locationId',
      title: t('sim.modal.location'),
      key: 'locationId'
    }
  ];

  const shelves = useMemo(() => {
    return (
      data.data?.locations
        .filter((v) => v.areaType === '存貨區')
        .map((v) => ({ locationId: v.locationId, x: v.x, y: v.y })) || []
    );
  }, [data.data?.locations]);

  useEffect(() => {
    const subscription = of(value)
      .pipe(
        debounceTime(1000),
        switchMap((zone) => {
          if (!shelves || !zone) return of([]);

          const shelvesInZone = shelves
            .filter(
              (shelf) =>
                shelf.x >= Math.min(zone.startX, zone.endX) &&
                shelf.x <= Math.max(zone.startX, zone.endX) &&
                shelf.y >= Math.min(zone.startY, zone.endY) &&
                shelf.y <= Math.max(zone.startY, zone.endY)
            )
            .map((shelf) => shelf.locationId);

          return of(shelvesInZone);
        })
      )
      .subscribe((shelvesInZone) => {
        if (!_.isEqual(targetKeys, shelvesInZone)) {
          setTargetKeys((prev) => {
            if (!prev) return shelvesInZone;

            const combinedSet = new Set([...prev, ...shelvesInZone]);
            return Array.from(combinedSet);
          });
        }
      });

    return () => subscription.unsubscribe();
  }, [value, shelves]);

  const onChange: TransferProps['onChange'] = (nextTargetKeys) => {
    setTargetKeys(nextTargetKeys);
  };

  const save = () => {
    setTemp((prev) => {
      if (!prev) return null;

      return {
        ...prev,
        placement: targetKeys?.map((v) => v as string) || []
      };
    });

    setIsSelecting(false);
    setOpenModel(true);
  };

  useEffect(() => {
    if (!temp) return;
    setTargetKeys(temp.placement);
  }, [temp]);

  if (!data || !data.data) return <GlobalLoading />;
  return (
    <FloatBox>
      <Card style={{ width: '50em' }}>
        <Flex align="center" vertical gap="large">
          <TableTransfer
            dataSource={data.data?.locations
              .filter((v) => v.areaType === '存貨區')
              .map((v) => ({ locationId: v.locationId }))}
            titles={['Source', 'Target']}
            targetKeys={targetKeys}
            onChange={onChange}
            showSearch
            filterOption={filterOption}
            rowKey={(record) => record.locationId}
            render={(item) => item.locationId}
            leftColumns={columns}
            rightColumns={columns}
          />
          <Button onClick={save} variant="filled" color="primary">
            {t('utils.save')}
          </Button>
        </Flex>
      </Card>
    </FloatBox>
  );
};

type TransferItem = GetProp<TransferProps, 'dataSource'>[number];
type TableRowSelection<T extends object> = TableProps<T>['rowSelection'];
interface TableTransferProps extends TransferProps<TransferItem> {
  dataSource: DataType[];
  leftColumns: TableColumnsType<DataType>;
  rightColumns: TableColumnsType<DataType>;
}

const filterOption = (input: string, item: DataType) => item.locationId?.includes(input);

const TableTransfer: React.FC<TableTransferProps> = (props) => {
  const { leftColumns, rightColumns, ...restProps } = props;

  return (
    <Transfer style={{ width: '100%' }} {...restProps}>
      {({
        direction,
        filteredItems,
        onItemSelectAll,
        selectedKeys: listSelectedKeys,
        disabled: listDisabled
      }) => {
        const columns = direction === 'left' ? leftColumns : rightColumns;
        const rowSelection: TableRowSelection<TransferItem> = {
          onChange(selectedRowKeys) {
            onItemSelectAll(selectedRowKeys, 'replace');
          },
          selectedRowKeys: listSelectedKeys,
          selections: [Table.SELECTION_ALL, Table.SELECTION_INVERT, Table.SELECTION_NONE]
        };

        return (
          <Table
            rowSelection={rowSelection}
            columns={columns}
            dataSource={filteredItems}
            size="small"
            rowKey={(record) => record.locationId}
            style={{ pointerEvents: listDisabled ? 'none' : undefined }}
          />
        );
      }}
    </Transfer>
  );
};

export default ZoneItemTable;
