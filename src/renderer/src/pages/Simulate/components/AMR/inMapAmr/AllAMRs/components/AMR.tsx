import { FC, RefObject, useRef } from 'react';
import useMap from '@renderer/api/useMap';
import { amrId2Color, rosCoord2DisplayCoord, rvizCoord } from '@renderer/utils/utils';
import useScriptRobot from '@renderer/api/useScriptRobot';
import { Car, Fork, Wrapper } from './styled';
import { findClosestLocation } from '@renderer/pages/Simulate/utils/funcs';
import { Button, message, Popover } from 'antd';
import client from '@renderer/api/axiosClient';
import { EditFormType } from '../../../amr';
import { useMutation } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';

const AMR: FC<{
  id: string;
  amrId: string;
  scale: number;
  placement: string;
  mapRef: RefObject<HTMLDivElement>;
  mapWrapRef: RefObject<HTMLDivElement>;
  fullname: string;
}> = ({ id, amrId, mapRef, mapWrapRef, scale, placement, fullname }) => {
  const { data: map } = useMap();
  const { refetch } = useScriptRobot();
  const ref = useRef<HTMLDivElement | null>(null);
  const [messageApi, contextHolder] = message.useMessage();
  const { t } = useTranslation();
  if (!map) return null;

  const detail = map.locations.find((v) => v.locationId === placement);

  const [left, top] = rosCoord2DisplayCoord({
    x: detail?.x as number,
    y: detail?.y as number,
    mapResolution: map.mapResolution,
    mapOriginX: map.mapOriginX,
    mapOriginY: map.mapOriginY,
    mapHeight: map.mapHeight
  });

  const isRegisterMutation = useMutation({
    mutationFn: async (locationId: string) => {
      const response = await client.post('api/simulate/is-place-has-robot', { locationId });
      return response.data as { locationId: string; isRegister: boolean };
    },
    onSuccess: (result) => {
      if (result.isRegister) {
        messageApi.warning(t('sim.robot.no_overlapping'));
        return;
      }
      handlePlacement(result.locationId);
    },
    onError: () => {
      void messageApi.error(t('utils.error'));
    }
  });

  const editMutation = useMutation({
    mutationFn: (payload: EditFormType) => {
      return client.post('api/simulate/edit-robot', { ...payload, id });
    },
    onSuccess: async () => {
      refetch();
      void messageApi.success(t('utils.success'));
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
    },
    onError: () => {
      void messageApi.error(t('utils.error'));
    }
  });

  const deleteHandler = () => {
    deleteMutation.mutate();
  };

  const handleEditMutation = (payload: EditFormType) => {
    editMutation.mutate(payload);
  };

  const handlePlacement = (locationId: string | null) => {
    handleEditMutation({
      full_name: fullname as string,
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

    if (!closestLocationId) {
      messageApi.warning('edit location first');
      return;
    }

    isRegisterMutation.mutate(closestLocationId);
  };

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
        <Wrapper draggable onDragEnd={handleDragEnd} ref={ref} yaw={90} left={left} top={top}>
          <Car color={amrId2Color(amrId as string)}></Car>
          <Fork direct="right" />
          <Fork direct="left" />
        </Wrapper>
      </Popover>
    </>
  );
};
export default AMR;
