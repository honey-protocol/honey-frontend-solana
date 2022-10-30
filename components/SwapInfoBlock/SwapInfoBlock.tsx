import { ReactNode } from "react";
import * as style from './SwapInfoBlock.css';

export type InfoBlockData = {
  title: string,
  value: string,
  titleAddon?: ReactNode,
}

export interface Props {
  data: InfoBlockData[];
}
export const SwapInfoBlock = ({ data }: Props) => {

  return (
    <div className={style.swapInfoBlock}>
      <div className={style.infoBlockWrapper}>
        <div className={style.borderInfoBlock} />
        {data.map((row) => {
          return (
            <div className={style.infoBlockRow} key={row.title}>
              <div className={style.infoBlockTitle}>{row.title}
              <div className={style.titleAddon}>{row.titleAddon && row.titleAddon}</div></div>
              <div className={style.infoBlockValue}>{row.value}</div>
            </div>
          )
        })}
      </div>
    </div>
  )
}