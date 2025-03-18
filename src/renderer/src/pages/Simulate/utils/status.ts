import { atom } from 'jotai';
import { InputForm, OutputForm } from '../type/common';
import { ZoneValue } from './type';
import { TransferProps } from 'antd';
import { ScriptRobotType } from '@renderer/api/useScriptRobot';

//**如果使用者在用地圖選取多個地點 */
export const isSelectCargo = atom<boolean>(false);

//**如果使用者點擊貨架後跳出來的model */
export const isOpenCargoModal = atom<boolean>(false);

//**modal的form因關閉後的需要著暫存資料 */
export const outputFormData = atom<OutputForm | null>(null);

//**modal的form因關閉後的需要著暫存資料 */
export const inputFormData = atom<InputForm | null>(null);

//**地圖化區域時的值 */
export const zoneValue = atom<ZoneValue>({ startX: 0, startY: 0, endX: 0, endY: 0 });

// 區域選到的地點
export const targetKeyJotai = atom<TransferProps['targetKeys']>([]);

//**點擊到的地點 */
export const selectedLocation = atom<string | null>(null);

export const globalRobots = atom<ScriptRobotType>([]);
