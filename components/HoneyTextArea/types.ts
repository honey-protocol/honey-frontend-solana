import {TextAreaProps} from "antd/lib/input/TextArea";

export type HoneyTextAreaProps = TextAreaProps & {
  isShowCounter?: boolean
  value: string
  title: string
}