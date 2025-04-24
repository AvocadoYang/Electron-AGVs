import { message } from 'antd';
import { FC, memo, useCallback } from 'react';

import { WrapperType } from './types';
import styled from 'styled-components';
import CargoDisplay from './CargoDisplay';
import { Info } from '@renderer/sockets/useCargoInfo';
import { LoadingStation } from './LoadingStation';
import { useCargoMutations } from '@renderer/api/useCargoMutations';

const Wrapper = styled.div<WrapperType>`
  position: relative;
  z-index: 1;
  border-radius: 3px;
  display: flex;
  gap: 0.2px;
  flex-direction: row;
  border-radius: 1px;
  transform: ${(props) =>
    `translate(${props.translatex}em, ${props.translatey}em) scale(${props.scale}) rotate(${props.rotate}deg)`};
`;

const WrapperDiv = memo(Wrapper);

const MemoizedCargo = memo(CargoDisplay, (prevProps, nextProps) => {
  return (
    prevProps.level == nextProps.level &&
    prevProps.levelName == nextProps.levelName &&
    prevProps.cargoValue == nextProps.cargoValue &&
    prevProps.isDisable == nextProps.isDisable &&
    prevProps.rotate == nextProps.rotate
  );
});

const Cargo: FC<{
  id: string;
  locId: string;
  translateX: number;
  translateY: number;
  rotate: number;
  scale: number;
  shelfInfo: Info | undefined;
}> = ({ id, locId, translateX, translateY, rotate, scale, shelfInfo }) => {
  const [messageApi, contextHolder] = message.useMessage();

  const { editColumnMutation } = useCargoMutations(messageApi);
  const handleMouseDown = useCallback(
    (event: React.MouseEvent<HTMLDivElement>, targetId: string, targetLevel: number) => {
      if (event.button !== 1) return;
      editColumnMutation.mutate({ id, locationId: targetId, level: targetLevel });
    },
    [editColumnMutation]
  );

  if (!shelfInfo) return <LoadingStation />;
  return (
    <>
      {contextHolder}
      <WrapperDiv translatex={translateX} translatey={translateY} scale={scale} rotate={rotate}>
        {' '}
        {shelfInfo?.layer?.map((cargo, index: number) => {
          const level = index;
          const nameLevel = cargo[level]?.levelName || '';
          const cargoValue = cargo[level]?.cargo.hasCargo || false;
          const borderColor = '#c7c7c7';

          const isDisable = cargo[level]?.disable;

          return (
            <MemoizedCargo
              key={`${locId}-${level}`}
              level={level}
              levelName={nameLevel}
              cargoValue={cargoValue}
              isDisable={isDisable}
              border={borderColor}
              locId={locId}
              rotate={0}
              handleMouseDown={(e) => handleMouseDown(e, locId, level)}
            />
          );
        })}
      </WrapperDiv>
    </>
  );
};

export default memo(Cargo, (prev, next) => {
  return prev.locId !== next.locId;
});
