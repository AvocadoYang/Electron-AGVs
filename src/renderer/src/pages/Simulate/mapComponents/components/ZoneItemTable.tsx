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
import { FC, useEffect, useMemo, useState } from 'react';
import {
  isOpenCargoModal,
  isSelectCargo,
  outputFormData,
  selectedLocation,
  targetKeyJotai,
  zoneValue
} from '../../utils/status';
import { debounceTime, of, switchMap } from 'rxjs';
import styled from 'styled-components';
import _ from 'lodash';
import GlobalLoading from '@renderer/utils/GlobalLoading';
import { useTranslation } from 'react-i18next';

// Define a color palette for consistency
const colors = {
  primary: '#1890ff', // Ant Design's default blue
  primaryHover: '#40a9ff',
  background: '#f5f7fa', // Light gray-blue background
  cardBackground: '#ffffff',
  text: '#333333', // Dark text for readability
  textSecondary: '#666666',
  border: '#e8ecef',
  shadow: 'rgba(0, 0, 0, 0.1)'
};

// Styled FloatBox with enhanced design
const FloatBox = styled.div<{ $shrink: boolean }>`
  position: fixed;
  left: 5em;
  bottom: ${(props) => (props.$shrink ? '-55em' : '5em')};
  transition:
    bottom 0.3s ease-in-out,
    opacity 0.3s ease-in-out;
  opacity: ${(props) => (props.$shrink ? 0.5 : 1)};
  z-index: 1000; /* Ensure it stays above other elements */
`;

// Styled Card with shadow and hover effect
const StyledCard = styled(Card)`
  width: 50em;
  max-width: 90vw; /* Ensure it doesn't overflow on small screens */
  background: ${colors.cardBackground};
  border-radius: 12px;
  box-shadow: 0 4px 12px ${colors.shadow};
  transition:
    transform 0.2s ease-in-out,
    box-shadow 0.2s ease-in-out;
  border: none;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 6px 16px ${colors.shadow};
  }
`;

// Styled Flex container for the content
const ContentFlex = styled(Flex)`
  padding: 1.5em;
  width: 100%;
`;

// Styled Flex for the titles
const TitleFlex = styled(Flex)`
  width: 100%;
  padding: 0 1em;
  margin-bottom: 1em;
`;

// Styled title for "Source" and "Target"
const Title = styled.h2`
  font-size: 1.2em;
  font-weight: 600;
  color: ${colors.text};
  margin: 0;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  background: linear-gradient(90deg, ${colors.primary} 0%, ${colors.primaryHover} 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;

// Wrapper for Transfer to apply custom styles
const TransferWrapper = styled.div`
  width: 100%;
  border: 1px solid ${colors.border};
  border-radius: 8px;
  overflow: hidden;

  .ant-transfer {
    width: 100%;
  }

  .ant-transfer-list {
    border: none !important;
    border-radius: 8px;
    background: ${colors.background};
  }

  .ant-transfer-list-header {
    background: ${colors.primary} !important;
    color: white !important;
    font-weight: 500;
    border-radius: 8px 8px 0 0;
  }

  .ant-transfer-list-body {
    background: ${colors.cardBackground};
  }

  .ant-transfer-operation {
    display: flex;
    align-items: center;
    justify-content: center;

    .ant-btn {
      background: ${colors.primary};
      border-color: ${colors.primary};
      color: white;
      border-radius: 50%;
      width: 36px;
      height: 36px;
      display: flex;
      align-items: center;
      justify-content: center;
      transition:
        background 0.2s ease,
        transform 0.2s ease;

      &:hover {
        background: ${colors.primaryHover};
        border-color: ${colors.primaryHover};
        transform: scale(1.1);
      }

      &:disabled {
        background: ${colors.border};
        border-color: ${colors.border};
        color: ${colors.textSecondary};
      }
    }
  }
`;

// Styled Button with hover animation
const StyledButton = styled(Button)`
  background: ${colors.primary};
  border-color: ${colors.primary};
  color: white;
  border-radius: 8px;
  padding: 0.5em 2em;
  font-weight: 500;
  transition:
    background 0.2s ease,
    transform 0.2s ease;

  &:hover {
    background: ${colors.primaryHover};
    border-color: ${colors.primaryHover};
    transform: scale(1.05);
  }
