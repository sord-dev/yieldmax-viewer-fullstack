import { Link } from 'react-router-dom';
import styles from '../styles.module.css'

export const NavBarTickerItem = ({ ticker, payout }: { ticker: string; payout: number }) => {
    return (
        <Link to={`/etfs/${ticker}`}>
            <div className={styles['etf-detail']}>
                <p className={styles['etf-detail-title']}>Est Payout</p>
                <div className={styles['etf-detail-content']}>
                    <p className={styles['etf-detail-ticker']}>{ticker}</p>
                    <p className={styles['etf-detail-payout']}>£ {payout.toFixed(2)}</p>
                </div>
            </div>
        </Link>
    );
}

export const NavBarLink = ({ to, label, breadcrumb }: { to: string; label: string; breadcrumb: string[] }) => {
    const lowercaseBreadcrumb = breadcrumb.map(item => item.toLowerCase());
    if (lowercaseBreadcrumb.includes(label.toLowerCase())) {
        if(breadcrumb.length > 1) {
            return (
                <li className={styles['active']}><Link to={to}>{label + ' /' + breadcrumb[breadcrumb.length - 1]}</Link></li>
            )
        }
        return (
            <li className={styles['active']}><Link to={to}>{label}</Link></li>
        )
    }

    if (breadcrumb.length === 0 && to === '/') {
        return (
            <li className={styles['active']}><Link to={to}>{label}</Link></li>
        )
    }

    return (
        <li><Link to={to}>{label}</Link></li>
    )
}