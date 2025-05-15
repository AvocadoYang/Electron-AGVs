import { Form, message } from 'antd';
import { FC, memo, useCallback, useState } from 'react';

import { WrapperType } from './types';
import styled from 'styled-components';
import { useCargoMutations } from './hook/useCargoMutations';
import CargoDisplay from './CargoDisplay';
import CargoModal from './CargoModal';
import { CargoInfo } from '@renderer/sockets/useCargoInfo';
import { useAtomValue, useSetAtom } from 'jotai';
import { EditRoadPanelSwitch, EditZoneSwitch } from '@renderer/utils/siderGloble';
import { LoadingStation } from './LoadingStation';
import { IsEditingQuickRoads, QuickRoadsArray } from '@renderer/pages/Setting/utils/settingJotai';
import { prefixLevelName } from '@renderer/utils/globalFunction';

const Wrapper = styled.div<WrapperType>`
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: ${({ flex_direction }) => flex_direction};
  width: max-content;
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
}> = ({ id, locId, translateX, translateY, rotate, scale, shelfInfo, flex_direction }) => {
  const [settingForm] = Form.useForm();
  const [layerForm] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const openEditZone = useAtomValue(EditZoneSwitch);
  const openEditRoadPanel = useAtomValue(EditRoadPanelSwitch);
  const [isEditLayer, setIsEditLayer] = useState(false);
  const { editColumnMutation } = useCargoMutations(messageApi);

  const quickRoad = useAtomValue(IsEditingQuickRoads);
  const setQuickRoadArr = useSetAtom(QuickRoadsArray);

  const handleQuickRoad = (locationId: string) => {
    if (!quickRoad) return;

    setQuickRoadArr((prev) => [...prev, locationId]);
  };

  const handleCargo = () => {
    if (quickRoad) {
      handleQuickRoad(locId);
      return;
    }

    if (openEditRoadPanel || openEditZone) return;
    setIsEditModalOpen(true);
  };

  const handleMouseDown = useCallback(
    (event: React.MouseEvent<HTMLDivElement>, targetId: string, targetLevel: number) => {
      if (event.button !== 1) return;
      editColumnMutation.mutate({ id, locationId: targetId, level: targetLevel });
    },
    [editColumnMutation]
  );

  if (!shelfInfo || !shelfInfo.layer) return <LoadingStation />;
  return (
    <>
      {contextHolder}
      <WrapperDiv
        flex_direction={flex_direction}
        translatex={translateX}
        translatey={translateY}
        scale={scale}
        rotate={rotate}
        onClick={() => {
          handleCargo();
        }}
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
              handleMouseDown={(e) =>
                handleMouseDown(e as React.MouseEvent<HTMLDivElement>, locId, level)
              }
            />
          );
        })}
      </WrapperDiv>
      <CargoModal
        id={id}
        locId={locId}
        settingForm={settingForm}
        layerForm={layerForm}
        shelfInfo={shelfInfo}
        isEditLayer={isEditLayer}
        isEditModalOpen={isEditModalOpen}
        setIsEditModalOpen={setIsEditModalOpen}
        setIsEditLayer={setIsEditLayer}
      />
    </>
  );
};

export default memo(Cargo, (prev, next) => {
  return prev.locId !== next.locId;
});
