import React from 'react';
import CarNumInput from './CarNumInput';
import { Form, Button } from 'antd';



export default function Index() {
  const [formRef] = Form.useForm();

  return (
    <div>
      <h1 style={{ marginTop: 20 }}>嵌入表单使用：</h1>
      <Form initialValues={{cartNum:  '粤B12345'}} form={formRef}>
        <Form.Item label="请输入车牌号" name='cartNum' valuePropName="value" trigger="onChange">
          <CarNumInput autoFocus={true}/>
        </Form.Item>
      </Form>

      <Button 
      onClick={() => { 
        console.log(formRef.getFieldsValue());
        
      }}
      >提交</Button>
    </div>
  );
}