`;

// Styled Toggle Button (for shrink/expand)
const ToggleButton = styled(Button)`
  position: absolute;
  top: -3.5em;
  left: 50%;
  transform: translateX(-50%);
  background: ${colors.primary};
  border-color: ${colors.primary};
  color: white;
  border-radius: 20px;
  padding: 0.3em 1.5em;
  font-weight: 500;
  transition:
    background 0.2s ease,
    transform 0.2s ease;
  box-shadow: 0 2px 8px ${colors.shadow};

  &:hover {
    background: ${colors.primaryHover};
    border-color: ${colors.primaryHover};
    transform: translateX(-50%) scale(1.05);
  }
`;

type DataType = {
  locationId: string;
  x?: number;
  y?: number;
};

const ZoneItemTable: FC = () => {
  const [targetKeys, setTargetKeys] = useAtom(targetKeyJotai);
  const data = useMap();
  const [isShrink, setIsShrink] = useState(false);
  const value = useAtomValue(zoneValue);
  const [temp, setTemp] = useAtom(outputFormData);
  const setIsSelecting = useSetAtom(isSelectCargo);
  const setOpenModel = useSetAtom(isOpenCargoModal);
  const selectLocation = useAtomValue(selectedLocation);
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
        .filter((v) => v.locationId !== selectLocation)
        .map((v) => ({ locationId: v.locationId, x: v.x, y: v.y })) || []
    );
  }, [data.data?.locations, selectLocation]);

  // Helper to validate if the zone is defined
  const isValidZone = (zone: typeof value) => {
    return (
      zone &&
      typeof zone.startX === 'number' &&
      typeof zone.endX === 'number' &&
      typeof zone.startY === 'number' &&
      typeof zone.endY === 'number' &&
      (zone.startX !== 0 || zone.endX !== 0 || zone.startY !== 0 || zone.endY !== 0)
    );
  };

  useEffect(() => {
    if (temp?.placement) {
      setTargetKeys(temp.placement);
    } else {
      setTargetKeys([]);
    }
  }, [temp, setTargetKeys]);

  useEffect(() => {
    if (!shelves || shelves.length === 0 || !isValidZone(value)) {
      return;
    }

    const subscription = of(value)
      .pipe(
        debounceTime(1000),
        switchMap((zone) => {
          const shelvesInZone = shelves
            .filter(
              (shelf) =>
                shelf.x >= Math.min(zone.startX, zone.endX) &&
                shelf.x <= Math.max(zone.startX, zone.endX) &&
                shelf.y >= Math.min(zone.startY, zone.endY) &&
                shelf.y <= Math.max(zone.startY, zone.endY)
            )
            .filter((v) => v.locationId !== selectLocation)
            .map((shelf) => shelf.locationId);

          return of(shelvesInZone);
        })
      )
      .subscribe((shelvesInZone) => {
        if (!_.isEqual(targetKeys, shelvesInZone)) {
          setTargetKeys(() => {
            return shelvesInZone;
          });
        }
      });

    return () => subscription.unsubscribe();
  }, [value, shelves, selectLocation, setTargetKeys, targetKeys]);

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

  if (!data || !data.data) return <GlobalLoading />;

  return (
    <FloatBox $shrink={isShrink}>
      <ToggleButton
        type={isShrink ? 'primary' : 'default'}
        onClick={() => {
          setIsShrink(!isShrink);
        }}
      >
        {isShrink ? t('sim.modal.expand') : t('sim.modal.mini')}
      </ToggleButton>
      <StyledCard>
        <ContentFlex align="center" vertical gap="large">
          <TitleFlex justify="space-between">
            <Title>{t('sim.modal.source')}</Title>
            <Title>{t('sim.modal.target')}</Title>
          </TitleFlex>
          <TransferWrapper>
            <TableTransfer
              dataSource={shelves}
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
          </TransferWrapper>
          <StyledButton onClick={save} type="primary">
            {t('utils.save')}
          </StyledButton>
        </ContentFlex>
      </StyledCard>
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
    <Transfer {...restProps}>
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
