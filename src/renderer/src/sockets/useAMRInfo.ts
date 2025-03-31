import { hsl } from 'color-convert';
import { MD5 } from 'crypto-js';
import { useState, useEffect } from 'react';
import {
  distinctUntilChanged,
  filter,
  from,
  fromEventPattern,
  map,
  MonoTypeOperatorFunction,
  pluck,
  scan,
  share,
  switchMap,
  tap,
  withLatestFrom
} from 'rxjs';
import { io } from './socketConnect';
import { isDefined } from 'ts-extras';
import { array, boolean, mixed, number, object, string, ValidationError } from 'yup';
import { translate } from '@renderer/i18n';

export interface InZoneItem {
  key?: string;
  value?: boolean;
}

const initialValue = {
  amrId: '',
  pose: {},

  connect_status: false,
  Query: '',
  Set: '',
  MultiSet: '',
  error_code: '',
  error_info: '',
  enable_ultrasoumd: false,
  ultrasound: '',
  enable_baffle: false,
  baffle_left: false,
  baffle_right: false,
  manual_mode: false,
  enforce_charge: false,
  set_charge: false,
  battery: 0,
  charge_relay_status: false,
  voltage: 0,
  current: 0,

  front_2d_layer: 0,
  enable_2d_lidar: false,
  obstacle_2d_signal: false,
  obstacle_rear_2d_signal: false,
  obstacle_3d_signal: false,
  enable_recovery: false,
  enable_reboot: false,
  enable_tip: false,
  tip_left: false,
  tip_right: false,

  set_tip: 0,

  set_height: 0,
  current_height: 0,
  linear_x: 0,
  angular_z: 0,
  odom_x: 0,

  odom_y: 0,

  odom_w: 0,
  emergency_signal: '',
  emergency_stop: false,
  bumper: false,
  activated: false,
  is_running: false,
  warning_msg: '',
  warning_id: 0,
  warning: 0,
  task_process: 0,
  pallet_conflict: '',
  reset_cargo: 0,
  grid_info: '',
  charging: false,
  is_arrive: false,
  is_locations: [],
  checked_locations: [],
  is_taking_goods: false,
  is_dropping_goods: false,
  is_drop_goods: false,
  is_take_goods: false,
  is_finished_mission: false,
  leftArea: 0,
  midArea: 0,
  isAllowInput: 0,
  isAllowOutput: 0,
  isCompleteInput: 0,
  isCompleteOutput: 0,
  isAllowCharge: 0,
  isStopCharge: 0,
  region: {},
  executeInput: 0,
  executeOutput: 0,
  executeCharge: 0,
  executeStopCharge: 0,
  send_mission: [],
  check_mission: [],
  start_mission: false,
  cancel_mission: false,
  charge_mission: false,
  pause: false,
  canTakeGoods: false,
  canDropGoods: false,
  arriveInit: false,
  hasPallet: false,
  carrierId: '',
  error: '',
  rosStatus: '',
  machineStatus: '',
  smStatus: '',
  hasCargo: false,
  maintenanceLevel: ''
};

