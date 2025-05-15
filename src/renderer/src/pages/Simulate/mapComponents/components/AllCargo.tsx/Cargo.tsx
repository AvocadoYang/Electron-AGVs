import { message } from 'antd';
import { FC, memo, useCallback } from 'react';

import { WrapperType } from './types';
import styled from 'styled-components';
import { useCargoMutations } from '../../../../../api/useCargoMutations';
import CargoDisplay from './CargoDisplay';
import { CargoInfo } from '@renderer/sockets/useCargoInfo';
import { LoadingStation } from './LoadingStation';
import {
  isOpenCargoModal,
  isSelectCargo,
  selectedLocation,
  targetKeyJotai
} from '@renderer/pages/Simulate/utils/status';
import { useAtomValue, useSetAtom } from 'jotai';
import { useTranslation } from 'react-i18next';
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
  flex_direction: string;
  shelfInfo: CargoInfo | undefined;
}> = ({ id, locId, translateX, translateY, rotate, scale, flex_direction, shelfInfo }) => {
  const [messageApi, contextHolder] = message.useMessage();
  const setTargetKey = useSetAtom(targetKeyJotai);
  const setIsOpening = useSetAtom(isOpenCargoModal);
  const isSelecting = useAtomValue(isSelectCargo);
  const setSelectLoc = useSetAtom(selectedLocation);
  const { t } = useTranslation();
  const { editColumnMutation } = useCargoMutations(messageApi);
  const handleMouseDown = useCallback(
    (event: React.MouseEvent<HTMLElement>, targetId: string, targetLevel: number) => {
      if (event.button !== 1) return;
      editColumnMutation.mutate({ locationId: targetId, level: targetLevel, id });
    },
    [editColumnMutation]
  );

  const handleClick = (locationId: string) => {
    if (!isSelecting) {
      setSelectLoc(locationId);
      setIsOpening(true);
      return;
    }
    // 這個是在要在哪些地點拉區域時在地圖上按 會觸發
    setTargetKey((prev) => {
      if (!prev) return [locationId];
      if (prev.includes(locationId)) {
        messageApi.warning(t('sim.cargo.already_exist'));
        return prev;
      }
      return [...prev, locationId];
    });
  };

  if (!shelfInfo || !shelfInfo.layer) return <LoadingStation />;
  return (
    <>
      {contextHolder}
      <WrapperDiv
        flex_direction={flex_direction}
        onClick={() => handleClick(locId)}
        translatex={translateX}
        translatey={translateY}
        scale={scale}
        rotate={rotate}
      >
        {' '}
        {Object.entries(shelfInfo.layer).map(([levelStr, info]) => {
          const level = Number(levelStr);
          const cargoValue = info.hasCargo || false;
          const isDisable = info.disable;

          return (
            <MemoizedCargo
              key={`${locId}-${level}`}
              level={level}
              levelName={prefixLevelName(info.levelName)}
              cargoValue={cargoValue}
              isDisable={isDisable}
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
