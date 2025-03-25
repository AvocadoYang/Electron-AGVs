export const isHumanRobot = (robotId: string): boolean =>
  robotId
    .split('-')
    .map((v) => v.toLowerCase())
    .includes('rb');

export const isFork = (robotId: string): boolean => {
  const list = robotId.split('-').map((v) => v.toLowerCase());
  return (
    list.includes('cb') || list.includes('ps14') || list.includes('sw15') || list.includes('pm')
  );
};