type FleetInfoData = {
  amrId: string;
  pose?: { x?: number; y?: number; yaw?: number };
  IO?: {
    connect_status?: boolean;
    Query?: string;
    Set?: string;
    MultiSet?: string;
    error_code?: string;
    error_info?: string;
    enable_ultrasoumd?: boolean;
    ultrasound?: string;
    enable_baffle?: boolean;

    baffle_left?: boolean | number;
    baffle_right?: boolean | number;
    manual_mode?: boolean;
    enforce_charge?: boolean;
    set_charge?: boolean;
    battery?: number;
    charge_relay_status?: boolean;

    voltage?: number;
    current?: number;

    front_2d_layer?: number;
    enable_2d_lidar?: boolean;
    obstacle_2d_signal?: boolean;
    obstacle_rear_2d_signal?: boolean;
    obstacle_3d_signal?: boolean;
    enable_recovery?: boolean;
    enable_reboot?: boolean;
    enable_tip?: boolean;
    set_tip?: number;
    tip_left?: boolean;
    tip_right?: boolean;
    set_height?: number;
    current_height?: number;
    linear_x?: number;
    angular_z?: number;
    odom_x?: number;
    odom_y?: number;
    odom_w?: number;
    emergency_signal?: string;
    emergency_stop?: boolean;
    bumper?: boolean;
  };

  read_status?: {
    read?: {
      is_arrive?: boolean;
      is_locations?: (number | undefined)[];
      checked_locations?: (number | undefined)[];
      is_taking_goods?: boolean;
      is_take_goods?: boolean;
      is_dropping_goods?: boolean;
      is_drop_goods?: boolean;
      with_goods?: boolean;
      is_finished_mission?: boolean;
    };
    info?: {
      activated?: boolean;
      is_running?: boolean;
      warning_msg?: string;
      warning_id?: number;
      warning?: number;
      task_process?: number;
      action_process?: string;
      pallet_conflict?: string;
      grid_info?: string;
      charging?: boolean;
      heartbeat?: number;
      error?: string;
    };
  };

  write_status?: {
    write?: {
      send_mission?: (number | undefined)[];
      check_mission?: (number | undefined)[];
      start_mission?: boolean;
      cancel_mission?: boolean;
      pause?: boolean;
      canTakeGoods?: boolean;
      canDropGoods?: boolean;
      heartbeat?: number;
      charge_mission?: boolean;
    };

    region?: {
      regionType?: string;
      max_height?: number;
      min_height?: number;
      max_speed?: number;
    };
    action?: {
      operation?: {
        type?: string;
        control?: (string | undefined)[];
        wait?: number;
        is_define_id?: string;
        id?: number;
        is_define_yaw?: number;
        yaw?: number;
        tolerance?: number;
        lookahead?: number;
        roughly_pass?: boolean;
        from?: number;
        to?: number;
        max_speed?: number;
        hasCargoToProcess?: boolean;
      };
      io?: {
        fork?: {
          is_define_height?: string;
          execute?: boolean;
          height?: number;
          move?: number;
          shift?: number;
          tilt?: number;
        };
        camera?: {
          execute?: boolean;
          config?: number;
          modify_dis?: number;
        };
      };
    };
  };

  plc_read?: {
    // camera
    leftArea?: number;
    midArea?: number;

    isAllowInput?: number;
    isAllowOutput?: number;
    isCompleteInput?: number;
    isCompleteOutput?: number;
    isAllowCharge?: number;
    isStopCharge?: number;
  };
  plc_write?: {
    executeInput?: number;
    executeOutput?: number;
    executeCharge?: number;
    executeStopCharge?: number;
  };
  manual_charge?: boolean;
  hasPallet?: boolean;
  carrierId?: string;
  error?: string;
  rosError?: string;
  rosStatus?: string;
  arriveInit?: boolean;
  machineStatus?: string;
  smStatus?: string;
  hasCargo?: boolean;
  maintenanceLevel?: string | undefined;
};

