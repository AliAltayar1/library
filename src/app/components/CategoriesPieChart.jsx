"use client";

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { stringToColor } from "../utils/colorsGenerator";

const LegendList = ({ data }) => (
  <div
    className="flex flex-wrap md:flex-col md:px-10 justify-center gap-3 text-right  "
    style={{ direction: "rtl" }}
  >
    {data.map((item, idx) => (
      <div key={item.name} className="flex items-center gap-1   ">
        <span
          className="min-w-3.5 min-h-3.5 rounded-sm"
          style={{ backgroundColor: stringToColor(item.name) }}
        />
        <span className="text-sm font-medium whitespace-nowrap">
          {item.name}
        </span>
      </div>
    ))}
  </div>
);

export default function CategoriesPieChart({ data }) {
  console.log(data);

  const total = data && data.reduce((a, b) => a + b.value, 0);

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 ">
        <h2 className="text-lg font-semibold text-right">
          📊 توزيع الكتب حسب التصنيف
        </h2>
        <span className="text-sm text-gray-500">الإجمالي: {total}</span>
      </div>

      {/* ✅ RESPONSIVE FLEX */}
      <div className="flex flex-col gap-8 md:flex-row-reverse md:items-center md:justify-between ">
        {/* Legend (RIGHT on desktop, TOP on mobile) */}

        <div className="order-2 lg:order-1 lg:w-[220px]">
          <LegendList data={data} />
        </div>

        {/* Chart */}
        <div className=" w-full h-[260px] sm:h-[340px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                dataKey="value"
                nameKey="name"
                innerRadius="40%"
                outerRadius="70%"
                paddingAngle={3}
              >
                {data.map((_, i) => (
                  <Cell key={i} fill={stringToColor(data[i].name)} />
                ))}
              </Pie>

              <Tooltip formatter={(v, n) => [`${v} كتاب`, n]} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
