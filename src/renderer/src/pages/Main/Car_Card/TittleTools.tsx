import { memo, useCallback, useEffect, useState } from 'react';
import { DownOutlined, UpOutlined } from '@ant-design/icons';
import { ConfigProvider, Select, SelectProps } from 'antd';
import { useAtomValue } from 'jotai';
import { darkMode } from '@renderer/utils/gloable';
import useName from '@renderer/api/useAmrName';
import { DefaultOptionType } from 'antd/es/select';

const options: SelectProps['options'] = [];

for (let i = 10; i < 36; i++) {
  options.push({
    value: i.toString(36) + i,
    label: i.toString(36) + i
  });
}

const TittleTools: React.FC<{
  setSelectedOption: React.Dispatch<SelectProps['options']>;
}> = ({ setSelectedOption }) => {
  const isDark = useAtomValue(darkMode);
  const [selectOption, setSelectOption] = useState<SelectProps['options']>([]);
  const { data: names } = useName();
  const [isDrop, setIsDrop] = useState(false);

  useEffect(() => {
    if (!names) return;
    const AMRCategories = new Set<string>();
    for (let name of names) {
      const { id } = name;
      const category = id.split('-').slice(0, 3).join('-');
      AMRCategories.add(category);
    }
    const allAMRCategory = [...AMRCategories].map((amrCategory) => {
      return { value: amrCategory, label: amrCategory };
    });
    setSelectOption(allAMRCategory as unknown as DefaultOptionType[]);
  }, [names]);

  const handleChange = useCallback(
    (value: string[]) => {
      setSelectedOption(value.map((amrCategory) => ({ value: amrCategory, label: amrCategory })));
    },
    [setSelectOption]
  );

  return (
    <>
      <span
        className={`card-wrap-title ${isDark ? 'dark-mode-title' : ''}`}
        onClick={() => setIsDrop(!isDrop)}
      >
        AMRs
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
            style={{ width: '82%', margin: '3% 0 3% 0' }}
            options={selectOption}
            onMouseDown={(e) => e.preventDefault()}
            onPopupScroll={(e) => {
              e.stopPropagation();
            }}
            onDropdownVisibleChange={(open) => {
              if (open) {
                document.body.style.overflow = 'hidden';
              } else {
                document.body.style.overflow = 'auto';
              }
            }}
          />
          {/* <Input
            size="middle"
            placeholder="Search AMR"
            suffix={<SearchOutlined />}
            style={{ width: '82%', margin: '3% 0 3% 0' }}
          /> */}
        </ConfigProvider>
      ) : (
        []
      )}
    </>
  );
};

export default memo(TittleTools);