const schema = () =>
  array(
    object({
      amrId: string().required(),
      pose: object({
        x: number().optional(),
        y: number().optional(),
        yaw: number().optional(),
        closeLoc: string()
      }).optional(),
      IO: object({
        connect_status: boolean().optional(),

        Query: string().optional(),
        Set: string().optional(),
        MultiSet: string().optional(),
        error_code: string().optional(),
        error_info: string().optional(),
        enable_ultrasoumd: boolean().optional(),
        ultrasound: string().optional(),
        enable_baffle: boolean().optional(),

        baffle_left: mixed().optional(),
        baffle_right: mixed().optional(),
        manual_mode: boolean().optional(),
        enforce_charge: boolean().optional(),
        set_charge: boolean().optional(),
        battery: number().optional(),
        charging: boolean().optional(),
        charge_relay_status: boolean().optional(),

        voltage: number().optional(),
        current: number().optional(),

        front_2d_layer: number().optional(),
        enable_2d_lidar: boolean().optional(),
        obstacle_2d_signal: boolean().optional(),
        obstacle_rear_2d_signal: boolean().optional(),
        obstacle_3d_signal: boolean().optional(),
        enable_recovery: boolean().optional(),
        enable_reboot: boolean().optional(),
        enable_tip: boolean().optional(),

        set_tip: number().optional(),

        tip_left: boolean().optional(),
        tip_right: boolean().optional(),
        set_height: number().optional(),
        current_height: number().optional(),
        linear_x: number().optional(),
        angular_z: number().optional(),
        odom_x: number().optional(),

        odom_y: number().optional(),

        odom_w: number().optional(),
        emergency_signal: string().optional(),
        emergency_stop: boolean().optional(),
        bumper: boolean().optional()
      }).optional(),

      read_status: object({
        read: object({
          is_arrive: boolean().optional(),
          is_locations: array(number().optional()),
          checked_locations: array(number().optional()),
          is_taking_goods: boolean().optional(),
          is_dropping_goods: boolean().optional(),
          is_drop_goods: boolean().optional(),
          is_take_goods: boolean().optional(),
          with_goods: boolean().optional(),
          is_finished_mission: boolean().optional()
        }).optional(),
        info: object({
          activated: boolean().optional(),
          is_running: boolean().optional(),
          warning_msg: string().optional(),
          warning_id: number().optional(),
          warning: number().optional(),
          task_process: number().optional(),
          action_process: string().optional(),
          pallet_conflict: string().optional(),
          reset_cargo: number().optional(),
          grid_info: string().optional(),
          charging: boolean().optional(),
          heartbeat: number().optional(),
          error: string().optional()
        }).optional()
      }).optional(),

      write_status: object({
        write: object({
          send_mission: array(number().optional()),
          check_mission: array(number().optional()),
          start_mission: boolean().optional(),
          cancel_mission: boolean().optional(),
          pause: boolean().optional(),
          canTakeGoods: boolean().optional(),
          canDropGoods: boolean().optional(),
          heartbeat: number().optional(),
          charge_mission: boolean().optional()
        }).optional(),
        region: object({
          regionType: string().optional(),
          max_height: number().optional(),
          min_height: number().optional(),
          max_speed: number().optional()
        }).optional(),

        action: object({
          operation: object({
            type: string().optional(),
            control: array(string().optional()).optional(),
            wait: number().optional(),
            is_define_id: string().optional(),
            id: number().optional(),
            is_define_yaw: number().optional(),
            yaw: number().optional(),
            tolerance: number().optional(),
            lookahead: number().optional(),
            roughly_pass: boolean().optional(),
            from: number().optional(),
            to: number().optional(),
            max_speed: number().optional(),
            hasCargoToProcess: boolean().optional(),
            waitOtherAmr: string().optional().nullable(),
            waitGenre: string().optional().nullable(),
            auto_preparatory_point: boolean().optional()
          }).optional(),
          io: object({
            fork: object({
              is_define_height: string().optional(),
              execute: boolean().optional(),
              height: number().optional(),
              move: number().optional(),
              shift: number().optional(),

              tilt: number().optional()
            }).optional(),
            camera: object({
              execute: boolean().optional(),
              config: number().optional(),
              modify_dis: number().optional()
            }).optional()
          }).optional()
        }).optional()
      }).optional(),

      plc_read: object({
        leftArea: number().optional(),
        midArea: number().optional(),
        isAllowInput: number().optional(),
        isAllowOutput: number().optional(),
        isCompleteInput: number().optional(),
        isCompleteOutput: number().optional(),
        isAllowCharge: number().optional(),
        isStopCharge: number().optional()
      }).optional(),

      plc_write: object({
        executeInput: number().optional(),
        executeOutput: number().optional(),
        executeCharge: number().optional(),
        executeStopCharge: number().optional()
      }).optional(),
      // hasPallet: boolean().optional(),
      // carrierId: string().optional(),
      manual_charge: boolean().optional(),
      error: string().optional(),
      rosError: string().optional(),
      doingTask: boolean().optional(),
      rosStatus: string().optional(),
      machineStatus: string().optional(),
      arriveInit: boolean().required(),
      smStatus: string().optional(),
      hasCargo: boolean().optional(),
      maintenanceLevel: string().optional()
    }).required()
  ).required();

