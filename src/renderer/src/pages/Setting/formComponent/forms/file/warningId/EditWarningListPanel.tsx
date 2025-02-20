import { FC, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Button, Flex, Modal } from 'antd'
import styled from 'styled-components'
import WarningIdForm from './WarningIdForm'
import WarningIdGenreTable from './WarningIdGenreTable'
import FormHr from '@renderer/pages/Setting/utils/FormHr'
import WarningIdGenreForm from './WarningIdGenreForm'
import WarningListTable from './WarningListTable'

const AlignBtn = styled.div`
  position: relative;
  bottom: 130px;
  right: -340px;
`

const EditWarningListPanel: FC<{
  sortableId: string
  attributes: import('@dnd-kit/core').DraggableAttributes
  listeners: import('@dnd-kit/core/dist/hooks/utilities').SyntheticListenerMap | undefined
}> = ({ sortableId, attributes, listeners }) => {
  const { t } = useTranslation()
  const [isModalOpen, setIsModalOpen] = useState(false)

  const showModal = () => {
    setIsModalOpen(true)
  }

  const handleOk = () => {
    setIsModalOpen(false)
  }

  const handleCancel = () => {
    setIsModalOpen(false)
  }

  return (
    <>
      <div>
        <h3 className="drop_button_style" {...listeners} {...attributes}>
          {t('file.warning_list.warning_table')}
        </h3>
        <FormHr sortableId={sortableId} />

        <Flex gap="middle" justify="flex-start" align="start" vertical>
          <WarningIdForm />
          <AlignBtn>
            <Button onClick={showModal}>{t('file.warning_list.add_new_genre')}</Button>
          </AlignBtn>

          <WarningListTable />
        </Flex>
      </div>
      <Modal
        title={t('file.warning_list.add_new_genre')}
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <WarningIdGenreForm />
        <WarningIdGenreTable />
      </Modal>
    </>
  )
}

export default EditWarningListPanel
