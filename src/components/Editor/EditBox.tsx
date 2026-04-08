import React, { useRef } from 'react';
import styles from './EditBox.module.less';

type Props = {
  formTitle: string;
  updateLastRange: (range: Range) => void;
};
export const EditBox: React.FC<Props> = (props) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const { formTitle } = props;
  const updateRangeState = () => {
    if (!editorRef.current) return;
    const selection = window.getSelection();
    if (!selection) return;
    props.updateLastRange(selection.getRangeAt(0));
  };

  return (
    <div
      id="smart-home-edit-box"
      ref={editorRef}
      className={styles.editBox}
      contentEditable={formTitle === '详情' ? false : true}
      onMouseUp={() => {
        updateRangeState();
      }}
      onKeyUp={() => {
        updateRangeState();
      }}
      onInput={() => {
        updateRangeState();
      }}
    />
  );
};
