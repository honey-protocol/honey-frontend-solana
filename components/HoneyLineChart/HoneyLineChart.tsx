import React, { FC, useMemo, useState } from 'react';
import { VictoryArea, VictoryAxis, VictoryChart } from 'victory';
import { withSize } from 'react-sizeme';
import { HoneyLineChartProps } from './types';
import { vars } from '../../styles/theme.css';
import * as style from './HoneyLineChart.css';
import { PERIOD, PeriodName } from '../../constants/periods';
import { getFormattedDate, getStartDate } from './utlis';
import { formatNumber } from '../../helpers/format';

const { formatToThousands: ftt } = formatNumber;

const LineChart: FC<HoneyLineChartProps> = ({
  data = [],
  size,
  color = vars.colors.brownMiddle,
  yAxisLabel,
  xAxisLabel
}) => {
  console.log('size', size);
  const [period, setPeriod] = useState<PeriodName>(PERIOD.one_month);

  // const dataByPeriod = useMemo(() => {
  //   const startDate = getStartDate(PERIOD.one_month);
  //   const filteredData = data?.filter(item => new Date(item.epoch) > startDate);
  //   const horizontalChartData = filteredData.map((dt: TimestampPoint) => {
  //     return {
  //       x: dt.epoch,
  //       y: dt.value
  //     };
  //   });
  //   const preparedData = [];

  //   const step = Math.round(horizontalChartData.length / 24);
  //   let currentStep = 0;
  //   while (currentStep < horizontalChartData.length - 1) {
  //     const slicedStats = horizontalChartData.slice(
  //       currentStep,
  //       currentStep + step
  //     );
  //     preparedData.push({
  //       y:
  //         slicedStats.reduce((acc, cur) => acc + cur.y, 0) / slicedStats.length,
  //       x: Math.round(
  //         (slicedStats[0].x + slicedStats[slicedStats.length - 1].x) / 2
  //       ),
  //       dateFrom: slicedStats[0].x,
  //       dateTo: slicedStats[slicedStats.length - 1].x,
  //       isLast: currentStep + step > horizontalChartData.length - 1
  //     });
  //     currentStep += step;
  //   }

  //   return preparedData;
  // }, [period, data]);

  // const maxXValue = useMemo(() => {
  //   return Math.max(...dataByPeriod.map(o => o.x));
  // }, [dataByPeriod]);
  // const minXValue = useMemo(() => {
  //   return Math.min(...dataByPeriod.map(o => o.x));
  // }, [dataByPeriod]);
  // const maxYValue = useMemo(() => {
  //   return Math.max(...dataByPeriod.map(o => o.y));
  // }, [dataByPeriod]);

  return (
    <>
      <div className={style.honeyLineChart}>
        {/* <div className={style.axisY}>
          <VictoryAxis label={'trydht'} axisValue={yAxisLabel} />
        </div> */}
        {/* <div className={style.axisX}>
          <div>100%</div>
        </div> */}
        <VictoryChart
          // height={size.height ?? 45}
          // width={size.width || 375}
          // domainPadding={{ y: 5 }}
          padding={{ left: 30, bottom: 25, top: 10, right: 10 }}
        >
          <VictoryArea
            padding={0}
            style={{
              data: {
                fill: color,
                fillOpacity: '0.1',
                stroke: color,
                strokeWidth: 2
              }
            }}
            data={data}
          />
          <VictoryAxis dependentAxis />
          <VictoryAxis data={data} />
        </VictoryChart>
      </div>
      {xAxisLabel && <div className={style.xAxisTitle}>{xAxisLabel}</div>}
    </>
  );
};

export const HoneyLineChart = withSize({ monitorHeight: true })(LineChart);
