"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Label,
} from "recharts";

export default function BorrowLineChart({ data }) {
  return (
    <div className="bg-white rounded-2xl border-gray-200 shadow-sm p-6">
      {/* Title */}
      <h2 className="text-lg font-semibold text-right mb-4">
        📈 حركة الاستعارات
      </h2>

      {/* Chart */}
      <div className="w-full h-[320px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{ top: 20, right: 10, left: 10, bottom: 20 }}
          >
            <CartesianGrid strokeDasharray="3 3" />

            {/* X Axis */}
            <XAxis dataKey="date">
              <Label
                value="التاريخ"
                position="insideBottom"
                offset={-10}
                className="fill-gray-600 text-sm font-medium"
              />
            </XAxis>

            {/* Y Axis */}
            <YAxis allowDecimals={false} width={10}>
              <Label
                value="عدد الاستعارات"
                angle={-90}
                position="insideLeft"
                offset={-6}
                className="fill-gray-600 text-sm font-medium"
              />
            </YAxis>

            {/* Tooltip */}
            <Tooltip
              formatter={(value) => [`${value} مرة`, "الاستعارات"]}
              labelFormatter={(label) => `التاريخ: ${label}`}
            />

            {/* Line */}
            <Line
              type="monotone"
              dataKey="count"
              stroke="#2563eb"
              strokeWidth={3}
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
