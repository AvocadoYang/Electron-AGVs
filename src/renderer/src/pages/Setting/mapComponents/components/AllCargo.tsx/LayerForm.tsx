import { Form, FormInstance, Input, Switch, Typography } from 'antd';
import { Dispatch, FC, SetStateAction, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { nanoid } from 'nanoid';
import { LayerType } from '@renderer/sockets/useCargoInfo';

const prefixLevelName = (word: string | null | undefined) => {
  if (!word) return null;
  const parts = word.split('-');
  parts.pop();
  return parts.join('-');
};

const { Title } = Typography;

const LayerForm: FC<{
  locId: string;
  form: FormInstance<unknown>;
  layer: LayerType[];
  setIsEditLayer: Dispatch<SetStateAction<boolean>>;
}> = ({ form, locId, layer, setIsEditLayer }) => {
  const { t } = useTranslation();

  const clearCargoField = (index: number) => {
    form.setFieldValue(`cargoName${index}`, null);
  };

  const userHasChangeData = () => {
    setIsEditLayer(true);
  };

  useEffect(() => {
    if (!layer) return;
    layer.forEach((L, i) => {
      const levelName = prefixLevelName(L[i]?.levelName);
      form.setFieldsValue({
        [`hasCargo${i}`]: L[i].cargo?.hasCargo,
        [`levelName${i}`]: levelName,
        [`disable${i}`]: L[i]?.disable || false,
        [`cargo_limit${i}`]: L[i]?.cargo_limit || 0
      });
    });
  }, [form, layer]);

  return (
    <div
      style={{
        width: '50%',
        background: '#fff',
        padding: '24px',
        borderRadius: 8,
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
        maxHeight: '70vh',
        overflowY: 'auto'
      }}
    >
      <Form
        form={form}
        layout="vertical"
        size="large"
        onValuesChange={userHasChangeData}
        initialValues={{ isEdit: false }}
      >
        <Title level={3} style={{ marginBottom: '24px', color: '#1890ff' }}>
          {t('shelf.layer_form.layers')}
        </Title>
        {layer.map((_, i) => (
          <div
            key={nanoid()}
            style={{
              marginBottom: '24px',
              padding: '16px',
              background: '#f5f5f5',
              borderRadius: 6
            }}
          >
            <Title
              level={4}
              style={{ marginBottom: '16px' }}
            >{`${t('shelf.layer_form.level')} ${i + 1}`}</Title>
            <Form.Item label={t('shelf.layer_form.column_name')} name={`levelName${i}`}>
              <Input placeholder={t('shelf.layer_form.enter_level_name')} />
            </Form.Item>
            <Form.Item
              label={t('shelf.layer_form.disable')}
              name={`disable${i}`}
              valuePropName="checked"
            >
              <Switch checkedChildren="On" unCheckedChildren="Off" />
            </Form.Item>
            <Form.Item
              label={t('shelf.layer_form.has_cargo')}
              name={`hasCargo${i}`}
              valuePropName="checked"
            >
              <Switch
                onChange={(v) => !v && clearCargoField(i)}
                checkedChildren={t('shelf.layer_form.has_cargo')}
                unCheckedChildren={t('shelf.layer_form.no_cargo')}
              />
            </Form.Item>
            <Form.Item label={t('edit_road_panel.limit')} name={`cargo_limit${i}`}>
              <Input type="number" min={0} placeholder="0" />
            </Form.Item>
          </div>
        ))}
      </Form>
    </div>
  );
};

export default LayerForm;
