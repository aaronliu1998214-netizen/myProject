import { Editor } from '@/components/Editor'
import React, { useRef } from 'react';
import { getSecondLevel, SystemIndicatorTotalQuery } from './data'
import { PageContainer } from '@ant-design/pro-components';

const EditerComp = () => {
  const editorRef = useRef<any>(null);

  return (
    <PageContainer>
      <Editor
        formTitle={'新增'}
        ref={editorRef}
        departments={[]}
        getSystemIndicatorItemType={getSecondLevel}
        getSystemIndicatorItem={SystemIndicatorTotalQuery}
        extraParams={{ indicatorLevel: 'indicatorLevel' }}
        type={'organization'}
      />
    </PageContainer>
  )



}

export default EditerComp