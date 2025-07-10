import { useEffect, useState } from 'react';
import styles from './styles.module.css'
import { useParams } from 'react-router'
import axios from 'axios';
import { useAppData } from '../../contexts/AppDataContext';
import useFetchPositions from '../../hooks/useFetchPositions';
import { formatDate } from '../../utils';
import { DistributionPerShareBarChart, DistributionTable } from '../../components';

const ETFPage = () => {
    const { etfName } = useParams<{ etfName: string }>();
    const { returnPositionInfo } = useAppData();
    const [etfData, setEtfData] = useState<ETFResponse | null>(null);
    useFetchPositions()

    useEffect(() => {
        const fetchETFData = async () => {
            try {
                const response = await axios.get(`http://localhost:2002/etf/${etfName}`);

                if (!response.data || Object.keys(response.data).length === 0) {
                    console.warn('No ETF data found for:', etfName);
                    return;
                }

                console.log('ETF Data:', response.data);
                setEtfData(response.data);
            } catch (error) {
                console.error('Error fetching ETF data:', error);
            }
        }

        fetchETFData();
    }, [etfName]);

    const positions = returnPositionInfo(etfName);
    const positionsData = positions ? positions[0] : null;
    
    if (!etfData || !positionsData) {
        return <div className={styles['loading']}>Loading...</div>;
    }
    
    if (!etfData.distribution_history || etfData.distribution_history.length === 0) {
        return <div className={styles['no-data']}>No distribution history available for this ETF.</div>;
    }
    
    if (!etfData.latest_distribution || !etfData.next_announcement_date) {
        return <div className={styles['no-data']}>Insufficient data to display ETF details.</div>;
    }
    
    const distributions = etfData.distribution_history.map((item) => {

        return {
            date: item.announcement_date.replace(/\\/g, '-'),
            amount: item.distribution_per_share || 0, // Default to 0 if distribution_per_share is undefined
        };

    }).filter(item => item !== null);

    return (
        <div className={styles['etf-page']}>
            <div className={styles['hero']}>
                <div className={styles['hero-content']}>
                    <div className={styles['hero-right']}>
                        <h1>{positionsData.name}</h1>

                        <div className={styles['hero-info']}>
                            <div className={styles['hero-info-item']}>
                                <h3>Estimated Payout:</h3>
                                <ul>
                                    <li>Amount: £{positionsData.estimatedMonthlyPayout.toFixed(2)}</li>
                                    <li>Shares Owned: {positionsData.shares}</li>
                                    <li>Previous Distribution Rate: {etfData.latest_distribution.distribution_rate}%</li>
                                </ul>
                            </div>

                            <div className={styles['hero-info-item']}>
                                <h3>Next Monthly Distribution</h3>
                                <ul>
                                    <li>Announcement Date: {etfData.next_announcement_date}</li>
                                    <li>Payment Date: TO ADD ON BACKEND</li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    <div className={styles['hero-left']}>
                        <div className={styles['etf-meta']}>

                            <div className={styles['etf-meta-item']}>
                                <div>ISIN:</div>
                                <div>{etfData.isin}</div>
                            </div>
                            <div className={styles['etf-meta-item']}>
                                <div>Symbol:</div>
                                <div>{etfData.symbol}</div>
                            </div>
                            <div className={styles['etf-meta-item']}>
                                <div>Payout Updated:</div>
                                <div>{formatDate(positionsData.payoutUpdated)}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className={styles['etf-details']}>
                <DistributionPerShareBarChart distributionData={distributions} currency={'USD'} />
                <DistributionTable data={etfData.distribution_history} />
            </div>
        </div>
    )
}

export default ETFPage