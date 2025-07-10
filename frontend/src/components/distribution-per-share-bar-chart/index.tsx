import { Bar, BarChart, CartesianGrid, Legend, Tooltip, XAxis, YAxis } from 'recharts'

type DistributionProps = {
    distributionData: {
        date: string;
        amount: number;
    }[],
    currency?: string; // Optional currency prop
}

const DistributionPerShareBarChart = ({ distributionData, currency }: DistributionProps) => {
    // Ensure the distributionData is not empty
    if (!distributionData || distributionData.length === 0) {
        return <div>No distribution data available</div>;
    }

    return (
        <div>
            <h4>Distribution Per Share (In {currency})</h4>
            <BarChart width={500} height={300} data={distributionData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="amount" fill="#8884d8" />
            </BarChart>
        </div>
    )
}

export default DistributionPerShareBarChart