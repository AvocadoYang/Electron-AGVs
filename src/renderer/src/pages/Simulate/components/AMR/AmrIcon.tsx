import { FC, memo, RefObject, useRef, useState } from 'react';
import styled from 'styled-components';
import { Button, message, Popover, Spin } from 'antd';
import useMap from '@renderer/api/useMap';
import { useTranslation } from 'react-i18next';
import { useMutation } from '@tanstack/react-query';
import client from '@renderer/api/axiosClient';
import useScriptRobot from '@renderer/api/useScriptRobot';
import { rvizCoord } from '@renderer/utils/utils';
import { EditFormType } from './amr';
import AmrForm from './AmrForm';
import { findClosestLocation } from '../../utils/funcs';

const AMR_FORK_WIDTH = 1.4; // meter
const AMR_FORK_HEIGHT = 2; // meter
const AGV_WIDTH = 1.2; // meter
const AGV_HEIGHT = 1; // meter

const ColorAmr = styled.div.attrs<{
  left: number;
  top: number;
  width: number;
  height: number;
  color: string;
  $is_agv: boolean;
  placement: string;
}>(({ left, top, placement }) => ({
  style: {
    transform:
      placement === 'unset' ? 'unset' : `translate(${left - 8}px, ${top - 9}px) rotate(${0}deg)`
  }
}))<{
  left: number;
  top: number;
}>`
  width: 1.2em;
  min-height: 1.5em;
  display: flex;
  border: ${(prop) => (prop.$is_agv ? '1px solid gray' : 'none')};
  justify-content: ${(prop) => (prop.$is_agv ? 'space-evenly' : 'space-around')};
  position: ${(prop) => (prop.placement === 'unset' ? 'relative' : 'absolute')};
  background-color: ${(prop) => prop.color};
  transform-origin: x y;
  border-radius: 2px;
`;

const Fork = styled.div<{
  direct: string;
}>`
  height: 55%;
  width: 15%;
  background-color: #424141;
  border-radius: 0px 0px 1px 1px;

  position: absolute;
  left: ${(prop) => (prop.direct === 'left' ? '20%' : '65%')};
  bottom: -53%;
`;

const AmrIcon: FC<{
  id: string;
  amrId: string;
  color: string;
  scale: number;
  mapRef: RefObject<HTMLDivElement>;
  mapWrapRef: RefObject<HTMLDivElement>;
  placement: string;
}> = ({ amrId, color, id, mapRef, mapWrapRef, scale, placement }) => {
  const { data: map } = useMap();
  const [isOpen, setIsOpen] = useState(false);
  const { t } = useTranslation();
  const [messageApi, contextHolder] = message.useMessage();
  const { data: robot, refetch } = useScriptRobot();
  const ref = useRef<HTMLDivElement | null>(null);

  const handleSetRobot = () => {
    setIsOpen(true);
  };

  const editMutation = useMutation({
    mutationFn: (payload: EditFormType) => {
      return client.post('api/simulate/edit-robot', { ...payload, id });
    },
    onSuccess: async () => {
      refetch();
      void messageApi.success(t('utils.success'));
      setIsOpen(false);
    },
    onError: () => {
      void messageApi.error(t('utils.error'));
    }
  });

  const deleteMutation = useMutation({
    mutationFn: () => {
      return client.post('api/simulate/delete-robot', { id });
    },
    onSuccess: async () => {
      refetch();
      void messageApi.success(t('utils.success'));
      setIsOpen(false);
    },
    onError: () => {
      void messageApi.error(t('utils.error'));
    }
  });

  const handleEditMutation = (payload: EditFormType) => {
    editMutation.mutate(payload);
  };

  const deleteHandler = () => {
    deleteMutation.mutate();
  };

  const handlePlacement = (locationId: string | null) => {
    const info = robot?.find((v) => v?.id === id);

    handleEditMutation({
      full_name: info?.full_name as string,
      script_placement_location: locationId === null ? 'unset' : locationId
    });
  };

  const handleDragEnd = (event: React.DragEvent<HTMLDivElement>) => {
    if (!map || !mapRef.current || !mapWrapRef.current) return;

    const { clientX, clientY } = event;
    const mapRect = mapRef.current.getBoundingClientRect();

    const adjustX = clientX - mapRect.left;
    const adjustY = clientY - mapRect.top;

    const [rx, ry] = rvizCoord({
      displayX: adjustX / scale,
      displayY: adjustY / scale,
      mapResolution: map.mapResolution,
      mapOriginX: map.mapOriginX,
      mapOriginY: map.mapOriginY,
      mapHeight: map.mapHeight,
      scaleSize: scale
    });

    const closestLocationId = findClosestLocation(rx, ry, map);

    handlePlacement(closestLocationId);
  };

  if (!map) return <Spin />;
  return (
    <>
      {contextHolder}
      <Popover
        content={
          <Button
            onClick={deleteHandler}
            loading={deleteMutation.isLoading}
            color="danger"
            variant="filled"
          >
            {t('utils.delete')}
          </Button>
        }
        title={amrId}
        placement="right"
      >
        <ColorAmr
          placement={placement}
          left={510}
          top={150}
          onClick={handleSetRobot}
          draggable
          onDragEnd={handleDragEnd}
          ref={ref}
          width={
            amrId.includes('SW15')
              ? AGV_WIDTH / map.mapResolution
              : AMR_FORK_WIDTH / map.mapResolution
          }
          height={
            amrId.includes('SW15')
              ? AGV_HEIGHT / map.mapResolution
              : AMR_FORK_HEIGHT / map.mapResolution
          }
          color={color}
          $is_agv={amrId.includes('SW15')}
        >
          {amrId.includes('anfa') ? <Fork direct="left"></Fork> : null}
          {amrId.includes('anfa') ? <Fork direct="right"></Fork> : null}
        </ColorAmr>
      </Popover>
      <AmrForm
        id={id}
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        handleEditMutation={handleEditMutation}
      />
    </>
  );
};

export default memo(AmrIcon, (prev, next) => prev.color == next.color && prev.amrId == next.amrId);