const profiles$ = fromEventPattern(
  (next) => {
    io.on('amr-profile', next);
    return next;
  },
  (next) => {
    io.off('amr-profile', next);
  }
).pipe(
  switchMap((msg) =>
    from(
      schema()
        .validate(
          // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
          msg as unknown[],
          { stripUnknown: true }
        )
        .catch((err: ValidationError) => {
          console.error(err.message);
          console.error('amr-profile socket schema mismatch: ', err.value);
          return undefined;
        })
    )
  ),
  filter(isDefined),
  share()
);

export type Pose = { x: number; y: number; yaw: number };

const sanitizeDegree = (deg: number) => {
  let sanitized = ((deg % 360) + 360) % 360;
  if (sanitized > 180) {
    sanitized -= 360;
  }
  return sanitized;
};

const regularYaw = (): MonoTypeOperatorFunction<Pose> => (source$) => {
  const $coord = source$.pipe(map(({ x, y }) => ({ x, y })));

  const $yaw = source$.pipe(
    pluck('yaw'),
    distinctUntilChanged(),
    scan((acc, cur) => {
      let diff = (((cur - acc) % 360) + 360) % 360;
      diff = diff > 180 ? diff - 360 : diff;
      diff = diff < -180 ? diff + 360 : diff;
      return acc + diff;
    })
  );
  return $coord.pipe(
    withLatestFrom($yaw),
    map(([{ x, y }, yaw]) => ({ x, y, yaw }))
  );
};

const amrId2Color = (amrId: string) => {
  const seed = parseInt(`0x${MD5(amrId).toString()}`, 16);
  const h = seed % 360;
  const s = (seed % 70) + 80;
  const l = (seed % 60) + 10;
  const color = `#${hsl.hex([h, s, l])}`;
  return color;
};

export const useAMR = (amrId: string) => {
  const [pose, setPose] = useState<Pose>();
  const [originPose, setOriginPose] = useState<Pose>();
  const [data, setData] = useState<FleetInfoData>(initialValue);
  // const [palletErrorCount, setPalletErrorCount] = useState(0);
  useEffect(() => {
    const profile$ = profiles$.pipe(
      map((p) => p.find((x) => x.amrId === amrId)),
      filter(isDefined),
      share()
    );

    const sub1 = profile$
      .pipe(
        pluck('pose'),
        filter(isDefined),
        filter((msg) => {
          return msg.x !== undefined;
        }),
        map(({ x, y, yaw }) => ({
          x: Number((x || 0).toFixed(2)),
          y: Number((y || 0).toFixed(2)),
          yaw: Number((yaw || 0).toFixed(2))
        })),
        regularYaw(),
        // tap(({ yaw }) => console.log(yaw)),
        distinctUntilChanged(
          (prev, cur) => prev.x === cur.x && prev.y === cur.y && prev.yaw === cur.yaw
        )
        // throttleTime(1000),
      )
      .subscribe(({ x, y, yaw }) => {
        setPose({ x, y, yaw });
      });

    const sub2 = profile$.subscribe((fleetInfo) => {
      setData({
        ...(fleetInfo as FleetInfoData)
      });
    });

    const sub3 = profile$
      .pipe(
        pluck('pose'),
        filter(isDefined),
        filter((msg) => {
          return msg.x !== undefined;
        }),
        map(({ x, y, yaw }) => ({
          x: Number((x || 0).toFixed(5)),
          y: Number((y || 0).toFixed(5)),
          yaw: Number((yaw || 0).toFixed(5))
        }))
      )
      .subscribe(({ x, y, yaw }) => {
        setOriginPose({ x, y, yaw: sanitizeDegree(yaw) });
      });

    return () => {
      sub1.unsubscribe();
      sub2.unsubscribe();
      sub3.unsubscribe();
    };
  }, [amrId]);

  return {
    pose,
    originPose,
    data,
    color: amrId2Color(amrId)
  };
};

