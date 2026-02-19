import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer

} from 'recharts';

function StatsChart({ stats }) {
    const data = [
        { name: 'Applied', value: stats.applied || 0 },
        { name: 'Interview', value: stats.interview || 0 },
        { name: 'Rejected', value: stats.rejected || 0 },
    ];

    return (
        <div className="card">
            <h4>Applications Overview</h4>
            <ResponsiveContainer width="100%" height={300}>
                <BarChart data={data}>
                    <XAxis dataKey="name" />
                    <YAxis allowDecimals={false} />
                    <Tooltip />
                    <Bar dataKey="value" fill="#3b82f6" />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}

export default StatsChart;