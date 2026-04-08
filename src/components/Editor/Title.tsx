import React from "react";
import styles from "./Title.module.less";

type Props = {
  text: string;
  extra?: React.ReactNode;
};

export const Title: React.FC<Props> = props => {
  return (
    <div className={styles.container}>
      <span className={styles.line} />
      <p className={styles.text}>{props.text}</p>
      {props.extra}
    </div>
  );
};
