import { useEffect, useState } from 'react';
import {
  filter,
  from,
  fromEventPattern,
  map,
  pluck,
  share,
  distinctUntilChanged,
  switchMap
} from 'rxjs';
import { isDefined, objectKeys } from 'ts-extras';
import { array, boolean, date, mixed, number, object, string, ValidationError } from 'yup';
import { InferObservableType } from '@renderer/utils/globalType';
import { io } from './socketConnect';

const missionTypeMap = {
  'sprinkle': 'sprinkle',
  'shipment': 'shipment',
  'custom': 'custom',
  'remove-pallet': 'remove-pallet',
  'plain-move': 'plain-move',
  'deliver-pallet': 'deliver-pallet'
} as const;

const missionStatusMap = {
  PENDING: 'pending',
  ASSIGNED: 'assigned',
  EXECUTING: 'executing',
  ABORTING: 'aborting',
  CANCELED: 'canceled',
  COMPLETED: 'completed'
} as const;

const schema = () =>
  object({
    missions: array(
      object({
        amrId: string().optional(),
        missionId: string().required(),
        // relateId: string().required(),
        cargoName: string().optional().nullable(),
        fullName: string(),
        missionType: mixed<keyof typeof missionTypeMap>()
          .oneOf(objectKeys(missionTypeMap))
          .required(),
        missionStatus: mixed<keyof typeof missionStatusMap>()
          .oneOf(objectKeys(missionStatusMap))
          .required(),
        manualMode: boolean().required(),
        emergencyBtn: boolean().required(),
        recoveryBtn: boolean().optional(),
        warningIdList: array(number().optional()).optional(),
        createdAt: date().required(),
        assignedAt: date().optional(),
        startedAt: date().optional(),
        forkStartAt: date().optional(),
        forkEndAt: date().optional(),
        completedAt: date().optional(),
        isCharge: boolean().required(),
        startShelfColumn: string().optional().nullable(),
        endShelfColumn: string().optional().nullable(),
        message: string().optional(),
        order: number().required(),
        priority: number().required()
      }).required()
    ).required()
  }).required();

const missionReports$ = fromEventPattern(
  (next) => {
    io.on('mission', next);
    return next;
  },
  (next) => {
    io.off('mission', next);
  }
).pipe(
  switchMap((msg) =>
    from(
      schema()
        .validate(msg, { stripUnknown: true })
        .catch((err: ValidationError) => {
          console.error(err.message);
          console.error('mission socket schema mismatch: ', err.value);
          return undefined;
        })
    )
  ),
  filter(isDefined),
  map((e) => {
    const missions = e.missions.map((m) => ({
      ...m,
      key: m.missionId,
      missionType: missionTypeMap[m.missionType],
      missionStatus: missionStatusMap[m.missionStatus]
    }));

    return {
      ...e,
      missions
    };
  }),
  share()
);

export const useMissions = () => {
  const [missions, setMissions] = useState<InferObservableType<typeof missionReports$>['missions']>(
    []
  );
  useEffect(() => {
    const sub = missionReports$
      .pipe(
        pluck('missions'),
        distinctUntilChanged((prev, curr) => JSON.stringify(prev) === JSON.stringify(curr))
      )
      .subscribe((ms) => {
        setMissions(ms);
      });

    return () => {
      sub.unsubscribe();
    };
  }, []);
  return { missions };
};

export const useMissionsOnce = () => {
  const [missions, setMissions] = useState<InferObservableType<typeof missionReports$>['missions']>(
    []
  );
  useEffect(() => {
    const sub = missionReports$.pipe(pluck('missions')).subscribe((ms) => {
      setMissions(ms);
      sub.unsubscribe();
    });
  }, []);
  return { missions };
};

export type MissionInfo = {
  amrId?: string;
  missionId: string;
  missionType: string;
  missionStatus: string;
  fullName?: string;
  manualMode?: boolean | string;
  emergencyBtn?: boolean | string;
  recoveryBtn?: boolean | string;
  warningIdList?: Array<undefined | number>;
  // emergencyBtn?: boolean | string;
  createdAt?: Date;
  assignedAt?: Date;
  startedAt?: Date;
  forkStartAt?: Date;
  forkEndAt?: Date;
  completedAt?: Date;
  startShelfColumn?: string | null;
  endShelfColumn?: string | null;
  message?: string;
  priority?: number;
  order: number;
};

export const useMission = (missionId: string) => {
  const { missions } = useMissions();
  return missions.find((m) => m.missionId === missionId);
};
