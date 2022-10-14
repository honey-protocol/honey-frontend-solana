import React, { FC, useEffect, useMemo, useState } from 'react';
import {
  VictoryAxis,
  VictoryChart,
  VictoryPortal,
  VictoryArea,
  VictoryTooltip,
  VictoryVoronoiContainer,
  VictoryLine
} from 'victory';
import { SizeMeProps, withSize } from 'react-sizeme';
import { TimestampPoint } from './types';
import { typography, vars } from '../../styles/theme.css';
import * as style from './HoneyProfileChart.css';
import { PERIOD, PeriodName } from '../../constants/periods';
import { getFormattedDate, getStartDate } from './utlis';
import { formatNumber } from '../../helpers/format';
import { HoneyButtonTabs } from '../HoneyButtonTabs/HoneyButtonTabs';
const { formatToThousands: ftt, formatUsd: fusd } = formatNumber;

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

interface ProfileChartProps {
  data: TimestampPoint[];
  size: SizeMeProps['size'];
  value?: number;
}

const ProfileChart: FC<ProfileChartProps> = ({ data = [], size, value }) => {
  const [period, setPeriod] = useState<PeriodName>(PERIOD.one_month);

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

  const CustomBarTooltip: FC<any> = ({ center, datum }) => {
    const { dateFrom, dateTo, y: dataY } = datum;
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
              <div className={style.tooltipValue}>{fusd(dataY)}</div>
            </div>
          </foreignObject>
          <foreignObject x={center.x - 3} y={center.y + 9} width="6" height="6">
            <div className={style.tooltipDot} />
          </foreignObject>
        </g>
      </VictoryPortal>
    );
  };

  return (
    <div className={style.honeyChart}>
      <div className={style.honeyChartHeader}>
        <div className={style.chartTitle}>
          <div className={style.chartTitleText}>
            <span>My exposure</span> <div className={style.titleTooltipIcon} />
          </div>
          <div className={style.chartTitleValue}>{fusd(value)}</div>
        </div>
        <HoneyButtonTabs
          items={PERIOD_NAMES.map(slug => ({
            name: PERIODS_NAME_MAPPING[slug],
            nameTablet: PERIODS_NAME_MAPPING_MOBILE[slug],
            slug
          }))}
          activeItemSlug={period}
          onClick={itemSlug => setPeriod(itemSlug as PeriodName)}
        />
      </div>

      <VictoryChart
        padding={{ top: 27, right: 60, bottom: 52, left: 56 }}
        width={size.width || undefined}
        height={size.height || 188}
        containerComponent={
          <VictoryVoronoiContainer style={{ position: 'relative' }} />
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
              padding: 26
            }
          }}
        />
        <VictoryAxis
          tickFormat={t => ftt(t)}
          tickValues={getYTicks()}
          dependentAxis
          style={{
            axis: {
              stroke: 'transparent'
            },
            tickLabels: {
              ...typography.caption,
              fill: vars.colors.grayTransparent,
              padding: 26
            }
          }}
        />
        <VictoryArea
          data={dataByPeriod}
          style={{
            data: {
              fill: 'url(#gradient)',
              fillOpacity: '0.1',
              stroke: 'transparent'
            }
          }}
        />
        <VictoryLine
          data={dataByPeriod}
          style={{
            data: {
              stroke: vars.colors.brownLight,
              strokeWidth: 2
            }
          }}
          labels={() => ''}
          labelComponent={
            <VictoryTooltip flyoutComponent={<CustomBarTooltip />} />
          }
        />
      </VictoryChart>

      <svg style={{ height: 0 }}>
        <defs>
          <linearGradient
            id="gradient"
            x1="352"
            y1="0"
            x2="352"
            y2="129"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#E7B400" />
            <stop offset="1" stopColor="#E7B400" stopOpacity="0" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
};

export const HoneyProfileChart = withSize()(ProfileChart);
