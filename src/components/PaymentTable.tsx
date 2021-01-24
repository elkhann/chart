import React, { FC, useState } from "react";
import { Col, Row, Table } from "antd";
import ChartComponent from "./Chart";
import { Chart, ChartData, Payments } from "../types/common";
import charts from "../mocks/charts";

const PaymentTable: FC = () => {
  const [selectedDay, setSelectedDay] = useState<string>();
  const today = "23.01.2021";
  const yesterday = "22.01.2021";

  const getPersent = (a: number, b: number) => {
    return Math.round(((a - b) / b) * 100);
  };

  const renderContent = (value: any, row: any, key: string) => {
    const persent = getPersent(row?.today, row?.yesterday);
    const obj = {
      children:
        key === "yesterday" ? (
          <div
            className={`${
              persent >= 10 ? "green" : persent <= -10 ? "red" : ""
            }`}
            style={{
              padding: "10px",
            }}
          >
            <Row>
              <Col span={14}>{value}</Col>
              <Col span={10}>
                {!Number.isNaN(persent) &&
                  (persent > -1 ? (
                    <div style={{ color: "green" }}>+{persent}%</div>
                  ) : (
                    <div style={{ color: "red" }}>{persent}%</div>
                  ))}
              </Col>
            </Row>
          </div>
        ) : (
          <div style={{ padding: "10px" }}>{value}</div>
        ),
      props: {} as { colSpan: number },
    };
    if (value === "chart") {
      obj.props.colSpan = 0;
    }
    return obj;
  };

  const columns = [
    {
      title: "Показатель",
      dataIndex: "title",
      key: "title",
      render: (value: any) => {
        if (value === "chart") {
          return {
            children: <ChartComponent setSelectedDay={setSelectedDay} />,
            props: { colSpan: 4 },
          };
        }
        return <div style={{ padding: "10px" }}>{value}</div>;
      },
    },
    {
      title: "Текущий день",
      dataIndex: "today",
      key: "today",
      className: "today",
      render: (value: any, row: any) => renderContent(value, row, "today"),
    },
    {
      title: "Вчера",
      dataIndex: "yesterday",
      key: "yesterday",
      render: (value: any, row: any) => renderContent(value, row, "yesterday"),
    },
    {
      title: (
        <>
          Выбранный день <br />
          <b> {selectedDay}</b>
        </>
      ),
      dataIndex: "selected",
      key: "selected",
      render: (value: any, row: any) => renderContent(value, row, "selected"),
    },
  ];

  const getTodayData = (
    chrts: Chart[],
    key: keyof ChartData,
    day: string | undefined
  ) => {
    const todayData = chrts.find((c) => c.day === day);
    return todayData?.data[key];
  };

  const dataSource = (chrts: Chart[]) => {
    return [
      {
        key: Payments.ALL,
        title: Payments.ALL,
        today: getTodayData(chrts, Payments.ALL, today),
        yesterday: getTodayData(chrts, Payments.ALL, yesterday),
        selected: getTodayData(chrts, Payments.ALL, selectedDay),
        children: [
          {
            key: "chart",
            title: "chart",
            today: false,
            yesterday: false,
            selected: false,
          },
          ...Object.values(Payments)
            .filter((payment) => payment !== Payments.ALL)
            .map((payment) => {
              return {
                key: payment,
                title: payment,
                today: getTodayData(chrts, payment, today),
                yesterday: getTodayData(chrts, payment, yesterday),
                selected: getTodayData(chrts, payment, selectedDay),
              };
            }),
        ],
      },

      {
        key: "averageСheck",
        title: "Средний чек, руб",
        today: getTodayData(chrts, "averageСheck", today),
        yesterday: getTodayData(chrts, "averageСheck", yesterday),
        selected: getTodayData(chrts, "averageСheck", selectedDay),
      },
      {
        key: "averageGuest",
        title: "Средний гость, руб",
        today: getTodayData(chrts, "averageGuest", today),
        yesterday: getTodayData(chrts, "averageGuest", yesterday),
        selected: getTodayData(chrts, "averageGuest", selectedDay),
      },
      {
        key: "removingFromCheck",
        title: "Удаления из чека (после оплаты), руб",
        today: getTodayData(chrts, "removingFromCheck", today),
        yesterday: getTodayData(chrts, "removingFromCheck", yesterday),
        selected: getTodayData(chrts, "removingFromCheck", selectedDay),
      },
      {
        key: "removingFromBill",
        title: "Удаления из счета (до оплаты), руб",
        today: getTodayData(chrts, "removingFromBill", today),
        yesterday: getTodayData(chrts, "removingFromBill", yesterday),
        selected: getTodayData(chrts, "removingFromBill", selectedDay),
      },
      {
        key: "checksCount",
        title: "Количество чеков",
        today: getTodayData(chrts, "checksCount", today),
        yesterday: getTodayData(chrts, "checksCount", yesterday),
        selected: getTodayData(chrts, "checksCount", selectedDay),
      },
      {
        key: "guestsCount",
        title: "Количество гостей",
        today: getTodayData(chrts, "guestsCount", today),
        yesterday: getTodayData(chrts, "guestsCount", yesterday),
        selected: getTodayData(chrts, "guestsCount", selectedDay),
      },
    ];
  };

  return (
    <>
      <Table
        columns={columns}
        dataSource={dataSource(charts)}
        pagination={false}
        expandable={{
          defaultExpandAllRows: true,
          expandIcon: () => undefined,
        }}
      />
    </>
  );
};

export default PaymentTable;
