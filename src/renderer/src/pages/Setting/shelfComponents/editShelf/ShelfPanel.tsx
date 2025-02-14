/* eslint-disable no-void */
import { Button, Flex } from 'antd'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import ShelfTable from './ShelfTable'
import ShelfDrawer from './ShelfDrawer'
import { borderColor } from '../../utils/utils'

const ShelfPanel: React.FC<{
  sortableId: string
  attributes: import('@dnd-kit/core').DraggableAttributes
  listeners: import('@dnd-kit/core/dist/hooks/utilities').SyntheticListenerMap | undefined
}> = ({ sortableId, attributes, listeners }) => {
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([])
  const [openDrawer, setOpenDrawer] = useState(false)

  const { t } = useTranslation()

  return (
    <>
      <h3 className="drop_button_style" {...listeners} {...attributes}>
        {t('edit_shelf_panel.edit_shelf')}
      </h3>

      <hr
        style={{
          marginTop: '1px',
          marginBottom: '10px',
          border: `4px solid ${borderColor(sortableId)}`
        }}
      ></hr>

      <Flex vertical align="start" gap="middle">
        <Button onClick={() => setOpenDrawer(true)} disabled={selectedRowKeys.length === 0}>
          {t('utils.edit')}
        </Button>

        <ShelfTable selectedRowKeys={selectedRowKeys} setSelectedRowKeys={setSelectedRowKeys} />
      </Flex>

      <ShelfDrawer
        openDrawer={openDrawer}
        setOpenDrawer={setOpenDrawer}
        selectedRowKeys={selectedRowKeys}
      />
    </>
  )
}

export default ShelfPanel
