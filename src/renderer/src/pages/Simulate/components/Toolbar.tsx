import { FC } from 'react'
import {
  CaretRightOutlined,
  PauseOutlined,
  PlusOutlined,
  UndoOutlined,
  UpOutlined
} from '@ant-design/icons'
import { FloatButton } from 'antd'
import { useTranslation } from 'react-i18next'
const Toolbar: FC = () => {
  const { t } = useTranslation()
  return (
    <>
      <FloatButton.Group trigger="click" icon={<UpOutlined key="left" />}>
        <FloatButton tooltip={<div>{t('sim.start_sim')}</div>} icon={<CaretRightOutlined />} />
        <FloatButton tooltip={<div>{t('sim.stop_sim')}</div>} icon={<PauseOutlined />} />
        <FloatButton tooltip={<div>{t('sim.add_car')}</div>} icon={<PlusOutlined />} />
        <FloatButton tooltip={<div>{t('sim.reset_sim')}</div>} icon={<UndoOutlined />} />
      </FloatButton.Group>
    </>
  )
}

export default Toolbar
