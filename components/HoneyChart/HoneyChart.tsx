import React, {FC, useEffect, useMemo, useState} from 'react';
import {
  VictoryAxis,
  VictoryBar,
  VictoryChart,
  VictoryContainer,
  VictoryStyleObject,
  VictoryTooltip,
  VictoryPortal, FlyoutProps
} from 'victory';
import { SizeMeProps, withSize } from 'react-sizeme';
import { TimestampPoint } from './types';
import { typography, vars } from '../../styles/theme.css';
import * as style from './HoneyChart.css';
import { PERIOD, PeriodName } from '../../constants/periods';
import { getFormattedDate, getStartDate } from './utlis';
import { formatNumber } from '../../helpers/format';
import { HoneyButtonTabs } from '../HoneyButtonTabs/HoneyButtonTabs';
import useWindowSize from 'hooks/useWindowSize';
const { formatPercent: fp } = formatNumber;

const PERIODS_NAME_MAPPING = {
  [PERIOD.one_month]: 'month',
  [PERIOD.three_month]: '3 month',
  [PERIOD.six_month]: '6 month',
  [PERIOD.all]: 'all time'
};

const PERIODS_NAME_MAPPING_MOBILE = {
  [PERIOD.one_month]: 'month',
  [PERIOD.three_month]: '3 m',
  [PERIOD.six_month]: '6 m',
  [PERIOD.all]: 'all'
};

const PERIOD_NAMES = Object.values(PERIOD);

interface BarsProps {
  data: TimestampPoint[];
  size: SizeMeProps['size'];
  title?: string;
}

const Bar: FC<BarsProps> = ({ data = [], size, title }) => {
  const [period, setPeriod] = useState<PeriodName>(PERIOD.one_month);
  const [isBarHovered, setIsBarHovered] = useState(false);
  const { width } = useWindowSize();

  const dataInitialStyles: VictoryStyleObject = {
    fill: vars.colors.white,
    stroke: vars.colors.black,
    strokeWidth: 2,
    filter: `drop-shadow(2px 2px 0px ${vars.colors.black})`,
    cursor: 'pointer'
  };

  const dataByPeriod = useMemo(() => {
    const startDate = getStartDate(period);
    const filteredData = data?.filter(item => new Date(item.epoch) > startDate);
    const horizontalChartData = filteredData.map((dt: TimestampPoint) => {
      return {
        x: dt.epoch,
        y: dt.value
      };
    });
    const preparedData = [];

    const step = Math.round(horizontalChartData.length / 24);
    let currentStep = 0;
    while (currentStep < horizontalChartData.length - 1) {
      const slicedStats = horizontalChartData.slice(
        currentStep,
        currentStep + step
      );
      preparedData.push({
        y:
          slicedStats.reduce((acc, cur) => acc + cur.y, 0) / slicedStats.length,
        x: Math.round(
          (slicedStats[0].x + slicedStats[slicedStats.length - 1].x) / 2
        ),
        dateFrom: slicedStats[0].x,
        dateTo: slicedStats[slicedStats.length - 1].x,
        isLast: currentStep + step > horizontalChartData.length - 1
      });
      currentStep += step;
    }

    return preparedData;
  }, [period, data]);

  const maxYValue = useMemo(() => {
    return Math.max(...dataByPeriod.map(o => o.y));
  }, [dataByPeriod]);

  const maxXValue = useMemo(() => {
    return Math.max(...dataByPeriod.map(o => o.x));
  }, [dataByPeriod]);
  const minXValue = useMemo(() => {
    return Math.min(...dataByPeriod.map(o => o.x));
  }, [dataByPeriod]);

  const getYTicks = () => {
    const ticks = [0, maxYValue];
    const step = maxYValue / 5;
    let currentTick = 0;
    while (currentTick < maxYValue) {
      const newTick = currentTick + step;
      ticks.push(newTick);
      currentTick = newTick;
    }
    return ticks;
  };
  const getXTicks = () => {
    const ticks = [minXValue, maxXValue];
    if (period !== PERIOD.all) {
      const step = (maxXValue - minXValue) / 5;
      let currentTick = minXValue;
      while (currentTick < maxXValue) {
        const newTick = currentTick + step;
        ticks.push(newTick);
        currentTick = newTick;
      }
    }
    return ticks;
  };

  const CustomBarTooltip: FC<any> = ({center, datum}) => {
    const { dateFrom, dateTo, y: dataY } = datum;
    const percentValue = dataY * 100;
    return (
      <VictoryPortal>
        <g>
          <foreignObject
            overflow="visible"
            width="120"
            height="100%"
            x={center.x - 60}
            y={center.y - 55}
          >
            <div className={style.tooltip}>
              <div className={style.tooltipTitle}>{`${getFormattedDate(
                dateFrom,
                period
              )} — ${getFormattedDate(dateTo, period)}`}</div>
              <div className={style.tooltipValue}>{fp(percentValue)}</div>
            </div>
          </foreignObject>
        </g>
      </VictoryPortal>
    );
  };

  return (
    <div className={style.honeyChart}>
      <div className={style.honeyChartHeader}>
        {title && <div className={style.chartTitleText}>{title}</div>}
        <HoneyButtonTabs
          items={PERIOD_NAMES.map(slug => ({
            name: PERIODS_NAME_MAPPING[slug],
            nameMobile: PERIODS_NAME_MAPPING_MOBILE[slug],
            slug
          }))}
          activeItemSlug={period}
          onClick={itemSlug => setPeriod(itemSlug as PeriodName)}
        />
      </div>
      <VictoryChart
        padding={{ top: 50, right: 60, bottom: 0, left: 80 }}
        width={size.width || undefined}
        height={300}
        containerComponent={
          <VictoryContainer height={350} style={{ position: 'relative' }} />
        }
      >
        <VictoryAxis
          tickFormat={t => getFormattedDate(t, period)}
          tickValues={getXTicks()}
          style={{
            axis: {
              stroke: 'transparent'
            },
            tickLabels: {
              ...typography.caption,
              fill: vars.colors.grayTransparent,
              padding: 12
            }
          }}
        />
        <VictoryAxis
          tickFormat={t => fp(t * 100)}
          tickValues={getYTicks()}
          dependentAxis
          style={{
            axis: {
              stroke: 'transparent'
            },
            tickLabels: {
              ...typography.caption,
              fill: vars.colors.grayTransparent,
              padding: 30
            }
          }}
        />

        <VictoryBar
          labels={() => ''}
          labelComponent={
            <VictoryTooltip
              flyoutComponent={<CustomBarTooltip />}
            />
          }
          events={[
            {
              target: 'data',
              eventHandlers: {
                onMouseEnter: () => {
                  return [
                    {
                      target: 'data',
                      mutation: props => {
                        setIsBarHovered(true);
                        return {
                          style: {
                            ...props.style,
                            fill: vars.colors.brownLight,
                            stroke: vars.colors.black,
                            filter: `drop-shadow(2px 2px 0px ${vars.colors.black})`
                          }
                        };
                      }
                    }
                  ];
                },
                onMouseLeave: () => {
                  return [
                    {
                      target: 'data',
                      mutation: () => setIsBarHovered(false)
                    }
                  ];
                }
              }
            }
          ]}
          style={{
            data: dataInitialStyles
          }}
          data={dataByPeriod}
          cornerRadius={{ top: 6, bottom: 6 }}
        />
      </VictoryChart>
    </div>
  );
};

export const HoneyChart = withSize()(Bar);
