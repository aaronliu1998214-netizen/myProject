import { getOrgTreeByOrgCode } from '@/services';
import React, { forwardRef, useEffect, useImperativeHandle, useState } from 'react';
import styles from './VarList.module.less';

const makeEditorElement = ({ orgName, orgCode }: { orgName: string; orgCode: string }) => {
  const editorElement = document.createElement('span');
  editorElement.innerText = orgName;
  editorElement.style.display = 'inline-block';
  editorElement.contentEditable = 'false';
  editorElement.style.backgroundColor = '#e6f4ff';
  editorElement.style.color = '#1677ff';
  editorElement.style.border = '1px solid #91caff';
  editorElement.style.padding = '2px 8px';
  editorElement.setAttribute('data-editor-code', `ifdept('${orgCode}')`);
  return editorElement;
};

type Props = {
  formTitle: string;
  departments?: any;
  lastRange: Range | undefined;
  setLastRange: React.Dispatch<React.SetStateAction<Range | undefined>>;
  setExampleContent: (content: string) => void;
};

export const VarList = forwardRef((props: Props, ref) => {
  type VarType = keyof typeof varValueSelectMap;

  const [varValueSelectMap, setVarValueSelectMap] = useState<any>({});
  const [activeVarType, setActiveVarType] = React.useState<VarType>('无');
  const [activeVarValue, setActiveVarValue] = React.useState<string>('');
  const { formTitle,departments, lastRange, setLastRange, setExampleContent } = props;

  const reset = () => {
    setActiveVarType('无');
  };

  const loadData = async () => {
    // let orgCode = JSON.parse(sessionStorage.getItem('user') || '').orgCode;
    // const params = {
    //   orgCode: orgCode || '',
    // };
    // const res = await getOrgTreeByOrgCode(params);
    // if (!res.success) return;
    // const result = res.data?.children
    // setVarValueSelectMap({
    //   支局: result.map((item: any) => {
    //     return { orgName: item.orgName, orgCode: item.orgCode };
    //   })
    // });
    if(departments){
      setVarValueSelectMap({
        支局: departments.map((item: any) => {
          return { orgName: item.label, orgCode: item.value };
        })
      })
    }
  };

  useEffect(() => {
    loadData();
  }, [departments]);

  useImperativeHandle(ref, () => ({
    reset: reset,
  }));

  return (
    <div className={styles.container}>
      <div className={styles.varTypeList}>
        {Object.keys(varValueSelectMap).map((varType) => {
          return (
            <div
              key={varType}
              className={`${styles.varItem} ${varType === activeVarType ? styles.active : ''}`}
              onClick={async () => {
                setExampleContent('');
                setActiveVarType(varType as VarType);
              }}
            >
              {varType}
            </div>
          );
        })}
      </div>
      <div className={styles.varValueList}>
        {varValueSelectMap[activeVarType] &&
          varValueSelectMap[activeVarType].map((varValueObj:any) => {
            return (
              <div
                key={varValueObj.orgName}
                onClick={() => {
                  setExampleContent('');
                  setActiveVarValue(varValueObj.orgName);
                  if (formTitle === '详情') return;
                  const el = makeEditorElement(varValueObj);
                  if (!lastRange) return;
                  const range = lastRange.cloneRange();
                  range.deleteContents();
                  range.insertNode(el);
                  range.setStartAfter(el);
                  range.collapse(true);
                  const selection = window.getSelection();
                  selection?.removeAllRanges();
                  selection?.addRange(range);
                  setLastRange(range);
                }}
                className={`${styles.varItem} ${
                  varValueObj.orgName === activeVarValue ? styles.active : ''
                }`}
              >
                {varValueObj.orgName}
              </div>
            );
          })}
      </div>
    </div>
  );
});
