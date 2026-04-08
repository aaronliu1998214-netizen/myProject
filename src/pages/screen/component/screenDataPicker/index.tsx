import React, { useState } from 'react';
import type { DatePickerProps, TimePickerProps } from 'antd';
import { DatePicker, Select } from 'antd';
import pickerIcon from '@/assets/screen/pickerIcon.png';
import './index.less'


const { Option } = Select;

type PickerType = 'date' | 'week' | 'month' | 'quarter' | 'year';

const { RangePicker } = DatePicker;

interface IPprops {
  onChange: (val: any) => void;
}

const PickerWithType = ({
  type,
  onChange,
}: {
  type: PickerType;
  onChange: TimePickerProps['onChange'] | DatePickerProps['onChange'];
}) => {
   return <RangePicker 
          className='custom_picker' 
          picker={type} 
          onChange={onChange} 
          // bordered={false}
          style={{ backgroundColor: '#6e66661a', color: "#ffffff", border: '0.5px solid #ffffff33' }}
          popupClassName='popupClassName_picker'
          popupStyle={{   
            backgroundColor: '#ffffff1a', 
          }}
          />;
};

const ScreenDataPicker: React.FC<IPprops> = ({ onChange }) => {
  const [type, setType] = useState<PickerType>('date');

  return (
    <div className="custom_data_picker">
      <PickerWithType
        type={type}
        onChange={(value: any) => {
          onChange(value);
        }}
      />
      <Select
        aria-label="Picker Type"
        value={type}
        onChange={setType}
        suffixIcon={<img src={pickerIcon} />}
        className="custom_select"
        popupMatchSelectWidth={false}
        popupClassName='popupClassName_select'
      >
        <Option value="date">日</Option>
        <Option value="week">周</Option>
        <Option value="month">月</Option>
        <Option value="quarter">季</Option>
        <Option value="year">年</Option>
      </Select>
    </div>
  );
};

export default ScreenDataPicker;
