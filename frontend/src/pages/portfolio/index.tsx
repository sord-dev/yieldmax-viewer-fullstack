import styles from './styles.module.css'
import { DashboardStatChartWidget, ETFTable } from '../../components'
import { useAppData } from '../../contexts/AppDataContext'
import { useEffect, useState } from 'react';
import axios from 'axios';

interface PortfolioMeta {
    date: string;
    total_estimated_payout: number;
    total_invested: number;
    total_positions: number;
}

// Extend PortfolioMeta for widget keys
interface PortfolioMetaExtended extends PortfolioMeta {
    positions_count?: number;
    estimated_payout?: number;
    total_investment_value?: number;
}

const PortfolioPage = () => {
    const [portfolioMeta, setPortfolioMeta] = useState<PortfolioMeta[] | undefined>()
    const { returnTotalEstimatedPayout, returnPositionInfo } = useAppData()

    useEffect(() => {
        const fetchPortfolioMeta = async () => {
            try {
                const response = await axios.get('http://localhost:2002/portfolio/metadata');
                if (!response.data || !Array.isArray(response.data)) {
                    throw new Error('Invalid data format received from the server');
                }

                console.log('Portfolio Meta Data:', response.data);
                setPortfolioMeta(response.data as PortfolioMeta[]);
            } catch (error) {
                console.error('Error fetching portfolio meta:', error);
            }
        };

        fetchPortfolioMeta();
    }, []);

    const keyMap: Record<PortfolioMetaWidgetKey, keyof PortfolioMetaExtended> = {
        positions_count: 'positions_count',
        estimated_payout: 'estimated_payout',
        total_investment_value: 'total_investment_value',
    };

    const returnWidgetInfo = (
        info: PortfolioMetaExtended[] | undefined,
        key: PortfolioMetaWidgetKey
    ) => {
        if (!info) return [];
        return info.map(meta => ({
            date: meta.date,
            value: Number(meta[keyMap[key]]) || 0,
        }));
    };


    return (
        <div className={styles['portfolio-page']}>

            <h2 className={styles['portfolio-title']}>Estimated Monthly Payout</h2>
            <h1 className={styles['est-monthly-payout']}>£{returnTotalEstimatedPayout().toFixed(2)}</h1>

            <div className={styles['portfolio-stats']}>
                <DashboardStatChartWidget
                    label="Positions"
                    data={returnWidgetInfo(portfolioMeta, 'positions_count')}
                    currency={false}
                />
                <DashboardStatChartWidget
                    label="Avr Est Monthly Payout"
                    data={returnWidgetInfo(portfolioMeta, 'estimated_payout')}
                />
                <DashboardStatChartWidget
                    label="Avr Portfolio Value"
                    data={returnWidgetInfo(portfolioMeta, 'total_investment_value')}
                />
            </div>

            <ETFTable data={returnPositionInfo(undefined) || []} />
        </div>
    )
}

export default PortfolioPage