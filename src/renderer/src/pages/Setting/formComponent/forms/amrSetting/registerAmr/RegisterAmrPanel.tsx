import FormHr from '@renderer/pages/Setting/utils/FormHr';
import { Flex } from 'antd';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import RegisterForm from './RegisterForm';
import RegisterTable from './RegisterTable';

const RegisterAmrPanel: FC<{
  sortableId: string;
  attributes: import('@dnd-kit/core').DraggableAttributes;
  listeners: import('@dnd-kit/core/dist/hooks/utilities').SyntheticListenerMap | undefined;
}> = ({ attributes, listeners }) => {
  const { t } = useTranslation();

  return (
    <>
      <div>
        <h3 className="drop_button_style" {...listeners} {...attributes}>
          {t('mission.cycle_mission.cycle_mission')}
        </h3>
        <FormHr />

        <Flex gap="middle" justify="flex-start" align="start" vertical>
          <RegisterForm />
          <RegisterTable />
        </Flex>
      </div>
    </>
  );
};

export default RegisterAmrPanel;
