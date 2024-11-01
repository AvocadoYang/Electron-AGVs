import { Form, FormInstance, Input, Select, Switch } from 'antd';
import { Dispatch, FC, SetStateAction, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { nanoid } from 'nanoid';
import { LayerType } from '~/api/useLocation';
import usePallet from '~/api/usePallet';

const Wrapper = styled.div`
  border: 1px solid #8b8b8b;
  width: 100%;
  max-height: 70vh;
  overflow-y: scroll;
`;

const Box = styled.div`
  padding: 1em;
`;

const defaultValue = {
  isEdit: false,
};

const LayerForm: FC<{
  locId: string;
  form: FormInstance<unknown>;
  layer: LayerType[];
  setIsEditLayer: Dispatch<SetStateAction<boolean>>;
}> = ({ form, locId, layer, setIsEditLayer }) => {
  const { t } = useTranslation();
  const { data: pallet } = usePallet();

  // 如果以後要限制有貨時有沒有棧版之類的就需要它 之後有需求在設定
  // const [fState, setFState] = useState<{ [key: string]: unknown }>({});

  const palletOption = pallet?.map((v) => ({
    value: v.id,
    label: v.name,
  }));

  const clearCargoField = (index: number) => {
    const level = index;
    form.setFieldValue(`cargoName${level}`, null);
    // form.setFieldValue(`pallet${level}`, null);
  };

  const userHasChangeData = () => {
    setIsEditLayer(true);
  };

  useEffect(() => {
    if (!layer) return;
    layer.forEach((L, i) => {
      const level = i;
      form.setFieldValue(`hasCargo${level}`, L[level].cargo?.hasCargo);
      form.setFieldValue(`levelName${level}`, L[level]?.levelName || null);
      form.setFieldValue(`pallet${level}`, L[level]?.pallet.id || null);
      form.setFieldValue(`cargoName${level}`, L[level]?.cargo?.name || null);

      form.setFieldValue(`disable${level}`, L[level]?.disable || false);
      form.setFieldValue(`cargo_limit${level}`, L[level]?.cargo_limit || 0);
    });
  }, [form, layer]);

  return (
    <Wrapper>
      <Form
        form={form}
        labelCol={{ span: 5 }}
        wrapperCol={{ span: 14 }}
        layout="horizontal"
        size="large"
        onValuesChange={() => userHasChangeData()}
        title={` ${locId}的任務設定 `}
        initialValues={defaultValue}
      >
        {layer.map((_L, i) => {
          const level = i;
          return (
            <Box key={nanoid()}>
              <h2>{`第${level}格`}</h2>
              <Form.Item
                label={`${t('shelf_column_name')}`}
                name={`levelName${level}`}
              >
                <Input />
              </Form.Item>

              <Form.Item label={t('shelf_disable')} name={`disable${level}`}>
                <Switch />
              </Form.Item>

              <Form.Item label="有無貨" name={`hasCargo${level}`}>
                <Switch
                  onChange={(v) => (v === false ? clearCargoField(i) : [])}
                  checkedChildren="有貨"
                  unCheckedChildren="沒貨"
                />
              </Form.Item>

              <Form.Item label="貨名" name={`cargoName${level}`}>
                <Input
                // disabled={fState[`cargoName${level}`] as boolean}
                />
              </Form.Item>

              <Form.Item label="cargo limit" name={`cargo_limit${level}`}>
                <Input />
              </Form.Item>

              <Form.Item label="棧板類型" name={`pallet${level}`}>
                <Select
                  options={palletOption}
                  // disabled={fState[`pallet${level}`] as boolean}
                />
              </Form.Item>
            </Box>
          );
        })}
      </Form>
    </Wrapper>
  );
};

export default LayerForm;
