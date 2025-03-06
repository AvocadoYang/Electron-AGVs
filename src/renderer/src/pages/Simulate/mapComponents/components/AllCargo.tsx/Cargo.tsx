import { message } from 'antd';
import { FC, memo, useCallback } from 'react';

import { WrapperType } from './types';
import styled from 'styled-components';
import { useCargoMutations } from './hook/useCargoMutations';
import CargoDisplay from './CargoDisplay';
import { Info } from '@renderer/sockets/useCargoInfo';
import { LoadingStation } from './LoadingStation';
import {
  isOpenCargoModal,
  isSelectCargo,
  targetKeyJotai
} from '@renderer/pages/Simulate/utils/status';
import { useAtomValue, useSetAtom } from 'jotai';

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
  locId: string;
  translateX: number;
  translateY: number;
  rotate: number;
  scale: number;
  shelfInfo: Info | undefined;
}> = ({ locId, translateX, translateY, rotate, scale, shelfInfo }) => {
  const [messageApi, contextHolder] = message.useMessage();
  const setTargetKey = useSetAtom(targetKeyJotai);
  const setIsOpening = useSetAtom(isOpenCargoModal);
  const isSelecting = useAtomValue(isSelectCargo);
  const { editColumnMutation } = useCargoMutations(messageApi);
  const handleMouseDown = useCallback(
    (event: React.MouseEvent<HTMLDivElement>, targetId: string, targetLevel: number) => {
      if (event.button !== 1) return;
      editColumnMutation.mutate({ locationId: targetId, level: targetLevel });
    },
    [editColumnMutation]
  );

  const handleClick = (locationId: string) => {
    if (!isSelecting) {
      setIsOpening(true);
      return;
    }

    setTargetKey((prev) => {
      if (!prev) return;
      return [...prev, locationId];
    });
  };

  if (!shelfInfo) return <LoadingStation />;
  return (
    <>
      {contextHolder}
      <WrapperDiv
        onClick={() => handleClick(locId)}
        translatex={translateX}
        translatey={translateY}
        scale={scale}
        rotate={rotate}
      >
        {' '}
        {shelfInfo?.layer?.map((cargo, index: number) => {
          const level = index;
          const nameLevel = cargo[level]?.levelName || '';
          const cargoValue = cargo[level]?.cargo.hasCargo || false;
          const borderColor = (
            cargo[level]?.pallet?.color !== null ? cargo[level]?.pallet?.color : '#c7c7c7'
          ) as string;

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
