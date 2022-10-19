import React, { FC } from 'react';
import * as style from './HoneyButtonTabs.css';
import c from 'classnames'
import { HoneyButtonTabsProps } from './types';

export const HoneyButtonTabs: FC<HoneyButtonTabsProps> = ({
  items,
  activeItemSlug,
  isFullWidth,
  onClick,
}) => (
  <div className={c(style.periodSelector, {[style.fullWidthSelector]: isFullWidth})}>
    <div className={c(style.periodSelectorContent, {[style.periodSelectorContentResponsibility]: !isFullWidth})}>
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
            {(item.nameMobile || item.nameTablet) ?
              <>
                {item.nameMobile &&
                  <>
                    <div className={style.hideNameMobile}>
                      {item.name}
                    </div>
                    <div className={style.showNameMobile}>
                      {item.nameMobile}
                    </div>
                  </>
                }

                {item.nameTablet &&
                  <>
                    <div className={style.hideNameTablet}>
                      {item.name}
                    </div>
                    <div className={style.showNameTablet}>
                      {item.nameTablet}
                    </div>
                  </>
                }
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
