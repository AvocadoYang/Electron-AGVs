import {
  Button,
  Checkbox,
  Col,
  Form,
  FormInstance,
  InputNumber,
  message,
  Radio,
  Row,
  Space,
  Switch
} from 'antd';
import { useTranslation } from 'react-i18next';
import { SaveOutlined } from '@ant-design/icons';
import { memo, useState } from 'react';
import { initialRoadValue } from './formInitValue';
import { ErrorResponse } from '@renderer/utils/globalType';
import { errorHandler } from '@renderer/utils/utils';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Road } from './road';
import client from '@renderer/api/axiosClient';
import FormHr from '../../utils/FormHr';

// function validateArray(arr: string[]) {
//   if (arr.includes('*')) {
//     return arr.length === 1;
//   }

//   if (arr.includes('0') || arr.includes('180')) {
//     return arr.every((val) => val === '0' || val === '180');
//   }

//   if (arr.includes('90') || arr.includes('270')) {
//     return arr.every((val) => val === '90' || val === '270');
//   }

//   return true;
// }

const EditRoadPanel: React.FC<{
  sortableId: string;
  attributes: import('@dnd-kit/core').DraggableAttributes;
  listeners: import('@dnd-kit/core/dist/hooks/utilities').SyntheticListenerMap | undefined;
  roadPanelForm: FormInstance<unknown>;
}> = ({ sortableId, attributes, listeners, roadPanelForm }) => {
  const [chooseAngle, setChooseAngle] = useState<string>('');
  const [messageApi, contextHolders] = message.useMessage();
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  const saveRoadMutation = useMutation({
    mutationFn: (payload: Road) => {
      return client.post('api/setting/save-edit-road', payload);
    },
    onSuccess: () => {
      void messageApi.success('success');
      queryClient.refetchQueries({ queryKey: ['map'] });
    },
    onError: (e: ErrorResponse) => errorHandler(e, messageApi)
  });

  const saveRoad = () => {
    const payload: Road = {
      spot1Id: (roadPanelForm.getFieldValue('x') as number).toString(),
      spot2Id: (roadPanelForm.getFieldValue('to') as number).toString(),
      limit: roadPanelForm.getFieldValue('limit') as boolean,
      roadType: roadPanelForm.getFieldValue('roadType') as string,
      validYawList: roadPanelForm.getFieldValue('validYawList') as number[] | string[],
      disabled: roadPanelForm.getFieldValue('disabled') as boolean
    };
    saveRoadMutation.mutate(payload);
  };

  return (
    <>
      {contextHolders}
      <div style={{ width: '23em' }}>
        <h3 className="drop_button_style" {...listeners} {...attributes}>
          {t('sider_output_form_name.roadPanel')}
        </h3>
        <FormHr sortableId={sortableId}></FormHr>
        <Form
          initialValues={{ ...initialRoadValue }}
          form={roadPanelForm}
          style={{ paddingTop: '10px' }}
        >
          <Form.Item label={t('edit_road_panel.road')} name="roadType" shouldUpdate>
            <Radio.Group buttonStyle="solid">
              <Radio.Button value="oneWayRoad">{t('edit_road_panel.single_road')}</Radio.Button>
              <Radio.Button value="twoWayRoad">{t('edit_road_panel.two_way_road')}</Radio.Button>
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
                        setChooseAngle('*');
                      } else {
                        setChooseAngle('');
                      }
                    }}
                  >
                    *
                  </Checkbox>
                </Col>
                <Col span={8}>
                  <Checkbox
                    value="0"
                    disabled={chooseAngle === '*' || chooseAngle === '270' || chooseAngle === '90'}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setChooseAngle('0');
                      } else {
                        setChooseAngle('');
                      }
                    }}
                  >
                    0
                  </Checkbox>
                </Col>
                <Col span={8}>
                  <Checkbox
                    value="90"
                    disabled={chooseAngle === '*' || chooseAngle === '0' || chooseAngle === '180'}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setChooseAngle('90');
                      } else {
                        setChooseAngle('');
                      }
                    }}
                  >
                    90
                  </Checkbox>
                </Col>
                <Col span={13}>
                  <Checkbox
                    value="180"
                    disabled={chooseAngle === '*' || chooseAngle === '270' || chooseAngle === '90'}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setChooseAngle('180');
                      } else {
                        setChooseAngle('');
                      }
                    }}
                  >
                    180
                  </Checkbox>
                </Col>
                <Col span={8}>
                  <Checkbox
                    value="270"
                    disabled={chooseAngle === '*' || chooseAngle === '0' || chooseAngle === '180'}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setChooseAngle('270');
                      } else {
                        setChooseAngle('');
                      }
                    }}
                  >
                    270
                  </Checkbox>
                </Col>
              </Row>
            </Checkbox.Group>
          </Form.Item>

          <Space size={'large'} style={{ marginBottom: '15px', overflow: 'hidden' }}>
            <Form.Item name="disabled" label={t('edit_road_panel.disabled')} shouldUpdate>
              <Switch />
            </Form.Item>

            <Form.Item name="limit" label={t('edit_road_panel.limit')}>
              <Switch />
            </Form.Item>
          </Space>

          <Space size={'large'} style={{ marginBottom: '15px', overflow: 'hidden' }}>
            <Form.Item label={t('edit_road_panel.start_point')} name="x" shouldUpdate required>
              <InputNumber />
            </Form.Item>

            <Form.Item label={t('edit_road_panel.end_point')} name="to" shouldUpdate required>
              <InputNumber />
            </Form.Item>
          </Space>

          <Form.Item style={{ textAlign: 'center' }}>
            <Button
              icon={<SaveOutlined />}
              onClick={() => saveRoad()}
              color="primary"
              variant="filled"
            >
              {t('edit_road_panel.add')}
            </Button>
          </Form.Item>
        </Form>
      </div>
    </>
  );
};

export default memo(EditRoadPanel);
