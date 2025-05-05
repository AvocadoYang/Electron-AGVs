import { message } from 'antd';
import { FC, memo, useCallback } from 'react';

import { WrapperType } from './types';
import styled from 'styled-components';
import CargoDisplay from './CargoDisplay';
import { Info } from '@renderer/sockets/useCargoInfo';
import { LoadingStation } from './LoadingStation';
import { useCargoMutations } from '@renderer/api/useCargoMutations';
import { prefixLevelName } from '@renderer/utils/globalFunction';

const Wrapper = styled.div<WrapperType>`
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: ${({ flex_direction }) => flex_direction};
  width: max-content;
  align-items: center;
  gap: 0.35px;
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
    prevProps.rotate == nextProps.rotate &&
    prevProps.isHaveAction === nextProps.isHaveAction
  );
});

const Cargo: FC<{
  id: string;
  locId: string;
  translateX: number;
  translateY: number;
  rotate: number;
  scale: number;
  flex_direction: string;
  shelfInfo: Info | undefined;
}> = ({ id, locId, translateX, translateY, rotate, scale, flex_direction, shelfInfo }) => {
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
      <WrapperDiv
        flex_direction={flex_direction}
        translatex={translateX}
        translatey={translateY}
        scale={scale}
        rotate={rotate}
      >
        {' '}
        {shelfInfo?.layer?.map((cargo, index: number) => {
          const level = index;

          const cargoValue = cargo[level]?.cargo.hasCargo || false;

          const isDisable = cargo[level]?.disable;
          const isHaveAction = cargo[level]?.booked;

          return (
            <MemoizedCargo
              key={`${locId}-${level}`}
              level={level}
              levelName={prefixLevelName(cargo[level]?.levelName)}
              cargoValue={cargoValue}
              isDisable={isDisable}
              locId={locId}
              rotate={0}
              isHaveAction={isHaveAction}
              handleMouseDown={(e) =>
                handleMouseDown(e as React.MouseEvent<HTMLDivElement>, locId, level)
              }
            />
          );
        })}
      </WrapperDiv>
    </>
  );
};

export default memo(Cargo, (prev, next) => {
  return prev.locId !== next.locId && prev.flex_direction !== next.flex_direction;
});
