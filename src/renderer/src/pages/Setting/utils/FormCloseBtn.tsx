import { FC, memo } from 'react';
import { CloseOutlined } from '@ant-design/icons';
import './utils.css';

const FormCloseBtn: FC<{ sortableId: string }> = () => {
  return (
    <>
      <CloseOutlined
        className="form-close-btn"
        style={{ position: 'absolute', right: '1em', top: '1em' }}
      />
    </>
  );
};

export default memo(FormCloseBtn);
