import socketIO from 'socket.io-client';
import { MISSION_CONTROL_WS_URL } from '@renderer/configs/config';

export const io = socketIO(
  `${MISSION_CONTROL_WS_URL.replace('localhost', location.host).replace('3001', '4000')}/dashboard`
);
