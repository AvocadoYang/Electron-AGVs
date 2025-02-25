import { Button, Form, message, Modal, Radio, Select } from 'antd'
import { useAtom } from 'jotai'
import { useTranslation } from 'react-i18next'
import { OpenQuickMission } from '../../global/jotai'
import useName from '@renderer/api/useAmrName'
import { useEffect, useState } from 'react'
import useShelvesInfo from '@renderer/api/useShelvesInfo'

enum MissionPriority {
  TRIVIAL, //沒差最後再做
  NORMAL, //普通
  PIVOTAL, //特別優先
  CRITICAL // 緊急
}

const QuickMission = () => {
  const { t } = useTranslation()
  const [messageApi, contextHolder] = message.useMessage()
  const [loadShelf, setLoadShelf] = useState<{ label: string; value: string }[]>([])
  const [offLoadShelf, setOffLoadShelf] = useState<{ label: string; value: string }[]>([])
  const [form] = Form.useForm()
  const { data: name } = useName()
  const [, setAmrGenre] = useState<string | null>(null)
  const { data: shelves } = useShelvesInfo()

  useEffect(() => {
    if (!shelves || !shelves.length) {
      return
    }

    const loadShelves = shelves
      .filter((shelf) => shelf.hasCargo)
      .map((shelf) => {
        const columnName = shelf.columnName || '未設定名稱'
        const label = `${columnName}-${shelf.locationId}-${shelf.level}`
        return {
          value: shelf.locationId,
          label
        }
      })

    setLoadShelf(loadShelves)
    const offLoadShelves = shelves
      .filter((shelf) => !shelf.hasCargo)
      .map((shelf) => {
        const columnName = shelf.columnName || '未設定名稱'
        const label = `${columnName}-${shelf.locationId}-${shelf.level}`
        return {
          value: shelf.locationId,
          label
        }
      })

    setOffLoadShelf(offLoadShelves)
  }, [shelves])

  const [openQuickMission, setOpenQuickMission] = useAtom(OpenQuickMission)
  const AmrOption: { value: null | string; label: string }[] | undefined = name?.map((v) => ({
    value: v.id,
    label: v.id
  }))

  AmrOption?.push({ value: null, label: t('utils.random') })
  const handleCancel = () => {
    setOpenQuickMission(false)
  }

  return (
    <>
      {contextHolder}
      <Modal
        title={t('main.card_name.quick_mission')}
        open={openQuickMission}
        onClose={handleCancel}
        footer={[
          <Button key="submit" color="primary" variant="filled">
            {t('utils.submit')}
          </Button>
        ]}
        onCancel={handleCancel}
        style={{ fontWeight: 'bold' }}
      >
        <Form form={form}>
          <Form.Item label={`${t('mission.cycle_mission.car')} `} name="amrId">
            <Select
              options={AmrOption}
              onChange={(v: string) => setAmrGenre(v)}
              placeholder={'Select an AMR'}
              onMouseDown={(e) => e.preventDefault()}
              onPopupScroll={(e) => {
                e.stopPropagation()
              }}
              onDropdownVisibleChange={(open) => {
                if (open) {
                  document.body.style.overflow = 'hidden'
                } else {
                  document.body.style.overflow = 'auto'
                }
              }}
            />
          </Form.Item>
          <Form.Item
            label={`${t('main.mission_modal.dialog_mission.task_priority')} `}
            name="priority"
            shouldUpdate
          >
            <Radio.Group>
              <Radio.Button value={MissionPriority.CRITICAL}>
                {t('main.mission_modal.dialog_mission.priority.CRITICAL')}
              </Radio.Button>
              <Radio.Button value={MissionPriority.PIVOTAL}>
                {t('main.mission_modal.dialog_mission.priority.PIVOTAL')}
              </Radio.Button>
              <Radio.Button value={MissionPriority.NORMAL}>
                {t('main.mission_modal.dialog_mission.priority.NORMAL')}
              </Radio.Button>
              <Radio.Button value={MissionPriority.TRIVIAL}>
                {t('main.mission_modal.dialog_mission.priority.TRIVIAL')}
              </Radio.Button>
            </Radio.Group>
          </Form.Item>

          <Form.Item label={t('car_control_translate.load')}>
            <Select
              placeholder={'Select a load shelf'}
              style={{ width: '100%' }}
              options={loadShelf}
              onMouseDown={(e) => e.preventDefault()}
              onDropdownVisibleChange={(open) => {
                if (open) {
                  document.body.style.overflow = 'hidden'
                } else {
                  document.body.style.overflow = 'auto'
                }
              }}
              onPopupScroll={(e) => {
                e.stopPropagation()
              }}
            />
          </Form.Item>

          <Form.Item label={t('car_control_translate.offload')}>
            <Select
              placeholder={'Select a offload shelf'}
              style={{ width: '100%' }}
              options={offLoadShelf}
              onMouseDown={(e) => e.preventDefault()}
              onDropdownVisibleChange={(open) => {
                if (open) {
                  document.body.style.overflow = 'hidden'
                } else {
                  document.body.style.overflow = 'auto'
                }
              }}
              onPopupScroll={(e) => {
                e.stopPropagation()
              }}
            />
          </Form.Item>
        </Form>
      </Modal>
    </>
  )
}

export default QuickMission
