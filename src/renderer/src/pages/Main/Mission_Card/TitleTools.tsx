import { memo, useState } from 'react';
import { SearchOutlined, DownOutlined, UpOutlined } from '@ant-design/icons';
import { ConfigProvider, Input, Select, SelectProps } from 'antd';
import { useAtomValue } from 'jotai';
import { darkMode } from '@renderer/utils/gloable';

const handleChange = (value: string | string[]) => {
  console.log(`Selected: ${value}`);
};

const options: SelectProps['options'] = [];

for (let i = 10; i < 36; i++) {
  options.push({
    value: i.toString(36) + i,
    label: i.toString(36) + i
  });
}

const TitleTools = () => {
  const isDark = useAtomValue(darkMode);
  const [isDrop, setIsDrop] = useState(false);
  return (
    <>
      <span className={`card-wrap-title ${isDark ? 'dark-mode-title' : ''}`}>
        Missions
        {isDrop ? (
          <UpOutlined className="drop-icon" onClick={() => setIsDrop(false)} />
        ) : (
          <DownOutlined className="drop-icon" onClick={() => setIsDrop(true)} />
        )}
      </span>
      {isDrop ? (
        <ConfigProvider
          theme={{
            components: {
              Input: {
                activeBorderColor: `${isDark ? '#ff9900' : '#1677ff'}`,
                hoverBorderColor: `${isDark ? '#ff9900' : '#1677ff'}`
              },
              Select: {
                activeBorderColor: `${isDark ? '#ff9900' : '#1677ff'}`,
                hoverBorderColor: `${isDark ? '#ff9900' : '#1677ff'}`
              }
            }
          }}
        >
          <Select
            mode="multiple"
            placeholder="AMR category"
            onChange={handleChange}
            style={{ width: '82%' }}
            options={options}
          />
          <Input
            size="middle"
            placeholder="Search AMR"
            suffix={<SearchOutlined />}
            style={{ width: '82%', margin: '3% 0 3% 0' }}
          />
        </ConfigProvider>
      ) : (
        []
      )}
    </>
  );
};

export default memo(TitleTools);
