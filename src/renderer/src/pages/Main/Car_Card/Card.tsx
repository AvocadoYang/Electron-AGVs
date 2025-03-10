import { InfoWrap } from './components/InfoWrap';
import { RowOne, RowThread, RowSecond, CarTag, HiddenRow } from './components/Lists';
import './car_info.css';
import { useState } from 'react';
import { Modal } from 'antd';

const Card: React.FC<{ id: number }> = ({ id }) => {
  const [openHiddenRow, setOpenHiddenRow] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  // console.log(isModalOpen);
  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };
  return (
    <>
      <InfoWrap
        randomcolor={'red'}
        onClick={(e) => {
          e.preventDefault();
          showModal();
        }}
      >
        <RowOne></RowOne>
        <RowSecond setOpenHiddenRow={setOpenHiddenRow} openHiddenRow={openHiddenRow}></RowSecond>
        <HiddenRow openHiddenRow={openHiddenRow}></HiddenRow>
        <RowThread></RowThread>
        <CarTag></CarTag>
      </InfoWrap>
      <Modal title="Basic Modal" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
        <p>Some contents...</p>
        <p>Some contents...</p>
        <p>Some contents...</p>
      </Modal>
    </>
  );
};

export default Card;
