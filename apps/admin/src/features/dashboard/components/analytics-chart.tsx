
import { Area, AreaChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend } from 'recharts'

const data = [
    {
        name: 'Mon',
        clicks: Math.floor(Math.random() * 900) + 100,
        uniques: Math.floor(Math.random() * 700) + 80,
    },
    {
        name: 'Tue',
        clicks: Math.floor(Math.random() * 900) + 100,
        uniques: Math.floor(Math.random() * 700) + 80,
    },
    {
        name: 'Wed',
        clicks: Math.floor(Math.random() * 900) + 100,
        uniques: Math.floor(Math.random() * 700) + 80,
    },
    {
        name: 'Thu',
        clicks: Math.floor(Math.random() * 900) + 100,
        uniques: Math.floor(Math.random() * 700) + 80,
    },
    {
        name: 'Fri',
        clicks: Math.floor(Math.random() * 900) + 100,
        uniques: Math.floor(Math.random() * 700) + 80,
    },
    {
        name: 'Sat',
        clicks: Math.floor(Math.random() * 900) + 100,
        uniques: Math.floor(Math.random() * 700) + 80,
    },
    {
        name: 'Sun',
        clicks: Math.floor(Math.random() * 900) + 100,
        uniques: Math.floor(Math.random() * 700) + 80,
    },
]

export function AnalyticsChart() {
    return (
        <ResponsiveContainer width='100%' height={350}>
            <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                    <linearGradient id="colorClicks" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="var(--color-primary)" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="var(--color-primary)" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorUniques" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="var(--color-chart-2)" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="var(--color-chart-2)" stopOpacity={0} />
                    </linearGradient>
                </defs>
                <XAxis
                    dataKey='name'
                    stroke='#888888'
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    tickMargin={10}
                />
                <YAxis
                    stroke='#888888'
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => `${value}`}
                />
                <Tooltip
                    content={({ active, payload, label }) => {
                        if (active && payload && payload.length) {
                            return (
                                <div className="rounded-lg border bg-background p-2 shadow-sm">
                                    <div className="grid grid-cols-2 gap-2">
                                        <div className="flex flex-col">
                                            <span className="text-[0.70rem] uppercase text-muted-foreground">
                                                {label}
                                            </span>
                                            <span className="font-bold text-muted-foreground">
                                                {payload[0].value}
                                            </span>
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-[0.70rem] uppercase text-muted-foreground">
                                                Unique
                                            </span>
                                            <span className="font-bold text-muted-foreground">
                                                {payload[1]?.value}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            )
                        }
                        return null
                    }}
                />
                <Legend
                    verticalAlign="top"
                    height={36}
                    iconType="circle"
                    wrapperStyle={{ paddingTop: '10px', paddingBottom: '20px', fontSize: '14px', fontWeight: 500 }}
                />
                <Area
                    type='monotone'
                    dataKey='clicks'
                    name="Total Clicks"
                    stroke='var(--color-primary)'
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorClicks)"
                />
                <Area
                    type='monotone'
                    dataKey='uniques'
                    name="Unique Visitors"
                    stroke='var(--color-chart-2)'
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorUniques)"
                />
            </AreaChart>
        </ResponsiveContainer>
    )
}
