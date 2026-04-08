import React, {useEffect, useMemo, useRef, useState} from "react";
import {Input, InputRef, Space} from "antd";
import './index.less';

type CarNumInputProps = {
  autoFocus?: boolean; //是否自动聚焦
  length?: number; //密码长度
  value?: string; //值
  onChange?: (value: string) => void; // 数据改变时
}

const CarNumInput = (props : CarNumInputProps) => {

  const { length = 8, autoFocus = false, value = '', onChange } = props;
  const len = useMemo(() => Math.max(1, Math.min(length, 8)), [length]);
  const [valueCells, setValueCells] = useState<string[]>(Array.from({length: len}).map(() => ''));
  const refs = useRef<Array<InputRef| null>>([]);

  useEffect(() => {
    if(value && valueCells.join('') !== String(value)){
      const newValues = String(value).split('');
      const updatedValueCells = Array.from({length: len}).map((_, index) => newValues[index] || '');
      setValueCells(updatedValueCells);
    }
  }, [value, len]);

  useEffect(() => {
    if(valueCells.length !== len){
      const newValues= Array.from({length: len}).map((_,index) => (valueCells[index]) || '');
      setValueCells([...newValues])
      onChange?.(newValues.join(''));
    }
  }, [len])

  const selectInput = (index: number) => {
    refs.current[index]?.focus();
    let timer = setTimeout(() => {
      if(document.activeElement === refs.current[index]?.input){ // 如果window中有焦点为当前的input，则input选中文字
        refs.current[index]?.select();
      }
      clearTimeout(timer)
    }, 100)
  }

  const onInputChange = (e: React.FormEvent<HTMLInputElement>, index: number) => {
    const value = (e.target as HTMLInputElement).value;
    if(value){
      const newValues = [...valueCells];
      newValues[index] = value;
      setValueCells(newValues);
      if (index === len-1) {
        selectInput(index);
      } else {
        selectInput(index + 1);
      }
      onChange?.(newValues.join(''));
    }
  }

  const onKeyDown = (e:React.KeyboardEvent<HTMLInputElement>, index: number) => {
    const { key } = e
    if(key === "Backspace"){ // 监听后退键
      e.preventDefault();
      const newValues = [...valueCells];
      newValues[index] = '';
      setValueCells(newValues);
      onChange?.(newValues.join(''));
      if (index > 0) {
        selectInput(index - 1);
      }
    }
    if(key === 'ArrowLeft' || key === 'ArrowRight'){ //监听左右键始终选中文本
      e.preventDefault();
      selectInput(key === 'ArrowLeft' ? index - 1 : index + 1);
    }
  }

  return <div>
    <Space>
      {Array.from({ length: len }).map((_, index) => <Input
        key={`otp-${index}`}
        className={'otp-input'}
        ref={(ref) => refs.current[index] = ref}
        value={valueCells[index]}
        maxLength={1}
        onInput={(e) => onInputChange(e, index)}
        onKeyDown={(e) => onKeyDown(e, index)}
        onFocus={() => selectInput(index)}
        autoFocus={index === 0 && autoFocus}
        // 确保Form能正确控制组件
        onChange={() => {}} // 这是为了满足Input组件的要求
      />
      )}
    </Space>
  </div>
}

export default CarNumInput
