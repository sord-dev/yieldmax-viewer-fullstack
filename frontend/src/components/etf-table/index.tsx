import styles from './styles.module.css'; // Import the CSS module
import { Link } from 'react-router-dom';

type ETFTableProps = {
    data: ETFItem[];
}

const ETFTable = ({ data }: ETFTableProps) => {
    if (!data || data.length === 0) {
        return <p>No ETF data available.</p>;
    }
    
  return (
    <table className={styles['etf-table']}>
        <thead>
            <tr>
            <th>Name</th>
            <th>Ticker</th>
            <th>Shares</th>
            <th>Current Price</th>
            <th>Average Price</th>
            <th>Change %</th>
            <th>Est. Monthly Payout</th>
            </tr>
        </thead>
        <tbody>
            {data.map((etf, index) => (
            <tr key={index}>
                <td><Link to={`/etfs/${etf.ticker}`}>{etf.name}</Link></td>
                <td>{etf.ticker}</td>
                <td>{etf.shares}</td>
                <td>{etf.currentPrice.toFixed(2)}</td>
                <td>{etf.averagePrice.toFixed(2)}</td>
                <td className={etf.changePercentage >= 0 ? styles.positive : styles.negative}>
                {etf.changePercentage.toFixed(2)}%
                </td>
                <td>£{etf.estimatedMonthlyPayout.toFixed(2)}</td>
            </tr>
            ))}
        </tbody>
    </table>
  )
}

export default ETFTable