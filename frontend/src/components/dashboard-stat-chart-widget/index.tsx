import { LineChart, Line, ResponsiveContainer } from 'recharts';
import { ArrowUp, ArrowDown } from 'lucide-react';
import styles from './styles.module.css'; // Import the CSS module

type DashboardStatChartWidgetProps = {
    label: string;
    data: Array<{ date: string; value: number }> | undefined;
    currency?: boolean;
}

export default function DashboardStatChartWidget({ data = [], label, currency = true }: DashboardStatChartWidgetProps) {
    const safeData = data || [];

    console.log('Widget Data:', safeData);

    const currentValue = safeData.length > 0 ? safeData[safeData.length - 1].value : 0;
    const previousValue = safeData.length > 1 ? safeData[safeData.length - 2].value : 0;

    let percentageChange = 0;
    if (previousValue !== 0 && safeData.length > 1) {
        percentageChange = ((currentValue - previousValue) / previousValue) * 100;
    }

    const isPositiveChange = percentageChange >= 0;
    const arrowIcon = isPositiveChange ? <ArrowUp size={16} className={styles.arrowIcon} /> : <ArrowDown size={16} className={styles.arrowIcon} />;
    const percentageChangeClass = isPositiveChange ? styles.positive : styles.negative;

    return (
        <div className={styles.widgetContainer}>
            {/* Label */}
            <div className={styles.label}>
                {label}
            </div>

            {/* Value and Percentage Change */}
            <div className={styles.valueChangeWrapper}>
                <div className={styles.valueGroup}>
                    <span className={styles.currentValue}>
                        {currency ? '£' : ''}{currentValue.toFixed(2)}
                    </span>
                    <span className={`${styles.percentageChange} ${percentageChangeClass}`}>
                        {arrowIcon}
                        {Math.abs(percentageChange).toFixed(0)}%
                    </span>
                </div>
                {/* Sparkline Chart */}
                <div className={styles.chartContainer}>
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={safeData} margin={{ top: 5, right: 0, left: 0, bottom: 5 }}>
                            <Line type="monotone" dataKey="value" stroke="#8884d8" strokeWidth={2} dot={false} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Comparison Text */}
            <div className={styles.comparisonText}>
                compared to last week
            </div>
        </div>
    );
}
