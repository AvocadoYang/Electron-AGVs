import { array, string, object, ValidationError, number, boolean } from 'yup';
import { from, fromEventPattern, share, switchMap, distinctUntilChanged } from 'rxjs';
import { useEffect, useState } from 'react';
import { io } from './socketConnect';

const schema = () =>
  array(
    object({
      locationId: string().optional().nullable(),
      conveyorDBId: string().optional(),
      forkHeight: number().required(),
      activeLoad: boolean().required(),
      activeOffload: boolean().required(),
      cargo: array(
        object({
          cargoInfoId: string().optional().nullable(),
          customCargoMetadataId: string().optional().nullable(),
          metadata: string().optional().nullable()
        }).optional()
      )
        .optional()
        .nullable(),
      status: string().optional()
    }).required()
  ).required();

const profiles$ = fromEventPattern(
  (next) => {
    io.on('conveyor-info', next);
    return next;
  },
  (next) => {
    io.off('conveyor-info', next);
  }
).pipe(
  switchMap((msg) => {
    // console.log('Message received by switchMap:', msg);

    return from(
      schema()
        .validate(msg as unknown[])
        .catch((err: ValidationError) => {
          console.error(err.message);
          console.error('conveyor-info socket schema mismatch: ', err.value);
          return undefined;
        })
    );
  }),
  distinctUntilChanged((prev, curr) => JSON.stringify(prev) === JSON.stringify(curr)),
  share()
);

export type Cargo = {
  cargoInfoId: string | null;
  customCargoMetadataId: string | null;
  metadata: string | null;
};

export type Conveyor_Info = {
  locationId: string;
  conveyorDBId: string;
  cargo: Cargo[];
  status: string;
  forkHeight: number;
  activeLoad: boolean;
  activeOffload: boolean;
};

const useConveyorSocket = () => {
  const [cargoInfo, setCargoInfo] = useState<Conveyor_Info[]>();

  useEffect(() => {
    const subscription = profiles$
      .pipe(
        distinctUntilChanged((prev, curr) => JSON.stringify(prev) === JSON.stringify(curr)) // Avoid state update if data is identical
      )
      .subscribe((filteredData) => {
        if (filteredData) {
          setCargoInfo(filteredData as Conveyor_Info[]);
        }
      });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return cargoInfo;
};

export default useConveyorSocket;
