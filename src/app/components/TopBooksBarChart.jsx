"use client";

import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { LabelList } from "recharts";

export default function TopBooksBarChart({ data }) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 640);
    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border-gray-300">
      <h2 className="text-lg font-semibold mb-4 text-right">
        🏆 أكثر الكتب استعارة
      </h2>

      <div className="w-full h-[320px] sm:h-[360px]">
        <ResponsiveContainer width="100%" height="100%">
          {isMobile ? (
            // ✅ Mobile: normal (vertical) bar chart
            <BarChart
              data={data}
              margin={{ top: 10, right: 10, left: 10, bottom: 40 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="title" tick={false} axisLine={false} height={0} />
              <YAxis
                allowDecimals={false}
                type="number"
                width={1} // 👈 مهم
              />
              <Tooltip formatter={(v) => [`${v} مرة`, "الاستعارات"]} />
              <Bar dataKey="count" fill="#2563eb" radius={[8, 8, 8, 8]}>
                <LabelList
                  dataKey="title"
                  position="insideBottom"
                  fill="#ffffff"
                  fontSize={8}
                  fontWeight="500"
                />
              </Bar>
            </BarChart>
          ) : (
            // ✅ Desktop: vertical layout (titles on Y)
            <BarChart
              data={data}
              layout="vertical"
              margin={{ top: 10, right: 10, left: 10, bottom: 10 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" allowDecimals={false} />
              <YAxis
                type="category"
                dataKey="title"
                width={0} // 👈 مهم
                tick={false} // 👈 نخفي النص الافتراضي
              />
              <Tooltip formatter={(v) => [`${v} مرة`, "الاستعارات"]} />
              <Bar dataKey="count" fill="#2563eb" radius={[8, 8, 8, 8]}>
                <LabelList
                  dataKey="title"
                  position="insideLift"
                  fill="#ffffff"
                  fontSize={13}
                  fontWeight="500"
                />
              </Bar>
            </BarChart>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  );
}
