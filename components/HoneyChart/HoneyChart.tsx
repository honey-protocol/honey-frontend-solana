import React, { FC, ReactElement, useMemo, useState } from 'react';
import {
  VictoryAxis,
  VictoryBar,
  VictoryChart,
  VictoryContainer,
  VictoryStyleObject,
  VictoryTooltip
} from 'victory';
import { SizeMeProps, withSize } from 'react-sizeme';
import { ChartBarLabel, TimestampPoint } from './types';
import { typography, vars } from '../../styles/theme.css';
import * as style from './HoneyChart.css';
import { PERIOD, PeriodName } from '../../constants/periods';
import { getFormattedDate, getStartDate } from './utlis';
import { formatNumber } from '../../helpers/format';
import { HoneyButtonTabs } from '../HoneyButtonTabs/HoneyButtonTabs';
const { formatPercent: fp } = formatNumber;

const PERIODS_NAME_MAPPING = {
  [PERIOD.one_month]: 'month',
  [PERIOD.three_month]: '3 month',
  [PERIOD.six_month]: '6 month',
  [PERIOD.all]: 'all time'
};

const PERIOD_NAMES = Object.values(PERIOD);

interface BarsProps {
  data: TimestampPoint[];
  size: SizeMeProps['size'];
}

const Bar: FC<BarsProps> = ({ data = [], size }) => {
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

  const getFormattedLabel = (labelData: ChartBarLabel) => {
    const { dateFrom, dateTo, y } = labelData.datum;
    const percentValue = (y / maxYValue) * 100;
    return `${getFormattedDate(dateFrom, period)} — ${getFormattedDate(
      dateTo,
      period
    )} \n ${fp(percentValue)}`;
  };

  const dataInitialStyles: VictoryStyleObject = {
    fill: vars.colors.white,
    stroke: vars.colors.grayDark,
    strokeWidth: 2,
    filter: `drop-shadow(2px 2px 0px ${vars.colors.grayDark})`,
    cursor: 'pointer'
  };

  return (
    <div className={style.honeyChart}>
      <HoneyButtonTabs
        items={PERIOD_NAMES.map(slug => ({
          name: PERIODS_NAME_MAPPING[slug],
          slug
        }))}
        activeItemSlug={period}
        onClick={itemSlug => setPeriod(itemSlug as PeriodName)}
      />
      <VictoryChart
        padding={{ top: 50, right: 60, bottom: 0, left: 90 }}
        width={size.width || undefined}
        height={300}
        containerComponent={<VictoryContainer height={350} />}
      >
        <VictoryAxis
          tickCount={period === PERIOD.all ? 2 : 6}
          tickFormat={t => getFormattedDate(t, period)}
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
          tickCount={6}
          tickFormat={t => fp((t / maxYValue) * 100)}
          maxDomain={maxYValue}
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
          labels={getFormattedLabel}
          labelComponent={
            <VictoryTooltip
              constrainToVisibleArea
              orientation="top"
              renderInPortal={false}
              pointerLength={5}
              pointerWidth={14}
              // flyoutWidth={300}
              flyoutStyle={{
                fill: vars.colors.brownLight,
                stroke: vars.colors.black,
                filter: 'drop-shadow(2px 2px 0px #111111)',
                strokeWidth: 2
              }}
              style={{
                fontFamily: 'Sora, sans-serif',
                fontFeatureSettings: 'none',
                fontVariant: 'none',
                fontSize: 14
              }}
              dy={-4}
            />
          }
          samples={10}
          events={[
            {
              target: 'data',
              eventHandlers: {
                onMouseEnter: () => {
                  return [
                    {
                      target: 'data',
                      mutation: props => {
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
                      mutation: () => {
                        return { style: dataInitialStyles };
                      }
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
