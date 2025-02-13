import { memo } from 'react'
import './form.css'
import { useTranslation } from 'react-i18next'
import { FormInstance } from 'antd'
const EditZonePanel: React.FC<{
  zonePanelForm: FormInstance<unknown>
  sortableId: string
  attributes: import('@dnd-kit/core').DraggableAttributes
  listeners: import('@dnd-kit/core/dist/hooks/utilities').SyntheticListenerMap | undefined
}> = ({ attributes, listeners }) => {
  const { t } = useTranslation()
  return (
    <>
      <div style={{ width: '23em' }}>
        <h3 className="drop_button_style" {...listeners} {...attributes}>
          {t('sider_output_form_name.zonePanel')}
        </h3>
        {123}
      </div>
    </>
  )
}

export default memo(EditZonePanel)
