import * as styles from "./HoneySteps.css";
import { Steps } from "antd";
import React from "react";
import HexaBoxContainer from "../HexaBoxContainer/HexaBoxContainer";
import { vars } from "../../styles/theme.css";
import c from "classnames";
import { Props } from './type';


const getCurrentBorderColor = (targetStep: number, currentStep: number) => {
  if (currentStep > targetStep){
    return {bordersColor: 'green', titleColor: vars.colors.green};
  } else if (currentStep < targetStep) {
    return {bordersColor: 'gray', titleColor: vars.colors.black};
  }
  return {bordersColor: 'black', titleColor: vars.colors.black};
}

export const HoneySteps = ({ currentStep, steps} : Props  ) => {
  return (
    <Steps className={styles.steps} direction="horizontal" size="default" current={currentStep}>
      {steps.map(item => {
        return (
          <Steps.Step
            className={styles.step}
            key={item.step}
            icon={
              <HexaBoxContainer borderColor={getCurrentBorderColor(item.step, currentStep + 1).bordersColor as 'black' | 'gray' | 'green' }>
                <div
                  className={c(styles.stepIcon, {[styles.completedStepIcon]: item.step < (currentStep + 1)})}
                  style={{color: getCurrentBorderColor(item.step, currentStep).titleColor}}>
                  {item.step >= (currentStep + 1) && item.step}
                </div>
              </HexaBoxContainer>}
          />)})}
    </Steps>
  );
};