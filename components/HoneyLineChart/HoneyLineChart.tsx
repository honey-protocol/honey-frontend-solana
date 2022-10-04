import React, { FC, useEffect, useMemo, useState } from 'react';
import { VictoryAxis, VictoryChart, VictoryArea, VictoryLine } from 'victory';
import { SizeMeProps, withSize } from 'react-sizeme';
import { HoneyLineChartProps, TimestampPoint } from './types';
import { typography, vars } from '../../styles/theme.css';
import * as style from './HoneyLineChart.css';
import { PERIOD, PeriodName } from '../../constants/periods';
import { getFormattedDate, getStartDate } from './utlis';
import { formatNumber } from '../../helpers/format';
const { formatToThousands: ftt } = formatNumber;

const LineChart: FC<HoneyLineChartProps> = ({
  data = [],
  size,
  color = vars.colors.brownMiddle
}) => {
  const [period, setPeriod] = useState<PeriodName>(PERIOD.one_month);

  const dataByPeriod = useMemo(() => {
    const startDate = getStartDate(PERIOD.one_month);
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

  const maxXValue = useMemo(() => {
    return Math.max(...dataByPeriod.map(o => o.x));
  }, [dataByPeriod]);
  const minXValue = useMemo(() => {
    return Math.min(...dataByPeriod.map(o => o.x));
  }, [dataByPeriod]);
  const maxYValue = useMemo(() => {
    return Math.max(...dataByPeriod.map(o => o.y));
  }, [dataByPeriod]);

  return (
    <div className={style.honeyLineChart}>
      <div className={style.axisY}>
        <div>{ftt(maxYValue)}</div>
        <div>{ftt(0)}</div>
      </div>
      <div className={style.axisX}>
        <div>{getFormattedDate(minXValue, period)}</div>
        <div>{getFormattedDate(maxXValue, period)}</div>
      </div>
      <VictoryChart
        height={size.height || 41}
        width={size.width || 340}
        domainPadding={{ y: 5 }}
        padding={0}
      >
        <VictoryArea
          padding={0}
          interpolation={'monotoneX'}
          style={{
            data: {
              fill: color,
              fillOpacity: '0.1',
              stroke: color,
              strokeWidth: 2
            }
          }}
          data={dataByPeriod}
        />
        <VictoryAxis
          style={{
            axis: {
              stroke: 'transparent'
            }
          }}
        />
        <VictoryAxis
          style={{
            axis: {
              stroke: 'transparent'
            }
          }}
        />
      </VictoryChart>
    </div>
  );
};

export const HoneyLineChart = withSize()(LineChart);
