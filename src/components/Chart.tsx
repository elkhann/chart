import React, { FC, useState } from "react";
import HighchartsReact from "highcharts-react-official";
import Highcharts from "highcharts";
import charts from "../mocks/charts";
import { Payments } from "../types/common";

type Props = {
  setSelectedDay: (day: string) => void;
};

const LineChart: FC<Props> = ({ setSelectedDay }) => {
  const showAllChart = true;

  const [chartOptions, setChartOptions] = useState<Highcharts.Options>({
    title: undefined,
    xAxis: {
      categories: charts.map((c) => c.day),
    },
    series: Object.values(Payments).map((payment) => {
      return {
        type: "line",
        name: payment,
        data: charts.map((chart) => {
          return showAllChart ? chart.data[payment] : chart.data[Payments.ALL];
        }),
      };
    }),
    plotOptions: {
      series: {
        cursor: "pointer",
        point: {
          events: {
            click: function () {
              setSelectedDay(this.category);
            },
          },
        },
      },
    },
  });

  return <HighchartsReact highcharts={Highcharts} options={chartOptions} />;
};

export default LineChart;