export const useAmrPose = (amrId: string) => {
  const [pose, setPose] = useState<Pose>();
  useEffect(() => {
    const profile$ = profiles$.pipe(
      map((p) => p.find((x) => x.amrId === amrId)),
      filter(isDefined),
      share()
    );

    const amrPose$ = profile$
      .pipe(
        pluck('pose'),
        filter(isDefined),
        filter((msg) => {
          return msg.x !== undefined;
        }),
        map(({ x, y, yaw }) => ({
          x: Number((x || 0).toFixed(2)),
          y: Number((y || 0).toFixed(2)),
          yaw: Number((yaw || 0).toFixed(2))
        })),
        regularYaw(),
        // tap(({ yaw }) => console.log(yaw)),
        distinctUntilChanged(
          (prev, cur) => prev.x === cur.x && prev.y === cur.y && prev.yaw === cur.yaw
        )
        // throttleTime(1000),
      )
      .subscribe(({ x, y, yaw }) => {
        setPose({ x, y, yaw });
      });

    return () => {
      amrPose$.unsubscribe();
    };
  }, [amrId]);
  return {
    pose
  };
};

export const useIsLogIn = (amrId: string) => {
  const [isOnline, setIsOnline] = useState(false);
  useEffect(() => {
    const profile$ = profiles$.pipe(
      map((p) => p.find((x) => x.amrId === amrId)),
      filter(isDefined),
      share()
    );
    const logIn$ = profile$
      .pipe(
        map((info) => info.arriveInit),
        distinctUntilChanged()
      )
      .subscribe((isOnline) => setIsOnline(isOnline));

    return () => {
      logIn$.unsubscribe();
    };
  }, [amrId]);

  return { isOnline };
};

export const useCloseLoc = (amrId: string) => {
  const [closeLoc, setCloseLoc] = useState<string | undefined>('-');
  useEffect(() => {
    const profile$ = profiles$.pipe(
      map((p) => p.find((x) => x.amrId === amrId)),
      filter(isDefined),
      share()
    );
    const closeLoc$ = profile$
      .pipe(
        map((info) => info.pose?.closeLoc),
        distinctUntilChanged()
      )
      .subscribe((closeLoc) =>
        setCloseLoc((pre) => {
          if (!closeLoc) return pre;
          return closeLoc;
        })
      );

    return () => {
      closeLoc$.unsubscribe();
    };
  }, [amrId]);

  return { closeLoc };
};

export const useBattery = (amrId: string) => {
  const [battery, setBattery] = useState<number | undefined>(0);
  useEffect(() => {
    const profile$ = profiles$.pipe(
      map((p) => p.find((x) => x.amrId === amrId)),
      filter(isDefined),
      share()
    );
    const battery$ = profile$
      .pipe(
        map((info) => info.IO?.battery),
        distinctUntilChanged()
      )
      .subscribe((battery) => setBattery(battery));

    return () => {
      battery$.unsubscribe();
    };
  }, [amrId]);

  return { battery };
};

export const useYaw = (amrId: string) => {
  const [yaw, setYaw] = useState<number | undefined>(0);
  useEffect(() => {
    const profile$ = profiles$.pipe(
      map((p) => p.find((x) => x.amrId === amrId)),
      filter(isDefined),
      share()
    );
    const yaw$ = profile$
      .pipe(
        map((info) => info.pose?.yaw),
        distinctUntilChanged((pre, cur) => {
          if (pre == undefined || cur == undefined) return true;
          return cur - pre < 0.03;
        })
      )
      .subscribe((yaw) => setYaw(yaw));

    return () => {
      yaw$.unsubscribe();
    };
  }, [amrId]);

  return { yaw };
};

