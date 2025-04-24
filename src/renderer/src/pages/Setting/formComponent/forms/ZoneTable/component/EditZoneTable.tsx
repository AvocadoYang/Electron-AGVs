import {
  Badge,
  Button,
  Checkbox,
  ColorPicker,
  ConfigProvider,
  Flex,
  Form,
  Input,
  Modal,
  Select,
  SelectProps,
  Space,
  Tag,
  message,
  InputNumber
} from 'antd';
import { FC, memo, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ZoneTableData } from '../../antd';
import useAmrName from '@renderer/api/useAmrName';
import { borderColor } from '@renderer/pages/Setting/utils/utils';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import client from '@renderer/api/axiosClient';
import { ErrorResponse } from '@renderer/utils/globalType';
import { errorHandler } from '@renderer/utils/utils';
import useMap from '@renderer/api/useMap';

type FormType = {
  all_forbidden: boolean | undefined;
  not_forbidden: boolean | undefined;

  category: string[] | undefined;
  color: string;
  endX: number;
  limitNum: number;
  endY: number;
  forbidden: string[] | undefined;
  hight_limit: number;
  name: string;
  speed_limit: number;
  startX: number;
  startY: number;
  id?: string;
};

type FormKey =
  | 'name'
  | 'all_forbidden'
  | 'not_forbidden'
  | 'category'
  | 'color'
  | 'endX'
  | 'endY'
  | 'forbidden'
  | 'hight_limit'
  | 'speed_limit'
  | 'startX'
  | 'startY'
  | 'limitNum';

const zoneType: SelectProps['options'] = [
  { value: '減速區' },
  { value: '限高區' },
  { value: '禁止區' }
];
type TagRender = SelectProps['tagRender'];

