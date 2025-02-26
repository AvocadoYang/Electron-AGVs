import { ASType } from '@renderer/api/useAMRsample'
import useCategory from '@renderer/api/useCategory'
import { MTType } from '@renderer/api/useMissionTitle'
import { Form, FormInstance, Input, Select } from 'antd'
import { FC, useEffect } from 'react'
import { useTranslation } from 'react-i18next'

const MissionForm: FC<{
  missionDataSource: MTType
  editMissionKey: string
  carDataSource: ASType
  formMission: FormInstance<unknown>
}> = ({ missionDataSource, editMissionKey, formMission, carDataSource }) => {
  const { data: cat } = useCategory()

  const catOption =
    cat?.map((v) => {
      return { value: v.id, label: v.tagName }
    }) || []

  const missionItem = missionDataSource?.filter((v) => v.id === editMissionKey)[0]

  const newCarList = carDataSource?.map((v) => ({
    label: v.name,
    value: v.id
  }))

  const { t } = useTranslation()
  useEffect(() => {
    if (!missionItem) return

    const option = missionItem?.MissionTitleBridgeCategory?.map((c) => c.Category?.id) || []

    formMission.setFieldValue('name', missionItem?.name)
    formMission.setFieldValue('car_type', missionItem?.Car?.id)
    formMission.setFieldValue('category', option)
  }, [formMission, missionItem])

  return (
    <Form form={formMission} autoComplete="off">
      <Form.Item
        rules={[{ required: true, message: t('mission.add_mission.name_warn') }]}
        label={t('mission.add_mission.name')}
        name="name"
        hasFeedback
      >
        <Input />
      </Form.Item>

      <Form.Item
        hasFeedback
        rules={[{ required: true, message: t('mission.add_mission.car_warn') }]}
        label={t('mission.add_mission.car')}
        name="car_type"
      >
        <Select options={newCarList} />
      </Form.Item>

      <Form.Item label={t('mission.add_mission.tag')} name="category">
        <Select mode="multiple" options={catOption} />
      </Form.Item>
    </Form>
  )
}

export default MissionForm
