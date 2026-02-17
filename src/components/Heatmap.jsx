import dayjs from "dayjs";
import { useMemo } from "react";

// Bluestock Brand Colors
const intensityMap = {
    0: "bg-[#F6F5F5]", // not played
    1: "bg-[#D9E2FF]", // light
    2: "bg-[#C2D9FF]", // medium light
    3: "bg-[#7752FE]", // purple
    4: "bg-[#190482]", // deep blue
};

function getIntensity(entry) {
    if (!entry || entry.solved !== true) return 0;

    // Intensity based on difficulty + score
    if (entry.score >= 180) return 4;
    if (entry.difficulty === 3) return 3;
    if (entry.difficulty === 2) return 2;
    return 1;
}

export default function Heatmap({ activity = [] }) {
    // Convert array -> map
    const activityMap = useMemo(() => {
        const map = {};
        for (const item of activity) {
            map[item.date] = item;
        }
        return map;
    }, [activity]);

    // Generate 365 days from start of year
    const days = useMemo(() => {
        const start = dayjs().startOf("year");
        const list = [];

        for (let i = 0; i < 365; i++) {
            list.push(start.add(i, "day"));
        }

        return list;
    }, []);

    // Convert into week columns
    const weeks = useMemo(() => {
        const cols = [];
        let currentWeek = [];

        for (let i = 0; i < days.length; i++) {
            currentWeek.push(days[i]);

            if (currentWeek.length === 7) {
                cols.push(currentWeek);
                currentWeek = [];
            }
        }

        if (currentWeek.length > 0) cols.push(currentWeek);

        return cols;
    }, [days]);

    const todayStr = dayjs().format("YYYY-MM-DD");

    return (
        <div className="w-full overflow-x-auto">
            <div className="min-w-[900px]">
                {/* GRID */}
                <div className="flex gap-[4px]">
                    {weeks.map((week, wIndex) => (
                        <div key={wIndex} className="flex flex-col gap-[4px]">
                            {Array.from({ length: 7 }).map((_, dIndex) => {
                                const day = week[dIndex];

                                // Empty cell (last week)
                                if (!day) {
                                    return (
                                        <div
                                            key={dIndex}
                                            className="w-4 h-4 rounded-[4px] bg-transparent"
                                        />
                                    );
                                }

                                const dateStr = day.format("YYYY-MM-DD");
                                const entry = activityMap[dateStr];
                                const intensity = getIntensity(entry);
                                const isToday = dateStr === todayStr;

                                return (
                                    <div
                                        key={dIndex}
                                        title={
                                            entry?.solved
                                                ? `${dateStr} | Score: ${entry.score} | Time: ${entry.timeTaken}s | Difficulty: ${entry.difficulty}`
                                                : dateStr
                                        }
                                        className={[
                                            "w-4 h-4 rounded-[4px] transition",
                                            intensityMap[intensity],
                                            isToday ? "ring-2 ring-[#414BEA]" : "",
                                        ].join(" ")}
                                    />
                                );
                            })}
                        </div>
                    ))}
                </div>

                {/* LEGEND */}
                <div className="mt-4 flex items-center gap-2 text-sm text-slate-600">
                    <span>Less</span>

                    <div className="flex gap-1">
                        <div className={`w-4 h-4 rounded-[4px] ${intensityMap[0]}`} />
                        <div className={`w-4 h-4 rounded-[4px] ${intensityMap[1]}`} />
                        <div className={`w-4 h-4 rounded-[4px] ${intensityMap[2]}`} />
                        <div className={`w-4 h-4 rounded-[4px] ${intensityMap[3]}`} />
                        <div className={`w-4 h-4 rounded-[4px] ${intensityMap[4]}`} />
                    </div>

                    <span>More</span>
                </div>
            </div>
        </div>
    );
}
