import { Form, message } from 'antd';
import { FC, memo, useCallback, useState } from 'react';

import { WrapperType } from './types';
import styled from 'styled-components';
import { useCargoMutations } from './hook/useCargoMutations';
import CargoDisplay from './CargoDisplay';
import CargoModal from './CargoModal';
import { Info } from '@renderer/sockets/useCargoInfo';
import { useAtomValue, useSetAtom } from 'jotai';
import { EditRoadPanelSwitch, EditZoneSwitch } from '@renderer/utils/siderGloble';
import { LoadingStation } from './LoadingStation';
import { IsEditingQuickRoads, QuickRoadsArray } from '@renderer/pages/Setting/utils/settingJotai';

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
      editColumnMutation.mutate({ locationId: targetId, level: targetLevel });
    },
    [editColumnMutation]
  );

  if (!shelfInfo) return <LoadingStation />;
  return (
    <>
      {contextHolder}
      <WrapperDiv
        translatex={translateX}
        translatey={translateY}
        scale={scale}
        rotate={rotate}
        onClick={() => {
          handleCargo();
        }}
      >
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
      <CargoModal
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
