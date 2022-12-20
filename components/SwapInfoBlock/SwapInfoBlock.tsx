import { ReactNode, useState } from 'react';
import * as style from './SwapInfoBlock.css';

export type InfoBlockData = {
  title: string;
  altValue?: string;
  value: string;
  titleAddon?: ReactNode;
};

export interface Props {
  data: InfoBlockData[];
}
export const SwapInfoBlock = ({ data }: Props) => {
  const [shownValue, setShownValue] = useState<'value' | 'altValue'>('value');

  const onValueClick = () => {
    setShownValue(shownValue === 'value' ? 'altValue' : 'value');
  };

  return (
    <div className={style.swapInfoBlock}>
      <div className={style.infoBlockWrapper}>
        <div className={style.borderInfoBlock} />
        {data.map(row => {
          return (
            <div className={style.infoBlockRow} key={row.title}>
              <div className={style.infoBlockTitle}>
                {row.title}
                <div className={style.titleAddon}>
                  {row.titleAddon && row.titleAddon}
                </div>
              </div>
              <div
                onClick={row.altValue ? onValueClick : () => {}}
                className={style.infoBlockValue}
              >
                {shownValue === 'altValue' && row.altValue
                  ? row.altValue
                  : row.value}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
