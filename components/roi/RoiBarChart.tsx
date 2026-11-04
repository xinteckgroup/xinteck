"use client";

import { useSyncExternalStore } from "react";
import type { CashflowDataPoint } from "@/types/roi";
import { formatKES } from "@/lib/roi-calculator";
import {
    Bar,
    BarChart,
    CartesianGrid,
    Legend,
    ReferenceLine,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";

interface RoiBarChartProps {
    data: CashflowDataPoint[];
}

const emptySubscribe = () => () => {};

function useIsClient() {
    return useSyncExternalStore(
        emptySubscribe,
        () => true,
        () => false
    );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function CustomTooltip({ active, payload, label }: any) {
    if (!active || !payload || payload.length === 0) return null;

    return (
        <div className="bg-black/95 border border-white/10 backdrop-blur-xl rounded-[10px] p-3 shadow-2xl">
            <p className="text-xs font-bold text-white mb-2">{label}</p>
            {payload.map(
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                (entry: any, index: number) => (
                    <p
                        key={index}
                        className="text-xs"
                        style={{ color: entry.color }}
                    >
                        {entry.name}: {formatKES(entry.value)}
                    </p>
                )
            )}
        </div>
    );
}

export function RoiBarChart({ data }: RoiBarChartProps) {
    const isMounted = useIsClient();

    // Sample data for readability: show every 3rd month
    const sampledData = data.filter(
        (_, i) => i === 0 || i % 3 === 0 || i === data.length - 1
    );

    if (!isMounted) {
        return (
            <div className="w-full h-[280px] md:h-[340px] flex items-center justify-center">
                <div className="w-6 h-6 border-2 border-[#D4AF37] border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="w-full h-[280px] md:h-[340px] min-w-0">
            <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={280}>
                <BarChart
                    data={sampledData}
                    margin={{ top: 10, right: 10, left: 10, bottom: 0 }}
                    barGap={2}
                >
                    <CartesianGrid
                        strokeDasharray="3 3"
                        stroke="rgba(255,255,255,0.05)"
                        vertical={false}
                    />
                    <XAxis
                        dataKey="month"
                        tick={{ fill: "#888", fontSize: 11 }}
                        axisLine={{ stroke: "rgba(255,255,255,0.1)" }}
                        tickLine={false}
                    />
                    <YAxis
                        tick={{ fill: "#888", fontSize: 11 }}
                        axisLine={false}
                        tickLine={false}
                        tickFormatter={(val: number) => formatKES(val)}
                        width={75}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend
                        wrapperStyle={{
                            fontSize: "11px",
                            paddingTop: "12px",
                        }}
                    />
                    <ReferenceLine y={0} stroke="rgba(255,255,255,0.2)" />
                    <Bar
                        dataKey="doNothing"
                        name="Do Nothing (Opportunity Cost)"
                        fill="#ef4444"
                        radius={[4, 4, 0, 0]}
                        opacity={0.7}
                    />
                    <Bar
                        dataKey="investWithXinteck"
                        name="Invest with Xinteck"
                        fill="#D4AF37"
                        radius={[4, 4, 0, 0]}
                        opacity={0.9}
                    />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}

