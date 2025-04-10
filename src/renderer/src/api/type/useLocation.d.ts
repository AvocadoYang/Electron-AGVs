export type ChargeStationResponseObj = {
  responseTime: Date;
  current: {
    AUTO_MODE: boolean;
    COMPLETE: boolean;
    FAULT: boolean;
    PROCESS: boolean;
    STANDBY: boolean;
  };
  error: {
    MODULE_COMMUNICATION_FAILURE: boolean;
    REVERSE_BATTERY_CONNECTION: boolean;
    BATTERY_NOT_CONNECTED: boolean;
    SHORT_CIRCUIT: boolean;
    OVER_VOLTAGE: boolean;
    OVER_CURRENT: boolean;
    TOTAL_FAULT: boolean;
  };
  other: {
    INFRARED_IN_PLACE: boolean;
    COMPRESS: boolean;
    SCALING_FAILURE: boolean;
    REACH_OUT_CHARGE: boolean;
    RETURNING: boolean;
    IS_STRETCHING_OUT: boolean;
    RESET: boolean;
  };
};

export type SelectStation = {
  loc: number;
  translateX: number;
  translateY: number;
  rotate: number;
  scale: number;
};

type GeneralStation = {
  stationId: string;
  isInService: string;
  actReq?: number;
  emptiedAt: Date | null;
  fulledAt: Date | null;
};

type ChargeStation = {
  id: string;
  isInService: string;
  booker: string;
  info: ChargeStationResponseObj;
};

export type LayerType = {
  [level: number]: {
    levelName: string;
    booked: boolean;
    cargo_limit: number;
    disable: boolean;
    cargo: {
      hasCargo: boolean;
      name: string | null;
    };
  };
};

export type Info = {
  areaId?: string;
  name?: string | null;
  isDropping?: boolean;
  layer?: LayerType[];
};

export type CargoArea = {
  id?: string;
  areaId?: string;
  booker?: string;
  occupier?: string;
  info?: Info;
};

type Data = {
  generalStations: GeneralStation[];
  cargoArea: CargoArea[];
  chargingStations: ChargeStation[];
};

export type LocSchemaType = {
  data: Data;
};
