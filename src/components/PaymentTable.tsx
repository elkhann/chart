import React, { FC, useState } from "react";
import { Col, Row } from "antd";
import { Formik } from "formik";
import { Form, InputNumber, Table } from "formik-antd";
import ChartComponent from "./Chart";
import { Chart, ChartData, Payments } from "../types/common";
import charts from "../mocks/charts";

interface TableData {
  key: keyof ChartData | "chart";
  title: string;
  today: number | undefined | false;
  yesterday: number | undefined | false;
  selected: number | undefined | false;
  children?: TableData[];
}

const PaymentTable: FC = () => {
  const [selectedDay, setSelectedDay] = useState<string>();
  const today = "23.01.2021";
  const yesterday = "22.01.2021";

  const [editable, setEditable] = useState(false);

  const getTodayData = (
    chrts: Chart[],
    key: keyof ChartData,
    day: string | undefined
  ): number | undefined => {
    const todayData = chrts.find((c) => c.day === day);

    return todayData?.data[key];
  };

  const getSumTodayData = (
    chrts: Chart[],
    day: string | undefined
  ): number | undefined => {
    const todayData = chrts.find((c) => c.day === day);
    const result =
      (todayData?.data[Payments.CASH] || 0) +
      (todayData?.data[Payments.CASHLESS] || 0) +
      (todayData?.data[Payments.CREDIT] || 0);

    return result;
  };

  const dataSource = (chrts: Chart[]) => {
    const getSourse = (
      key: keyof ChartData | "chart",
      title: string
    ): TableData => {
      return {
        key: key,
        title: title,
        today:
          key !== "chart" &&
          (key === Payments.ALL
            ? getSumTodayData(chrts, today)
            : getTodayData(chrts, key, today)),
        yesterday: key !== "chart" && getTodayData(chrts, key, yesterday),
        selected: key !== "chart" && getTodayData(chrts, key, selectedDay),
      };
    };

    return [
      getSourse(Payments.ALL, Payments.ALL),
      getSourse("chart", "chart"),
      ...Object.values(Payments)
        .filter((payment) => payment !== Payments.ALL)
        .map((payment) => getSourse(payment, payment)),
      getSourse("averageСheck", "Средний чек, руб"),
      getSourse("averageGuest", "Средний гость, руб"),
      getSourse("removingFromCheck", "Удаления из чека (после оплаты), руб"),
      getSourse("removingFromBill", "Удаления из счета (до оплаты), руб"),
      getSourse("checksCount", "Количество чеков"),
      getSourse("guestsCount", "Количество гостей"),
    ];
  };

  return (
    <Formik
      enableReinitialize
      initialValues={{ tableData: dataSource(charts) }}
      onSubmit={() => {}}
    >
      {(props) => {
        const save = () => {
          setEditable(false);
          props.setFieldValue(
            `tableData[${0}].today`,
            Number(props.values.tableData[2].today) +
              Number(props.values.tableData[3].today) +
              Number(props.values.tableData[4].today)
          );
        };

        const getPersent = (a: number, b: number) => {
          return Math.round(((a - b) / b) * 100);
        };

        const renderContent = (
          value: any,
          row: any,
          i: number,
          key: string
        ) => {
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
              ) : key === "today" ? (
                editable && editable === row.key ? (
                  <div style={{ padding: "10px" }}>
                    <InputNumber
                      style={{ border: "none" }}
                      name={`tableData[${i}].today`}
                      onPressEnter={save}
                      parser={(value) => `${value?.replace(".", "")}`}
                      onBlur={save}
                    />
                  </div>
                ) : (
                  <div
                    onClick={() =>
                      row.key !== Payments.ALL && setEditable(row.key)
                    }
                    style={{ padding: "10px" }}
                  >
                    {row.key === Payments.ALL
                      ? props.values.tableData[i].today
                      : value}
                  </div>
                )
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
            render: (value: any, row: any, i: number) =>
              value !== false && renderContent(value, row, i, "today"),
          },
          {
            title: "Вчера",
            dataIndex: "yesterday",
            key: "yesterday",
            render: (value: any, row: any, i: number) =>
              renderContent(value, row, i, "yesterday"),
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
            render: (value: any, row: any, i: number) =>
              renderContent(value, row, i, "selected"),
          },
        ];

        return (
          <Form>
            <Table
              name='tableData'
              columns={columns}
              pagination={false}
              expandable={{
                defaultExpandAllRows: true,
                expandIcon: () => undefined,
              }}
            />
          </Form>
        );
      }}
    </Formik>
  );
};

export default PaymentTable;
