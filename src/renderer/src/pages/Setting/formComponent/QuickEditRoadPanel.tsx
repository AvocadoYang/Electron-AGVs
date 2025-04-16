import { Button, Checkbox, Col, Flex, Form, message, Radio, Row, Space, Switch } from 'antd';
import { useTranslation } from 'react-i18next';
import FormHr from '../utils/FormHr';
import { useState } from 'react';
import { useAtom } from 'jotai';
import { IsEditingQuickRoads, QuickRoadsArray } from '../utils/settingJotai';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import client from '@renderer/api/axiosClient';
import { errorHandler } from '@renderer/utils/utils';
import { ErrorResponse } from '@renderer/utils/globalType';

type RoadFormData = {
  validYawList?: string | number[];
  disabled: boolean;
  limit: boolean;
  roadType: string;
  roadArr: string[];
};

const QuickEditRoadPanel: React.FC<{
  sortableId: string;
  attributes: import('@dnd-kit/core').DraggableAttributes;
  listeners: import('@dnd-kit/core/dist/hooks/utilities').SyntheticListenerMap | undefined;
}> = ({ attributes, listeners }) => {
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();
  const { t } = useTranslation();
  const [chooseAngle, setChooseAngle] = useState<string>('');
  const [quickRoad, setQuickRoad] = useAtom(IsEditingQuickRoads);
  const [quickRoadArr, setQuickRoadArr] = useAtom(QuickRoadsArray);
  const queryClient = useQueryClient();

  const saveRoadMutation = useMutation({
    mutationFn: (payload: RoadFormData) => {
      return client.post('api/setting/save-quick-edit-road', payload);
    },
    onSuccess: () => {
      void messageApi.success('success');
      queryClient.refetchQueries({ queryKey: ['map'] });
      setQuickRoadArr([]);
      setQuickRoad(false);
    },
    onError: (e: ErrorResponse) => errorHandler(e, messageApi)
  });

  const handleEditing = () => {
    setQuickRoad(!quickRoad);
  };

  const submit = (formData: RoadFormData) => {
    console.log(formData);

    const payload: RoadFormData = {
      ...formData,
      disabled: formData.disabled === undefined ? false : true,
      limit: formData.limit === undefined ? false : true,
      roadArr: quickRoadArr
    };

    saveRoadMutation.mutate(payload);
  };

  return (
    <>
      {contextHolder}
      <div style={{ width: '23em' }}>
        <h3 className="drop_button_style" {...listeners} {...attributes}>
          {t('quick_edit_road_panel.title')}
        </h3>
        <FormHr></FormHr>
        <Form onFinish={submit} form={form} style={{ fontWeight: 'bold' }}>
          <Form.Item label={t('edit_road_panel.road')} name="roadType" shouldUpdate>
            <Radio.Group buttonStyle="solid">
              <Radio.Button value="oneWayRoad">{t('edit_road_panel.single_road')}</Radio.Button>
              <Radio.Button value="twoWayRoad">{t('edit_road_panel.two_way_road')}</Radio.Button>
            </Radio.Group>
          </Form.Item>

          <Form.Item name="validYawList" label={t('edit_road_panel.yaw')} required>
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

          <Flex vertical gap="middle">
            <Button onClick={() => handleEditing()}>start editing</Button>
            {quickRoad ? 'please start click points to connect ' : []}
          </Flex>

          {quickRoadArr.toString()}
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form>
      </div>
    </>
  );
};

export default QuickEditRoadPanel;
