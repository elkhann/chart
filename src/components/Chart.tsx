import React, { useState } from "react";
import HighchartsReact from "highcharts-react-official";
import Highcharts from "highcharts";

enum Payments {
  CASH = "cash",
  CASHLESS = "cashless",
  CREDIT = "credit",
  ALL = "summary",
}

const charts = [
  {
    day: "12.01.2021",
    [Payments.CASH]: 150000,
    [Payments.CASHLESS]: 200000,
    [Payments.CREDIT]: 75000,
    [Payments.ALL]: 420000,
  },
  {
    day: "22.01.2021",
    [Payments.CASH]: 250000,
    [Payments.CASHLESS]: 225000,
    [Payments.CREDIT]: 50000,
    [Payments.ALL]: 525000,
  },
  {
    day: "23.01.2021",
    [Payments.CASH]: 300000,
    [Payments.CASHLESS]: 250000,
    [Payments.CREDIT]: 150000,
    [Payments.ALL]: 700000,
  },
];

const LineChart = () => {
  const [hoverData, setHoverData] = useState(null);
  // const [chartOptions, setChartOptions] = useState<Highcharts.Options>({
  //   xAxis: {
  //     categories: ['A', 'B', 'C'],
  //   },
  //   series: [
  //     type: 'line',
  //     { data: [1, 2, 3] }
  //   ],
  //   plotOptions: {
  //     series: {
  //       point: {
  //         events: {
  //           mouseOver(e:any){
  //             setHoverData(e.target.category)
  //           }
  //         }
  //       }
  //     }
  //   }
  // });

  const showAllChart = true;
  const [chartOptions, setChartOptions] = useState<Highcharts.Options>({
    title: {
      text: "My chart",
    },
    xAxis: {
      categories: charts.map((c) => c.day),
    },
    series: Object.values(Payments).map((payment) => {
      return {
        type: "line",
        name: payment,
        data: charts.map((chart) => {
          return showAllChart ? chart[payment] : chart[Payments.ALL];
        }),
      };
    }),
  });

  const updateSeries = () => {
    // setChartOptions({
    //   series: [
    //       { data: [Math.random() * 5, 2, 1]}
    //     ]
    // } );
  };

  return (
    <div>
      <HighchartsReact highcharts={Highcharts} options={chartOptions} />
    </div>
  );
};

export default LineChart;
