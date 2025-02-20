import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { Flex } from 'antd'
import FormHr from '@renderer/pages/Setting/utils/FormHr'
import TagTable from './TagTable'

const EditTagPanel: FC<{
  sortableId: string
  attributes: import('@dnd-kit/core').DraggableAttributes
  listeners: import('@dnd-kit/core/dist/hooks/utilities').SyntheticListenerMap | undefined
}> = ({ sortableId, attributes, listeners }) => {
  const { t } = useTranslation()

  return (
    <div>
      <h3 className="drop_button_style" {...listeners} {...attributes}>
        {t('mission.charge_mission.charge_mission')}
      </h3>
      <FormHr sortableId={sortableId} />
      <Flex gap="middle" justify="flex-start" align="start" vertical>
        <TagTable />
      </Flex>
    </div>
  )
}

export default EditTagPanel
