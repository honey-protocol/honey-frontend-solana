import { Progress, ProgressProps } from 'antd';
import React, { FC, useMemo } from 'react';
import { vars } from 'styles/theme.css';
import * as style from './ProgressStatus.css';

const colorsGrade = [
  [0, vars.colors.brownLight],
  // [20, vars.colors.red],
  [99, vars.colors.green]
];

const ProgressStatus: FC<ProgressProps> = props => {
  const { className, ...rest } = props;

  const getStatusColor = (value: number | undefined) => {
    if (!value) {
      return colorsGrade[0][1];
    }

    const color = [...colorsGrade].reverse().find(item => {
      return value > item[0];
    });
    return color ? color[1] : colorsGrade[0][1];
  };

  const statusColor = useMemo(() => {
    return getStatusColor(rest.percent);
  }, [rest.percent]);

  return (
    <Progress
      className={style.progress}
      strokeColor={statusColor.toString()}
      trailColor={`${vars.colors.grayMiddle}`}
      showInfo={false}
      {...rest}
    />
  );
};

export default ProgressStatus;
