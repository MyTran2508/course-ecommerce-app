"use client";
import React, { Fragment, useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS } from "chart.js/auto";
import { CategoryScale } from "chart.js";
import {
  useLazyMonthlySalesQuery,
  useLazySalesSamePeriodQuery,
  useMonthlySalesQuery,
} from "@/redux/services/orderApi";
import {
  useGetTotalApprovedCourseMutation,
  useLazySaleByTopicsQuery,
  useLazySalesSamePeriodByTopicsQuery,
} from "@/redux/services/courseApi";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useGetStatisticsMutation } from "@/redux/services/userApi";
import { FaCalendar } from "react-icons/fa";

ChartJS.register(CategoryScale);

const getRandomColor = () => {
  const r = Math.floor(Math.random() * 256);
  const g = Math.floor(Math.random() * 256);
  const b = Math.floor(Math.random() * 256);
  return `${r}, ${g}, ${b}`;
};
export interface MonthlySale {
  month: number;
  total: number;
}
export interface SalesSamePeriodByTopics {
  topicId: string;
  topicName: string;
  targetYearTotal: number;
  previousYearTotal: number;
}
export interface SalesSamePeriod {
  month: number;
  targetYearTotal: number;
  previousYearTotal: number;
}
export interface SalesByTopic {
  topicId: string;
  topicName: string;
  totalPrice: number;
}
export interface Statistics {
  totalApprovedCourse: number;
  totalRegisteredCourse: number;
  totalRegisteredUser: number;
  totalRevenue: number;
}

