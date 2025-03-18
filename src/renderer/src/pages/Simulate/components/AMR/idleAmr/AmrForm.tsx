import useMap from '@renderer/api/useMap';
import SubmitButton from '@renderer/utils/SubmitButton';
import { Form, Input, Modal, Select } from 'antd';
import { Dispatch, FC, SetStateAction, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { EditFormType } from '../amr';
import useScriptRobot from '@renderer/api/useScriptRobot';

const AmrForm: FC<{
  id: string;
  handleEditMutation: (payload: EditFormType) => void;
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}> = ({ id, handleEditMutation, isOpen, setIsOpen }) => {
  const { data: map } = useMap();
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const { data: robot } = useScriptRobot();

  const handleCancel = () => {
    setIsOpen(false);
  };
  const locationOptions = useMemo(() => {
    const items =
      map?.locations
        .filter((v) => v.areaType !== '存貨區')
        .map((v) => ({ label: v.locationId, value: v.locationId })) || [];

    return [{ label: t('sim.robot.unset'), value: 'unset' }, ...items];
  }, [map?.locations]);

  const editHandler = () => {
    const full_name = form.getFieldValue('full_name') as string;
    const script_placement_location = form.getFieldValue('script_placement_location') as string;

    const payload = {
      full_name,
      script_placement_location
    };

    handleEditMutation(payload);
  };

  useEffect(() => {
    if (!isOpen) return;

    const info = robot?.find((v) => v?.id === id);

    form.setFieldValue('full_name', info?.full_name);
    form.setFieldValue('script_placement_location', {
      value: info?.script_placement_location,
      label: info?.script_placement_location
    });
  }, [isOpen]);

  return (
    <>
      <Modal
        title={t('sim.robot.modal.edit')}
        open={isOpen}
        onCancel={handleCancel}
        footer={() => (
          <>
            <SubmitButton form={form} onOk={editHandler} isModel />
          </>
        )}
      >
        <Form form={form} style={{ maxWidth: 600 }}>
          <Form.Item
            name="full_name"
            label={t('sim.robot.modal.full_name')}
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="script_placement_location"
            label={t('sim.robot.modal.placement')}
            rules={[{ required: true }]}
          >
            <Select options={locationOptions} />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default AmrForm;
