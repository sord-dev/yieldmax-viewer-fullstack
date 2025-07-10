import styles from './styles.module.css'
// import from public folder

import yieldmaxLogo from '/yieldmax-scraper-logo.svg'
import { NavBarLink, NavBarTickerItem } from './partials'
import { useBreadCrumb } from '../../hooks/useBreadCrumb'

type NavBarProps = {
    ETFDetails: { ticker: string, payout: number }[]
}

const NavBar = ({ ETFDetails }: NavBarProps) => {
    const breadcrumb = useBreadCrumb();

    return (
        <div className={styles['navbar']}>

            <div className={styles['navbar-wrapper']}>

                <div className={styles['navbar-content']}>
                    <div className={styles['logo']}>
                        <img src={yieldmaxLogo} alt="YieldMax Logo" />
                    </div>

                    <nav className={styles['nav-links']}>
                        <ul>
                            <NavBarLink to="/" label="Portfolio" breadcrumb={breadcrumb} />
                            <NavBarLink to="/etfs" label="ETFs" breadcrumb={breadcrumb} />
                        </ul>
                    </nav>
                </div>

                <div className={styles['etf-details']}>
                    {ETFDetails.map((detail, index) => (
                        <NavBarTickerItem key={index} ticker={detail.ticker} payout={detail.payout} />
                    ))}
                </div>
            </div>
        </div>
    )
}

export default NavBar