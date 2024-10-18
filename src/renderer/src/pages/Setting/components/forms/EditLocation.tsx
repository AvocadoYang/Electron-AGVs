/* eslint-disable @typescript-eslint/explicit-function-return-type */
import React, { useRef, useState } from 'react'
import { LocationType } from '../antd'
import type { DraggableData, DraggableEvent } from 'react-draggable'
import Draggable from 'react-draggable'
import { Form, Input, Radio, Button, FormInstance, Checkbox } from 'antd'

const initialValue: LocationType = {
  locationId: 0,
  x: 0,
  y: 0,
  areaType: 'Extra',
  rotation: 0,
  canRotate: false
}


const EditLocation: React.FC<{
  openEditLocationPanel: boolean
  setOpenEditLocationPanel: React.Dispatch<boolean>
}> = ({ openEditLocationPanel, setOpenEditLocationPanel }) => {
  const [bounds, setBounds] = useState({ left: 0, top: 0, bottom: 0, right: 0 })
  const draggleRef = useRef<HTMLDivElement>(null)

  const onStart = (_event: DraggableEvent, uiData: DraggableData) => {
    const { clientWidth, clientHeight } = window.document.documentElement
    const targetRect = draggleRef.current?.getBoundingClientRect()
    if (!targetRect) {
      return
    }
    setBounds({
      left: -targetRect.left + uiData.x,
      right: clientWidth - (targetRect.right - uiData.x),
      top: -targetRect.top + uiData.y,
      bottom: clientHeight - (targetRect.bottom - uiData.y)
    })
  }

  return (
    <>
      {openEditLocationPanel && (
        <Draggable bounds={bounds} nodeRef={draggleRef} onStart={onStart}>
          <div
            ref={draggleRef}
            style={{
              position: 'absolute',
              top: '10%',
              borderRadius: '5px',
              left: '10%',
              transform: 'translate(-50%, -50%)',
              backgroundColor: 'rgba(255, 255, 255, 0.95)',
              padding: '10px',
              boxShadow: '0 5px 15px rgba(0,0,0,0.3)',
              cursor: 'move',
              zIndex: 1000
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <button
                onClick={() => setOpenEditLocationPanel(false)}
                style={{ marginLeft: '10px' }}
              >
                關閉
              </button>
            </div>
            {/* <Form
              initialValues={initialValue}
              // form={initialValue as FormInstance<unknown>}
              style={{ maxWidth: 150 }}
            >
              <Form.Item label="X" name="x" shouldUpdate>
                <Input value={123} />
              </Form.Item>

              <Form.Item label="Y" name="y" shouldUpdate>
                <Input value={123} />
              </Form.Item>

              <Form.Item
                label="θ"
                name="rotation"
                shouldUpdate
                hasFeedback
                validateDebounce={1000}
                rules={[
                  { required: true, message: '必填' },
                  { max: 360, message: '不可超過360' },
                  { min: -360, message: '不可小於-360' }
                ]}
              >
                <Input type="number" />
              </Form.Item>

              <Form.Item label="是否可旋轉" name="canRotate" valuePropName="checked" shouldUpdate>
                <Checkbox />
              </Form.Item>

              <Form.Item
                label="ID"
                name="locationId"
                shouldUpdate
                rules={[{ required: true, message: '必填' }]}
              >
                <Input type="number" disabled={isEdition} />
              </Form.Item>
              <Form.Item label="功能" name="areaType" shouldUpdate>
                <Radio.Group value="Extra">
                  <Radio value="Extra">{t('none')}</Radio>
                  <Radio value="充電區">{t('charge_station')}</Radio>
                  <Radio value="預派點">{t('prepare_spot')}</Radio>
                  <Radio value="待命區">{t('wait_side')}</Radio>
                  <Radio value="存貨區">{t('shelve')}</Radio>
                </Radio.Group>
              </Form.Item>
              {isEdition ? (
                []
              ) : (
                <Form.Item>
                  <Button onClick={() => savePos(false)} type="primary">
                    {t('yes')}
                  </Button>
                </Form.Item>
              )}
            </Form> */}
          </div>
        </Draggable>
      )}
    </>
  )
}

export default EditLocation