const EditZoneTable: FC<{
  setEditingKey: React.Dispatch<React.SetStateAction<string | null>>;
  editingKey: string;
  oldData: ZoneTableData | null;
  sortableId: string;
}> = ({ setEditingKey, editingKey, oldData, sortableId }) => {
  const [editZoneForm] = Form.useForm();
  const [allVehicleForbidden, setAllVehicleForbidden] = useState(false);
  const [notVehicleForbidden, setNotVehicleForbidden] = useState(false);
  const [isHint, setIsHint] = useState(false);
  const [syncForm, setSyncForm] = useState<FormType | null>(null);
  const [zoneTags, setZoneTags] = useState<string[] | undefined>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [messageApi, contextHolders] = message.useMessage();
  const { data: allAmr } = useAmrName();
  const { data: mapData } = useMap();
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  const AmrsID: SelectProps['options'] = allAmr?.amrs.map((amr) => {
    return { value: amr.amrId };
  });

  const saveMutation = useMutation({
    mutationFn: (payload: FormType) => {
      return client.post('api/setting/edit-edit-zone', payload);
    },
    onSuccess: () => {
      void messageApi.success('success');
      queryClient.refetchQueries({ queryKey: ['map'] });
    },
    onError: (e: ErrorResponse) => errorHandler(e, messageApi)
  });

  const save = () => {
    if (isHint) {
      messageApi.warning(t('edit_zone_panel.waring.tag_not_yet_setting'));
      return;
    }
    const data = editZoneForm.getFieldsValue() as FormType;
    console.log(data);

    const { name, startX, startY, endX, endY, color } = data;
    console.log(data);
    if (!name || name.trim() === '') {
      messageApi.warning(t('edit_zone_panel.waring.name_empty_error'));
      return;
    }
    if (!startX || !startY || !endX || !endY) {
      messageApi.warning(t('edit_zone_panel.waring.invalid_frame'));
      return;
    }
    if (!color) {
      messageApi.warning(t('edit_zone_panel.waring.color_error'));
      return;
    }
    const exists = mapData!.zones.some((zone) => {
      return zone.name.trim() === name.trim() && oldData?.id !== zone.id;
    });
    if (exists) {
      messageApi.warning(t('edit_zone_panel.waring.name_duplicated_error'));
      return;
    }

    let forbiddenCars: string[] = [];

    if (data.all_forbidden === undefined) {
      forbiddenCars = oldData?.tagSetting.forbidden_car as string[];
    }

    if (data.all_forbidden) {
      forbiddenCars = ['*'];
    }

    if (data.not_forbidden) {
      forbiddenCars = [];
    }

    if (
      data.all_forbidden == false &&
      data.not_forbidden == false &&
      data.forbidden &&
      data.forbidden.length > 0
    ) {
      forbiddenCars = data.forbidden;
    }

    const payload: FormType = {
      ...data,
      speed_limit: data.speed_limit
        ? data.speed_limit
        : (oldData?.tagSetting.speed_limit as number),
      hight_limit: data.hight_limit
        ? data.hight_limit
        : (oldData?.tagSetting.hight_limit as number),
      forbidden: forbiddenCars,
      id: editingKey,
      color: data.color
    };
    // console.log(payload)
    saveMutation.mutate(payload);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const tagRender: TagRender = (props) => {
    const { label, closable, onClose } = props;
    const onPreventMouseDown = (event: React.MouseEvent<HTMLSpanElement>) => {
      event.preventDefault();
      event.stopPropagation();
    };
    return (
      <Tag
        color={'cyan'}
        onMouseDown={onPreventMouseDown}
        closable={closable}
        onClose={onClose}
        style={{ marginInlineEnd: 4 }}
      >
        {label}
      </Tag>
    );
  };

  const handleSyneForm = (key: FormKey, value: unknown) => {
    if (!syncForm) return;
    setSyncForm((prev) => {
      if (!prev) return null;
      return {
        all_forbidden: key === 'all_forbidden' ? (value as boolean) : prev?.all_forbidden,
        not_forbidden: key === 'not_forbidden' ? (value as boolean) : prev?.not_forbidden,
        category: key === 'category' ? (value as string[]) : prev?.category,
        color: key === 'color' ? (value as string) : prev?.color,
        endX: key === 'endX' ? (value as number) : prev?.endX,
        endY: key === 'endY' ? (value as number) : prev?.endY,
        forbidden: key === 'forbidden' ? (value as string[]) : prev?.forbidden,
        hight_limit: key === 'hight_limit' ? (value as number) : prev?.hight_limit,
        limitNum: key === 'limitNum' ? (value as number) : prev?.limitNum,
        name: key === 'name' ? (value as string) : prev?.name,
        speed_limit: key === 'speed_limit' ? (value as number) : prev?.speed_limit,
        startX: key === 'startX' ? (value as number) : prev?.startX,
        startY: key === 'startY' ? (value as number) : prev?.startY
      };
    });
  };

  useEffect(() => {
    if (!syncForm) return;
    const { category, forbidden, speed_limit, hight_limit, all_forbidden, not_forbidden } =
      syncForm;

    if (category?.length === 0) return setIsHint(false);

    if (
      category?.includes('禁止區') &&
      forbidden?.length === 0 &&
      !all_forbidden &&
      !not_forbidden
    ) {
      setIsHint(true);
      return;
    }

    if (category?.includes('減速區') && (speed_limit === 0 || speed_limit === null)) {
      setIsHint(true);
      return;
    }

    if (category?.includes('限高區') && (hight_limit === 0 || hight_limit === null)) {
      setIsHint(true);
      return;
    }
    setIsHint(false);
  }, [syncForm]);

  useEffect(() => {
    if (!oldData) return;
    setZoneTags(oldData.category);

    const forbiddenCar = oldData.tagSetting.forbidden_car as string[];

    if (!forbiddenCar || forbiddenCar.length === 0) {
      setNotVehicleForbidden(true);
      editZoneForm.setFieldValue('not_forbidden', true);
    }

    if (forbiddenCar && forbiddenCar?.includes('*')) {
      setAllVehicleForbidden(true);
      editZoneForm.setFieldValue('all_forbidden', true);
    }
    editZoneForm.setFieldValue('name', oldData.name);
    editZoneForm.setFieldValue('color', oldData.backgroundColor);
    editZoneForm.setFieldValue('startX', oldData.startPoint.startX);
    editZoneForm.setFieldValue('startY', oldData.startPoint.startY);
    editZoneForm.setFieldValue('endX', oldData.endPoint.endX);
    editZoneForm.setFieldValue('endY', oldData.endPoint.endY);
    editZoneForm.setFieldValue('category', oldData.category);
    editZoneForm.setFieldValue('hight_limit', oldData.tagSetting.hight_limit);
    editZoneForm.setFieldValue('speed_limit', oldData.tagSetting.speed_limit);
    editZoneForm.setFieldValue('forbidden', oldData.tagSetting.forbidden_car);
    editZoneForm.setFieldValue('limitNum', oldData.tagSetting.limitNum);

    setSyncForm({
      all_forbidden: forbiddenCar?.includes('*'),
      not_forbidden: forbiddenCar?.length === 0,
      category: oldData.category,
      color: oldData.backgroundColor,
      endX: oldData.endPoint.endX,
      endY: oldData.endPoint.endY,
      forbidden: oldData.tagSetting.forbidden_car as string[],
      hight_limit: oldData.tagSetting.hight_limit as number,
      limitNum: oldData.tagSetting.hight_limit as number,
      name: oldData.name,
      speed_limit: oldData.tagSetting.speed_limit as number,
      startX: oldData.startPoint.startX,
      startY: oldData.startPoint.startY
    });
  }, [oldData]);

  if (!oldData) return;
  return (
    <>
      {contextHolders}
      <Flex gap="middle" justify="flex-start" align="start" vertical>
        <Space size={'middle'}>
          <Button color="danger" variant="filled" onClick={() => setEditingKey(null)}>
            {t('utils.cancel')}
          </Button>
          <Button color="primary" variant="filled" onClick={() => save()}>
            {t('utils.save')}
          </Button>
        </Space>
        <Form layout="vertical" form={editZoneForm} style={{ fontWeight: 'bold' }}>
          <Form.Item label={t('edit_zone_panel.name')} name="name" style={{ marginBottom: 16 }}>
            <Input
              // value={oldData.name}
              type="string"
              style={{ width: 150 }}
              placeholder="請輸入區域名稱"
              onChange={(e) => handleSyneForm('name', e.target.value)}
            />
          </Form.Item>
          <Space size={'large'} style={{ marginBottom: '15px', overflow: 'hidden' }}>
            <div>
              <Form.Item
                label={
                  <Badge key={'geekblue1'} color={'geekblue'} text={t('edit_zone_panel.start_x')} />
                }
                name="startX"
                style={{ marginBottom: 16 }}
              >
                <Input onChange={(e) => handleSyneForm('startX', e.target.value)} type="number" />
              </Form.Item>
              <Form.Item
                label={<Badge key={'red1'} color={'red'} text={t('edit_zone_panel.end_x')} />}
                name="endX"
                style={{ marginBottom: 16 }}
              >
                <Input
                  onChange={(e) => handleSyneForm('endX', e.target.value)}
                  //  value={oldData.endPoint.endX}
                  type="number"
                />
              </Form.Item>
            </div>
            <div>
              <Form.Item
                label={
                  <Badge key={'geekblue2'} color={'geekblue'} text={t('edit_zone_panel.start_y')} />
                }
                name="startY"
                style={{ marginBottom: 16 }}
              >
                <Input
                  //value={oldData.startPoint.startY}
                  onChange={(e) => handleSyneForm('startY', e.target.value)}
                  type="number"
                />
              </Form.Item>

              <Form.Item
                label={<Badge key={'red2'} color={'red'} text={t('edit_zone_panel.end_y')} />}
                name="endY"
                style={{ marginBottom: 16 }}
              >
                <Input
                  //value={oldData.endPoint.endY}
                  onChange={(e) => handleSyneForm('endY', e.target.value)}
                  type="number"
                />
              </Form.Item>
            </div>
          </Space>
          <Form.Item
            label={t('edit_zone_panel.category')}
            name="category"
            style={{ marginBottom: `${zoneTags?.length ? '5px' : '20px'}` }}
          >
            <Select
              // value={oldData.category}
              placeholder={'請選擇區域屬性'}
              mode="multiple"
              tagRender={tagRender}
              style={{ width: '100%' }}
              options={zoneType}
              onChange={(tags) => {
                handleSyneForm('category', tags);
                setZoneTags(tags);
              }}
            />
          </Form.Item>
          {zoneTags?.length ? (
            <Form.Item style={{ textAlign: 'left', marginBottom: '8px' }}>
              <Space>
                {isHint ? <p style={{ color: 'red' }}>{t('edit_zone_panel.hint')}</p> : <p>✅</p>}
                <ConfigProvider
                  theme={{
                    components: {
                      Button: {
                        defaultBorderColor: 'orange'
                      }
                    }
                  }}
                >
                  <Button onClick={() => setIsModalOpen(true)} size="small">
                    {t('edit_zone_panel.tag_setting')}
                  </Button>
                </ConfigProvider>
              </Space>
            </Form.Item>
          ) : (
            []
          )}
          <Form.Item
            getValueFromEvent={(color) => {
              if (color && color.toRgb) {
                const { r, g, b } = color.toRgb();
                return `rgba(${r}, ${g}, ${b}, 0.05)`;
              }
              return color;
            }}
            label={t('edit_zone_panel.color')}
            name="color"
          >
            <ColorPicker
              showText
              onChange={(e) => {
                const { r, g, b } = e.toRgb();
                handleSyneForm('color', `rgba(${r}, ${g}, ${b} , 0.05)`);
              }}
            />
          </Form.Item>

          <Modal
            title={t('edit_zone_panel.tag_setting')}
            open={isModalOpen}
            maskClosable={false}
            onOk={handleCancel}
            onCancel={handleCancel}
            cancelButtonProps={{ style: { display: 'none' } }}
            mask={false}
            style={{
              borderTop: `5px solid ${borderColor(sortableId)}`,
              borderRadius: '11px'
              // display: `${isModalOpen ? '' : 'none'}`
            }}
          >
            <hr style={{ border: '1px solid black', marginBottom: '8px' }}></hr>
            {zoneTags?.includes('減速區') ? (
              <Form.Item
                name="speed_limit"
                label={`${t('edit_zone_panel.highest_speed')}: (${t('edit_zone_panel.necessary')}) `}
                rules={[{ required: true }]}
              >
                <InputNumber
                  addonAfter="m/s"
                  onChange={(e) => handleSyneForm('speed_limit', e)}
                  type="number"
                  min={0.8}
                  max={1.5}
                  placeholder="0.8~1.5"
                  style={{ width: '50%' }}
                />
              </Form.Item>
            ) : (
              []
            )}
            {zoneTags?.includes('限高區') ? (
              <Form.Item
                name="hight_limit"
                label={`${t('edit_zone_panel.hight_limit')}: (${t('edit_zone_panel.necessary')})`}
                rules={[{ required: true }]}
              >
                <InputNumber
                  addonAfter="mm"
                  onChange={(e) => handleSyneForm('hight_limit', e)}
                  type="number"
                  placeholder="請輸入高度限制"
                  style={{ width: '50%' }}
                />
              </Form.Item>
            ) : (
              []
            )}
            {zoneTags?.includes('限制區') ? (
              <Form.Item
                name="limitNum"
                label={`${t('edit_zone_panel.limit_count')} `}
                rules={[{ required: true }]}
              >
                <InputNumber
                  onChange={(e) => {
                    console.log(e);
                    handleSyneForm('limitNum', e);
                  }}
                  type="number"
                  placeholder={t('edit_zone_panel.placeholder.limit')}
                  style={{ width: '50%' }}
                />
              </Form.Item>
            ) : (
              []
            )}
            {zoneTags?.includes('禁止區') ? (
              <>
                <Space>
                  <Form.Item valuePropName="checked" name="not_forbidden" style={{ margin: '0' }}>
                    <Checkbox
                      checked={notVehicleForbidden}
                      disabled={allVehicleForbidden}
                      onChange={(e) => {
                        setNotVehicleForbidden(e.target.checked);
                        handleSyneForm('not_forbidden', e.target.checked);
                      }}
                    >{`${t('edit_zone_panel.not_vehicle_forbidden')}`}</Checkbox>
                  </Form.Item>
                  <Form.Item valuePropName="checked" name="all_forbidden" style={{ margin: '0' }}>
                    <Checkbox
                      checked={allVehicleForbidden}
                      disabled={notVehicleForbidden}
                      onChange={(e) => {
                        handleSyneForm('all_forbidden', e.target.checked);
                        setAllVehicleForbidden(e.target.checked);
                      }}
                    >{`${t('edit_zone_panel.all_vehicle_forbidden')}`}</Checkbox>
                  </Form.Item>
                </Space>
                <Form.Item name="forbidden" label={`${t('edit_zone_panel.forbidden_vehicle')}: `}>
                  <Select
                    placeholder={'請選擇限制進入車輛'}
                    disabled={allVehicleForbidden || notVehicleForbidden}
                    mode={'multiple'}
                    tagRender={tagRender}
                    onChange={(e) => handleSyneForm('forbidden', e)}
                    style={{ width: '100%' }}
                    options={AmrsID}
                  />
                </Form.Item>
              </>
            ) : (
              []
            )}
          </Modal>
        </Form>
      </Flex>
    </>
  );
};

export default memo(EditZoneTable);
