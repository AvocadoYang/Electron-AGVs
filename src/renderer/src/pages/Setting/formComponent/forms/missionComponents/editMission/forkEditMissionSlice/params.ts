export const actonList = [
  'move',
  'load',
  'offload',
  'spin',
  'fork',
  'charge',
  'cargo_limit',
  'load_from_other',
  'offload_from_other'
] as const;

export const controlList = {
  move: ['F', 'H', 'S', 'B', 'W'],
  load: ['H', 'C', 'H', 'B'],
  offload: ['H', 'B'],
  spin: ['S'],
  fork: ['H', 'F', 'B'],
  charge: ['H'],
  cargo_limit: ['H'],
  load_from_other: ['F', 'H', 'S', 'B', 'W'],
  offload_from_other: ['F', 'H', 'S', 'B', 'W']
} as const;

export const selectLocationOption = [
  'custom',
  'select',
  'available_charge_station',
  'prepare_point'
] as const;

export const yawOption = ['custom', 'select', 'calculate_by_agv_and_shelf_angle'] as const;

export const forkHeightOption = ['default', 'custom', 'select'] as const;

export const activeWaitRobot = ['disable', 'enable'] as const;

export const waitRobotOption = ['execute_first', 'wait_other_finish'] as const;
