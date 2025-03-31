import AMR from './components/AMR';
import { memo } from 'react';
import useName from '@renderer/api/useAmrName';

const MemoizedAMR = memo(AMR, (prevProps, nextProps) => {
  return prevProps.amrId === nextProps.amrId;
});

const AllAMRs = () => {
  const { data } = useName();
  if (!data) return null;
  return (
    <>
      {data.map(({ id }) => (
        <MemoizedAMR amrId={id} key={id} />
      ))}
    </>
  );
};

export default AllAMRs;
