import React, { useRef } from 'react';
import styles from './EditBox.module.less';

export const ExampleBox: React.FC = () => {
  const editorRef = useRef<HTMLDivElement>(null);

  return (
    <div
      id="smart-home-example-box"
      ref={editorRef}
      className={styles.editBox}
      contentEditable={false}
    />
  );
};