function OverviewPage() {
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [selectedYear, setSelectedYear] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("");
  const [monthlySale, setMonthlySale] = useState<MonthlySale[] | []>([]);
  const [salesByTopic, setSalesByTopic] = useState<SalesByTopic[] | []>([]);
  const [salesSamePeriodByTopics, setSalesSamePeriodByTopics] = useState<
    SalesSamePeriodByTopics[] | []
  >([]);
  const [salesSamePeriod, setSalesSamePeriod] = useState<
    SalesSamePeriod[] | []
  >([]);
  const [statisticsData, setStatisticsData] = useState<Statistics>();

  const [
    getMonthlySale,
    { data: monthLySaleData, isSuccess: isGetMonthlySaleSuccess },
  ] = useLazyMonthlySalesQuery();
  const [
    getSalesSamePeriod,
    { data: salesSamePeriodData, isSuccess: isGetSalesSamePeriodSuccess },
  ] = useLazySalesSamePeriodQuery();

  const [
    getSalesSamePeriodByTopics,
    {
      data: samePeriodByTopicsData,
      isSuccess: isGetSalesSamePeriodByTopicsSuccess,
    },
  ] = useLazySalesSamePeriodByTopicsQuery();
  const [
    getSalesByTopic,
    { data: salesByTopicData, isSuccess: isGetSalesByTopicSuccess },
  ] = useLazySaleByTopicsQuery();
  const [getStatistics] = useGetStatisticsMutation();

  const handleGetTotalApproveCourse = async () => {
    await getStatistics({
      targetMonth: parseInt(selectedMonth),
      targetYear: parseInt(selectedYear),
    })
      .unwrap()
      .then((fulfilled) => {
        setStatisticsData(fulfilled.data as Statistics);
      });
  };

  useEffect(() => {
    getMonthlySale(parseInt(selectedYear));
    getSalesByTopic(parseInt(selectedYear));
    getSalesSamePeriod(parseInt(selectedYear));
    getSalesSamePeriodByTopics(parseInt(selectedYear));
    handleGetTotalApproveCourse();
  }, [selectedYear, selectedMonth]);

  useEffect(() => {
    if (isGetMonthlySaleSuccess) {
      setMonthlySale(monthLySaleData?.data as MonthlySale[]);
    }
    if (isGetSalesByTopicSuccess) {
      console.log(salesByTopicData?.data as SalesByTopic[]);
      setSalesByTopic(salesByTopicData?.data as SalesByTopic[]);
    }
    if (isGetSalesSamePeriodByTopicsSuccess) {
      setSalesSamePeriodByTopics(
        samePeriodByTopicsData?.data as SalesSamePeriodByTopics[]
      );
    }
    if (isGetSalesSamePeriodSuccess) {
      setSalesSamePeriod(salesSamePeriodData?.data as SalesSamePeriod[]);
    }
  }, [
    salesByTopicData,
    monthLySaleData,
    samePeriodByTopicsData,
    salesSamePeriodData,
  ]);

  const renderData = (
    data: string[][],
    column: number,
    label_x: string[],
    label_y: string[]
  ) => {
    const datasets = [];

    for (let i = 0; i < column; i++) {
      datasets.push({
        label: `${label_y[i]}`,
        data: data[i],
        backgroundColor: `rgba(${getRandomColor()}, 0.6)`,
      });
    }

    return {
      labels: label_x,
      datasets: datasets,
    };
  };
  const options = (title: string) => {
    return {
      plugins: {
        title: {
          display: true,
          text: title,
        },
      },
      responsive: true,
      maintainAspectRatio: false,
    };
  };
  const renderMonthlySales = () => {
    const label_x = [
      "T1",
      "T2",
      "T3",
      "T4",
      "T5",
      "T6",
      "T7",
      "T8",
      "T9",
      "T10",
      "T11",
      "T12",
    ];
    const label_y = ["Tổng"];
    const data: string[][] = [];
    data.push(monthlySale.map((item) => item.total.toString()));

    return renderData(data, 1, label_x, label_y);
  };

  const renderSalesSamePeriod = () => {
    const label_x = [
      "T1",
      "T2",
      "T3",
      "T4",
      "T5",
      "T6",
      "T7",
      "T8",
      "T9",
      "T10",
      "T11",
      "T12",
    ];
    const label_y = [
      `Tổng Năm ${selectedYear} `,
      `Tổng Năm ${parseInt(selectedYear) - 1}`,
    ];
    const data: string[][] = [];
    data.push(salesSamePeriod.map((item) => item.targetYearTotal.toString()));
    data.push(salesSamePeriod.map((item) => item.previousYearTotal.toString()));
    return renderData(data, 2, label_x, label_y);
  };
  const renderSalesByTopics = () => {
    console.log(salesByTopic);
    const label_x = salesByTopic.map((item) => item.topicName);
    const label_y = [`Tổng`];
    const data: string[][] = [];
    data.push(salesByTopic.map((item) => item.totalPrice.toString()));

    return renderData(data, 1, label_x, label_y);
  };
  const renderSalesSamePeriodByTopics = () => {
    const label_x = salesSamePeriodByTopics.map((item) => item.topicName);
    const label_y = [
      `Tổng Năm ${selectedYear} `,
      `Tổng Năm ${parseInt(selectedYear) - 1}`,
    ];
    const data: string[][] = [];
    data.push(
      salesSamePeriodByTopics.map((item) => item.targetYearTotal.toString())
    );
    data.push(
      salesSamePeriodByTopics.map((item) => item.previousYearTotal.toString())
    );

    return renderData(data, 2, label_x, label_y);
  };

  const handleDateChange = (date: any) => {
    setSelectedDate(date);
    const selectedYear = date.getFullYear();
    setSelectedYear(selectedYear);
  };
  const handleMonthChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const month = event.target.value;
    setSelectedMonth(month);
  };

  return (
    <div className="w-full px-10 mt-10  custom-scrollbar overflow-y-scroll h-[800px]">
      <div className="flex gap-5">
        <div>
          <div className="text-[12px] italic">Vui lòng chọn tháng năm</div>
          <DatePicker
            showIcon
            selected={selectedDate}
            onChange={handleDateChange}
            dateFormat="yyyy"
            className="border rounded-sm pl-4 items-center w-44 h-10 mb-2"
            showYearPicker
            placeholderText="Chọn năm"
          />
        </div>
        <div className="relative inline-block w-44 ">
          <span className="absolute inset-y-0 left-0 flex items-center px-2 pointer-events-none">
            <FaCalendar className="h-4 w-4 " />
          </span>
          <select
            value={selectedMonth}
            onChange={handleMonthChange}
            className="w-full h-10 pl-0 pr-8 text-center border rounded-sm appearance-none mt-[18px]"
          >
            <option value="" className="text-gray-300 text-center">
              Chọn tháng
            </option>
            {[...Array(12)].map((_, index) => (
              <option key={index + 1} value={String(index + 1)}>
                Tháng {index + 1}
              </option>
            ))}
          </select>
        </div>
      </div>

      {selectedYear ? (
        <Fragment>
          <h5 className="flex-center text-2xl font-bold mb-10">
            Thống Kê {selectedMonth ? `Tháng ${selectedMonth}` : null} Năm{" "}
            {selectedYear}
          </h5>

          {statisticsData ? (
            <div className="flex-center gap-5">
              <div
                className={`block p-6 w-60 bg-red-300 border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700 flex-center flex-col`}
              >
                <h5 className="mb-2 w-max text-xl font-bold tracking-tight text-gray-900 dark:text-white">
                  Khóa Học Đã Duyệt
                </h5>
                <div className="font-normal text-gray-700 dark:text-gray-400 text-2xl">
                  {statisticsData?.totalApprovedCourse}
                </div>
              </div>
              <div className="block p-6 w-60 bg-yellow-300 border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700 flex-center flex-col">
                <h5 className="mb-2 w-max text-xl font-bold tracking-tight text-gray-900 dark:text-white">
                  Khóa Học Đã Đăng Ký
                </h5>
                <div className="font-normal text-gray-700 dark:text-gray-400 text-2xl">
                  {statisticsData?.totalRegisteredCourse}
                </div>
              </div>
              <div className="block p-6 w-60 bg-blue-300 border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700 flex-center flex-col">
                <h5 className="mb-2 w-max text-xl font-bold tracking-tight text-gray-900 dark:text-white">
                  Số User
                </h5>
                <div className="font-normal text-gray-700 dark:text-gray-400 text-2xl">
                  {statisticsData?.totalRegisteredUser}
                </div>
              </div>
              <div className="block p-6 w-60 bg-green-300 border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700 flex-center flex-col">
                <h5 className="mb-2 w-max text-xl font-bold tracking-tight text-gray-900 dark:text-white">
                  Doanh Thu (VNĐ)
                </h5>
                <div className="font-normal text-gray-700 dark:text-gray-400 text-2xl">
                  {statisticsData?.totalRevenue}
                </div>
              </div>
            </div>
          ) : null}

          <div className="my-5 text-2xl font-bold">Doanh Thu Theo Tháng</div>
          <div className="flex gap-5">
            <div className="w-1/2 h-[400px] border my-5 px-2 py-2 rounded-sm flex gap-5">
              <Bar data={renderMonthlySales()} options={options("Doanh Số ")} />
            </div>
            <div className="w-1/2 h-[400px] border my-5 px-2 py-2 rounded-sm flex gap-5">
              <Bar
                data={renderSalesSamePeriod()}
                options={options("Doanh Số Cùng Kỳ")}
              />
            </div>
          </div>
          <div className="my-5 text-2xl font-bold">Doanh Thu Theo Chủ Đề</div>
          <div className="gap-5">
            <div className="w-full h-[400px] border my-5 px-2 py-2 rounded-sm flex gap-5">
              <Bar
                data={renderSalesByTopics()}
                options={options("Doanh Số ")}
              />
            </div>
            <div className="w-full h-[400px] border my-5 px-2 py-2 rounded-sm flex gap-5">
              <Bar
                data={renderSalesSamePeriodByTopics()}
                options={options("Doanh Số Cùng Kỳ")}
              />
            </div>
          </div>
        </Fragment>
      ) : null}
    </div>
  );
}

export default OverviewPage;
