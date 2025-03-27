import useAMRs from '@renderer/api/useAMRs';
import AMR from './components/AMR';
import { memo } from 'react';

const MemoizedAMR = memo(AMR, (prevProps, nextProps) => {
  return prevProps.amrId === nextProps.amrId;
});

const AllAMRs = () => {
  const { data } = useAMRs();
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
