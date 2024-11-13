/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react/prop-types */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { Button, Checkbox, Col, Form, FormInstance, InputNumber, Radio, Row, Switch } from 'antd'
import DraggableWindow from '../DraggableWindow'
import { useAtom } from 'jotai'
import { showBlockId as ShowBlockId } from '@renderer/utils/gloable'
import { modifyRoad as Road } from '@renderer/utils/gloable'
import { tempEditAndStoredLocation, tempEditAndStoredRoads } from '@renderer/utils/gloable'
import { useTranslation } from 'react-i18next'
import { EditRoadPanelSwitch } from '@renderer/utils/siderGloble'
import { getLocationInfoById } from '../../utils/utils'
import { useState } from 'react'
import { openNotificationWithIcon } from '../../utils/notification'
import { Modify, RoadListType } from '@renderer/utils/jotai'
import { CloseOutlined } from '@ant-design/icons'
import { initialRoadValue } from './formInitValue'

function validateArray(arr: string[]) {
  if (arr.includes('*')) {
    return arr.length === 1
  }

  if (arr.includes('0') || arr.includes('180')) {
    return arr.every((val) => val === '0' || val === '180')
  }

  if (arr.includes('90') || arr.includes('270')) {
    return arr.every((val) => val === '90' || val === '270')
  }

  return true
}