export const useXY = (amrId: string) => {
  const [loc, setLoc] = useState<{ x: number; y: number } | undefined>();
  useEffect(() => {
    const profile$ = profiles$.pipe(
      map((p) => p.find((x) => x.amrId === amrId)),
      filter(isDefined),
      share()
    );
    const XY$ = profile$
      .pipe(
        map((info) => ({ x: info.pose?.x, y: info.pose?.y })),
        distinctUntilChanged((pre, cur) => {
          if (
            pre.x == undefined ||
            pre.y == undefined ||
            cur.x == undefined ||
            cur.y == undefined
          ) {
            return true;
          }
          return cur.x - pre.x < 0.01 && cur.y - pre.y < 0.01;
        })
      )
      .subscribe((loc) => setLoc(loc as { x: number; y: number } | undefined));

    return () => {
      XY$.unsubscribe();
    };
  }, [amrId]);

  return { loc };
};

export const useAmrStatus = (amrId: string) => {
  const [status, setStatus] = useState<string | undefined>('');
  useEffect(() => {
    const profile$ = profiles$.pipe(
      map((p) => p.find((x) => x.amrId === amrId)),
      filter(isDefined),
      share()
    );
    const battery$ = profile$
      .pipe(
        map((info) => {
          const { error, machineStatus, rosStatus } = info;
          const errorText = error ? `🤨 ${translate('normal', String(error))}` : '';
          const machineText = machineStatus ? `${translate('normal', String(machineStatus))}` : '';
          const statusText = rosStatus ? `${translate('normal', String(rosStatus))}` : '';
          const tipText = errorText || machineText || statusText;
          return tipText;
        }),
        distinctUntilChanged()
      )
      .subscribe((info) => {
        setStatus(info);
      });

    return () => {
      battery$.unsubscribe();
    };
  }, [amrId]);

  return { status };
};

export const useIsWorking = (amrId: string) => {
  const [isWorking, setIsWorking] = useState<boolean | undefined>(false);
  useEffect(() => {
    const profile$ = profiles$.pipe(
      map((p) => p.find((x) => x.amrId === amrId)),
      filter(isDefined),
      share()
    );
    const isWorking$ = profile$
      .pipe(
        map((info) => info.doingTask),
        distinctUntilChanged()
      )
      .subscribe((isWorking) => setIsWorking(isWorking));

    return () => {
      isWorking$.unsubscribe();
    };
  }, [amrId]);

  return { isWorking };
};

export const useIsManual = (amrId: string) => {
  const [isManual, setIsManual] = useState<boolean | undefined>(false);
  useEffect(() => {
    const profile$ = profiles$.pipe(
      map((p) => p.find((x) => x.amrId === amrId)),
      filter(isDefined),
      share()
    );
    const manual$ = profile$
      .pipe(
        map((info) => info.IO?.manual_mode),
        distinctUntilChanged()
      )
      .subscribe((isWorking) => setIsManual(isWorking));

    return () => {
      manual$.unsubscribe();
    };
  }, [amrId]);

  return { isManual };
};

export const useIsCarry = (amrId: string) => {
  const [isCarry, setIsCarry] = useState<boolean | undefined>(false);
  useEffect(() => {
    const profile$ = profiles$.pipe(
      map((p) => p.find((x) => x.amrId === amrId)),
      filter(isDefined),
      share()
    );
    const isCarry$ = profile$
      .pipe(
        map((info) => info.hasCargo),
        distinctUntilChanged()
      )
      .subscribe((isWorking) => setIsCarry(isWorking));

    return () => {
      isCarry$.unsubscribe();
    };
  }, [amrId]);

  return { isCarry };
};

export const useIsCharging = (amrId: string) => {
  const [isCharge, setIsCharge] = useState<boolean | undefined>(false);
  useEffect(() => {
    const profile$ = profiles$.pipe(
      map((p) => p.find((x) => x.amrId === amrId)),
      filter(isDefined),
      share()
    );
    const isCarry$ = profile$
      .pipe(
        map((info) => info.IO?.charging),
        distinctUntilChanged()
      )
      .subscribe((isWorking) => setIsCharge(isWorking));

    return () => {
      isCarry$.unsubscribe();
    };
  }, [amrId]);

  return { isCharge };
};
