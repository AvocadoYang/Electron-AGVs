import { MessageInstance } from 'antd/es/message/interface';
import { ErrorResponse } from './globalType';

 
export const rosCoord2DisplayCoord = ({
  x,
  y,
  mapResolution,
  mapOriginX,
  mapOriginY,
  mapHeight
}: {
  x: number
  y: number
  mapResolution: number
  mapOriginX: number
  mapOriginY: number
  mapHeight: number
}) => [(x - mapOriginX) / mapResolution, mapHeight - (y - mapOriginY) / mapResolution];

export const rvizCoord = ({
  displayX,
  displayY,
  mapResolution,
  mapOriginX,
  mapOriginY,
  mapHeight,
  scaleSize
}: {
  displayX: number
  displayY: number
  mapResolution: number
  mapOriginX: number
  mapOriginY: number
  mapHeight: number
  scaleSize: number
}) => [
  (displayX / scaleSize) * mapResolution + mapOriginX,
  (mapHeight - displayY / scaleSize) * mapResolution + mapOriginY
];

export const rvizCoord2 = ({
  displayX,
  displayY,
  mapResolution,
  mapOriginX,
  mapOriginY,
  mapHeight,
  scaleSize
}: {
  displayX: number
  displayY: number
  mapResolution: number
  mapOriginX: number
  mapOriginY: number
  mapHeight: number
  scaleSize: number
}) => [
  displayX * scaleSize * mapResolution + mapOriginX,
  (mapHeight - displayY * scaleSize) * mapResolution + mapOriginY
];

export const sanitizeDeg = (deg: number) => ((deg % 360) + 360) % 360;

export const rad2Deg = (rad: number) => sanitizeDeg((rad / Math.PI) * 180);

export const deg2Rad = (deg: number) => (sanitizeDeg(deg) / 180) * Math.PI;

export const errorHandler = (e: ErrorResponse, messageApi: MessageInstance) => {
  console.log(e);

  const errorMessage = e?.response?.data?.message || 'An unknown error occurred';

  void messageApi.error(errorMessage);
};