const EditRoadPanel: React.FC<{ roadPanelForm: FormInstance<unknown> }> = ({ roadPanelForm }) => {
  const [chooseAngle, setChooseAngle] = useState<string>('')
  const [TempEditAndStoredLocation] = useAtom(tempEditAndStoredLocation)
  const [openEditRoadPanel, setOpenEditRoadPanel] = useAtom(EditRoadPanelSwitch) // 2-1
  const [TempEditAndStoredRoads, setEditingRoadsList] = useAtom(tempEditAndStoredRoads)

  const [modifyRoad, setModifyRoad] = useAtom(Road)

  const [, setShowBlockId] = useAtom(ShowBlockId)
  const { t } = useTranslation()

  const addModifyHandler = (id: string) => {
    const staleModify = { ...modifyRoad }

    const addList = [...staleModify.add, id]

    const editList = [...staleModify.edit].filter((d) => d !== id)

    const deleteList = [...staleModify.delete]

    const newModify: Modify = {
      add: [...new Set(addList)] as string[],
      edit: editList,
      delete: deleteList
    }

    setModifyRoad(newModify)
  }

  const saveRoad = () => {
    const payload = roadPanelForm.getFieldsValue() as RoadListType

    let newPayload: RoadListType
    const x = Number(payload.x)
    const to = Number(payload.to)

    const isNotNumTo = Number.isNaN(to)
    const isNotNumX = Number.isNaN(x)

    if (isNotNumX || isNotNumTo) {
      openNotificationWithIcon(
        'warning',
        t('edit_road_panel.save_road_notify.warn'),
        t('edit_road_panel.save_road_notify.warn_number_only'),
        'bottomLeft'
      )
      return
    }

    if (!payload.checkboxGroup) {
      openNotificationWithIcon(
        'warning',
        t('edit_road_panel.save_road_notify.warn'),
        t('edit_road_panel.save_road_notify.warn_road_yaw'),
        'bottomLeft'
      )
      return
    }
    if (!validateArray(payload.checkboxGroup)) {
      openNotificationWithIcon(
        'warning',
        t('edit_road_panel.save_road_notify.warn'),
        t('edit_road_panel.save_road_notify.illegal_road_yaw'),
        'bottomLeft'
      )
      return
    }

    if (payload.to === payload.x) {
      openNotificationWithIcon(
        'warning',
        t('edit_road_panel.save_road_notify.warn'),
        t('edit_road_panel.save_road_notify.warn_msg'),
        'bottomLeft'
      )
      return
    }

    let targetYawList: string | number[]
    let erId: string
    if (payload.checkboxGroup.includes('*')) {
      targetYawList = [...payload.checkboxGroup].pop() as string
    } else {
      targetYawList = [...payload.checkboxGroup].map((yaw) => Number(yaw))
    }

    if (payload.roadType === 'oneWayRoad') {
      erId = `${payload.x} -> ${payload.to}`

      const isDuplicateId = TempEditAndStoredRoads.some((v) => {
        const useId = `${v.x} -> ${v.to}`
        return useId === erId
      })
      if (isDuplicateId) {
        openNotificationWithIcon(
          'warning',
          t('edit_road_panel.save_road_notify.duplicate_id'),
          t('edit_road_panel.save_road_notify.road_exists'),
          'bottomLeft'
        )
        return
      }
      const result1 = getLocationInfoById(payload.to.toString(), TempEditAndStoredLocation)
      const result2 = getLocationInfoById(payload.x.toString(), TempEditAndStoredLocation)

      newPayload = {
        ...payload,
        roadId: erId,
        validYawList: targetYawList,
        to: payload.to.toString(),
        x: payload.x.toString(),
        disabled: !!payload.disabled,
        limit: !!payload.limit,
        x1: result1.x,
        y1: result1.y,
        x2: result2.x,
        y2: result2.y
      } as RoadListType
    } else {
      erId = `${payload.x} <-> ${payload.to}`
      const isDuplicateId = TempEditAndStoredRoads.some((v) => {
        const useId = `${v.x} <-> ${v.to}`
        return useId === erId
      })
      if (isDuplicateId) {
        openNotificationWithIcon(
          'warning',
          t('edit_road_panel.save_road_notify.duplicate_id'),
          t('edit_road_panel.save_road_notify.road_exists'),
          'bottomLeft'
        )
        return
      }
    }

    const result1 = getLocationInfoById(payload.to.toString(), TempEditAndStoredLocation)
    const result2 = getLocationInfoById(payload.x.toString(), TempEditAndStoredLocation)
    newPayload = {
      ...payload,
      roadId: erId,

      validYawList: JSON.stringify(targetYawList).includes('*') ? '*' : targetYawList,
      disabled: !!payload.disabled,
      limit: !!payload.limit,
      to: payload.to.toString(),
      x: payload.x.toString(),
      x1: result1.x,
      y1: result1.y,
      x2: result2.x,
      y2: result2.y
    } as RoadListType

    addModifyHandler(newPayload.roadId)
    setEditingRoadsList([...TempEditAndStoredRoads, newPayload])
    setShowBlockId('')
  }

  return (
    <>
      {openEditRoadPanel && (
        <DraggableWindow isHide={false} width="15%">
          {
            <>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'end',
                  alignItems: 'center',
                  width: '100%'
                }}
              >
                <CloseOutlined
                  onClick={() => {
                    setOpenEditRoadPanel(false)
                  }}
                />
              </div>
              <Form
                initialValues={{ ...initialRoadValue }}
                form={roadPanelForm}
                style={{ paddingTop: '10px' }}
              >
                <Form.Item label={t('edit_road_panel.road')} name="roadType" shouldUpdate>
                  <Radio.Group buttonStyle="solid">
                    <Radio.Button value="oneWayRoad">
                      {t('edit_road_panel.single_road')}
                    </Radio.Button>
                    <Radio.Button value="twoWayRoad">
                      {t('edit_road_panel.two_way_road')}
                    </Radio.Button>
                  </Radio.Group>
                </Form.Item>

                <Form.Item name="checkboxGroup" label={t('edit_road_panel.yaw')} required>
                  <Checkbox.Group>
                    <Row>
                      <Col span={8}>
                        <Checkbox
                          value="*"
                          disabled={
                            chooseAngle === '0' ||
                            chooseAngle === '90' ||
                            chooseAngle === '180' ||
                            chooseAngle === '270'
                          }
                          onChange={(e) => {
                            if (e.target.checked) {
                              setChooseAngle('*')
                            } else {
                              setChooseAngle('')
                            }
                          }}
                        >
                          *
                        </Checkbox>
                      </Col>
                      <Col span={8}>
                        <Checkbox
                          value="0"
                          disabled={
                            chooseAngle === '*' || chooseAngle === '270' || chooseAngle === '90'
                          }
                          onChange={(e) => {
                            if (e.target.checked) {
                              setChooseAngle('0')
                            } else {
                              setChooseAngle('')
                            }
                          }}
                        >
                          0
                        </Checkbox>
                      </Col>
                      <Col span={8}>
                        <Checkbox
                          value="90"
                          disabled={
                            chooseAngle === '*' || chooseAngle === '0' || chooseAngle === '180'
                          }
                          onChange={(e) => {
                            if (e.target.checked) {
                              setChooseAngle('90')
                            } else {
                              setChooseAngle('')
                            }
                          }}
                        >
                          90
                        </Checkbox>
                      </Col>
                      <Col span={13}>
                        <Checkbox
                          value="180"
                          disabled={
                            chooseAngle === '*' || chooseAngle === '270' || chooseAngle === '90'
                          }
                          onChange={(e) => {
                            if (e.target.checked) {
                              setChooseAngle('180')
                            } else {
                              setChooseAngle('')
                            }
                          }}
                        >
                          180
                        </Checkbox>
                      </Col>
                      <Col span={8}>
                        <Checkbox
                          value="270"
                          disabled={
                            chooseAngle === '*' || chooseAngle === '0' || chooseAngle === '180'
                          }
                          onChange={(e) => {
                            if (e.target.checked) {
                              setChooseAngle('270')
                            } else {
                              setChooseAngle('')
                            }
                          }}
                        >
                          270
                        </Checkbox>
                      </Col>
                    </Row>
                  </Checkbox.Group>
                </Form.Item>

                <Form.Item name="disabled" label={t('edit_road_panel.disabled')} shouldUpdate>
                  <Switch />
                </Form.Item>

                <Form.Item name="limit" label={t('edit_road_panel.limit')}>
                  <Switch />
                </Form.Item>

                <Form.Item label={t('edit_road_panel.start_point')} name="x" shouldUpdate required>
                  <InputNumber />
                </Form.Item>

                <Form.Item label={t('edit_road_panel.end_point')} name="to" shouldUpdate required>
                  <InputNumber />
                </Form.Item>

                <Form.Item style={{ textAlign: 'center' }}>
                  <Button onClick={() => saveRoad()} type="primary">
                    {t('edit_road_panel.add')}
                  </Button>
                </Form.Item>
              </Form>
            </>
          }
        </DraggableWindow>
      )}
    </>
  )
}

export default EditRoadPanel
