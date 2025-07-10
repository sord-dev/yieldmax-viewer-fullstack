import styles from './styles.module.css'; // Import the CSS module

type DistributionTableProps = {
    data: DistributionHistoryDBItem[];
}

const DistributionTable = ({ data }: DistributionTableProps) => {
    if (!data || data.length === 0) {
        return <p>No distribution history data available.</p>;
    }
    
  return (
    <table className={styles['distribution-table']}>
        <thead>
            <tr>
            <th>Announcement Date</th>
            <th>Ex Date</th>
            <th>Record Date</th>
            <th>Payment Date</th>
            <th>Distribution Rate</th>
            <th>Distribution Per Share</th>
            </tr>
        </thead>
        <tbody>
            {data.map((distributionHistoryItem, index) => (
            <tr key={index}>
                <td>{distributionHistoryItem.announcement_date}</td>
                <td>{distributionHistoryItem.ex_dividend_date}</td>
                <td>{distributionHistoryItem.record_date}</td>
                <td>{distributionHistoryItem.payment_date}</td>
                <td>{distributionHistoryItem.distribution_rate != null ? `${distributionHistoryItem.distribution_rate}%` : 'N/A'}</td>
                <td>
                  {distributionHistoryItem.distribution_per_share != null
                    ? `$${distributionHistoryItem.distribution_per_share.toFixed(2)}`
                    : 'N/A'}
                </td>
            </tr>
            ))}
        </tbody>
    </table>
  )
}

export default DistributionTable;