import { Progress, ProgressProps } from 'antd';
import React, { FC } from 'react';
import { vars } from 'styles/theme.css';
import * as style from './ProgressStatus.css';


const ProgressStatus: FC<ProgressProps> = props => {
  const { className, ...rest } = props;
  return  <Progress className={style.progress} trailColor={`${vars.colors.grayMiddle}`} showInfo={false} {...rest} />;
};

export default ProgressStatus;
