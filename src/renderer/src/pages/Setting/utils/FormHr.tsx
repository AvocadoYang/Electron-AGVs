import { FC, memo } from 'react';
import { borderColor } from './utils';

const FormHr: FC<{ sortableId: string }> = ({ sortableId }) => {
  return (
    <hr
      style={{
        marginTop: '1px',
        marginBottom: '10px',
        border: `3px solid ${borderColor(sortableId)}`,
        borderRadius: '5px'
      }}
    ></hr>
  );
};

export default memo(FormHr);
