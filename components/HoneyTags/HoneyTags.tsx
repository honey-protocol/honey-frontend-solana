import * as styles from './HoneyTags.css';
import { HoneyTagsProps } from "./types";
import {useState} from "react";
import c from "classnames";


export const HoneyTags = ({ title, onSelectTag }: HoneyTagsProps) => {
  const [isActive, setIsActive] = useState<boolean>(false)
  return (
    <div className={c(styles.honeyTags, {[styles.active]: isActive})}
         onClick={() => {
           setIsActive(!isActive)
           onSelectTag && onSelectTag(title)
         }}>
      {title}
    </div>
  )
}