import React, { FC } from 'react';
import * as style from './HoneyButtonTabs.css';

export interface HoneyButtonTabsProps {
  items: HoneyButtonTabsItem[];
  activeItemSlug: string;
  onClick: (itemSlug: string) => void;
}

type HoneyButtonTabsItem = {
  name: string;
  nameMobile?: string;
  slug: string;
};

export const HoneyButtonTabs: FC<HoneyButtonTabsProps> = ({
  items,
  activeItemSlug,
  onClick
}) => (
  <div className={style.periodSelector}>
    <div className={style.periodSelectorContent}>
      {items.map((item, index) => {
        const itemStatus = item.slug == activeItemSlug ? 'active' : 'passive';
        const isVisibleDivider =
          items.length - 1 !== index && itemStatus !== 'active';
        return (
          <div
            key={item.slug}
            className={style.periodSelectorItem[itemStatus]}
            onClick={() => onClick(item.slug)}
          >

            {item.nameMobile ?
              <>
                <div className={style.hideNameMobile}>
                  {item.name}
                </div>
                <div className={style.showNameMobile}>
                  {item.nameMobile}
                </div>
              </>
             :
              <>
                {item.name}
              </>
            }

            {isVisibleDivider && <div className={style.verticalDivider} />}
          </div>
        );
      })}
    </div>
  </div>
);
