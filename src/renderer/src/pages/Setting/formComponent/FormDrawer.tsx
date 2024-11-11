/* eslint-disable react/prop-types */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { useState } from 'react'
import { Button, FormInstance } from 'antd'
import { useTranslation } from 'react-i18next'
import { useAtom } from 'jotai'
import {
  CaretLeftOutlined,
  CaretUpOutlined,
  CaretRightOutlined,
  CaretDownOutlined
} from '@ant-design/icons'
import { SideSwitchToShowForm } from '@renderer/utils/siderGloble'
import { AllLocationListForm } from './forms'
import './forms/form.css'
const FormDrawer: React.FC<{ locationPanelForm: FormInstance<unknown> }> = ({
  locationPanelForm
}) => {
  const [direction, setDirection] = useState<string>('right')
  const [wrapScale, setWrapScale] = useState<string>('down')
  const [opacity, setOpacity] = useState<'show' | 'hide'>('show')
  const { t } = useTranslation()
  const [drawerSwitchToShowForm, test] = useAtom(SideSwitchToShowForm)
  return (
    <div
      className={`form-wrap-drawer
      ${drawerSwitchToShowForm ? 'is-drawer-open' : ''}
      ${direction}
      ${wrapScale}
      ${opacity}`}
    >
      <div className="button-and-direction-wrap">
        <div style={{ display: 'flex', justifyContent: 'space-between', width: '10%' }}>
          <CaretLeftOutlined onClick={() => setDirection('left')} />
          <div
            style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}
          >
            <CaretUpOutlined onClick={() => setWrapScale('up')} />
            <CaretDownOutlined onClick={() => setWrapScale('down')} />
          </div>
          <CaretRightOutlined onClick={() => setDirection('right')} />
        </div>
        <Button
          style={{ marginBottom: '15px' }}
          onClick={() => {
            setOpacity((pre) => {
              if (pre === 'hide') {
                return 'show'
              }
              return 'hide'
            })
          }}
        >
          {t('close')}
        </Button>
        <Button
          color="danger"
          variant="solid"
          style={{ marginBottom: '15px' }}
          onClick={() => {
            test(false)
          }}
        >
          {t('close')}
        </Button>
      </div>
      {<AllLocationListForm locationPanelForm={locationPanelForm}></AllLocationListForm>}
      {<AllLocationListForm locationPanelForm={locationPanelForm}></AllLocationListForm>}
      {<AllLocationListForm locationPanelForm={locationPanelForm}></AllLocationListForm>}
      {<AllLocationListForm locationPanelForm={locationPanelForm}></AllLocationListForm>}
      {<AllLocationListForm locationPanelForm={locationPanelForm}></AllLocationListForm>}
      {<AllLocationListForm locationPanelForm={locationPanelForm}></AllLocationListForm>}
      {<AllLocationListForm locationPanelForm={locationPanelForm}></AllLocationListForm>}
      {<AllLocationListForm locationPanelForm={locationPanelForm}></AllLocationListForm>}
      {<AllLocationListForm locationPanelForm={locationPanelForm}></AllLocationListForm>}
      {<AllLocationListForm locationPanelForm={locationPanelForm}></AllLocationListForm>}
    </div>
  )
}

export default FormDrawer
