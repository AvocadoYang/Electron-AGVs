import useMap from '@renderer/api/useMap';
import { Card, Transfer, TransferProps } from 'antd';
import { useAtomValue } from 'jotai';
import { FC, useEffect, useState } from 'react';
import Draggable from 'react-draggable';
import { zoneValue } from '../../utils/status';
import { debounceTime, of, switchMap } from 'rxjs';

const ZoneItemTable: FC = () => {
  const [targetKeys, setTargetKeys] = useState<TransferProps['targetKeys']>();
  const [selectedKeys, setSelectedKeys] = useState<TransferProps['targetKeys']>([]);
  const data = useMap();
  const value = useAtomValue(zoneValue);

  const shelves = data.data?.locations
    .filter((v) => v.areaType === '存貨區')
    .map((v) => ({ locationId: v.locationId, x: v.x, y: v.y }));

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
        console.log(shelvesInZone);
      });

    return () => subscription.unsubscribe();
  }, [value, shelves]);

  const onChange: TransferProps['onChange'] = (nextTargetKeys, direction, moveKeys) => {
    console.log('targetKeys:', nextTargetKeys);
    console.log('direction:', direction);
    console.log('moveKeys:', moveKeys);
    setTargetKeys(nextTargetKeys);
  };

  const onSelectChange: TransferProps['onSelectChange'] = (
    sourceSelectedKeys,
    targetSelectedKeys
  ) => {
    console.log('sourceSelectedKeys:', sourceSelectedKeys);
    console.log('targetSelectedKeys:', targetSelectedKeys);
    setSelectedKeys([...sourceSelectedKeys, ...targetSelectedKeys]);
  };

  return (
    <Draggable>
      <Card style={{ width: '30em' }}>
        <Transfer
          dataSource={data.data?.locations
            .filter((v) => v.areaType === '存貨區')
            .map((v) => ({ locationId: v.locationId }))}
          titles={['Source', 'Target']}
          targetKeys={targetKeys}
          selectedKeys={selectedKeys}
          onChange={onChange}
          onSelectChange={onSelectChange}
          render={(item) => item.locationId}
        />
      </Card>
    </Draggable>
  );
};

export default ZoneItemTable;
