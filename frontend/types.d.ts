// API response types
// These types are used to define the structure of the data returned by the API.

type DistributionHistoryDBItem = {
    announcement_date: string;
    ex_dividend_date: string;
    record_date: string;
    payment_date: string;
    distribution_rate: number | null;
    distribution_per_share: number | null;
};

type ListingCodeEntry = {
    exchange: string;
    ticker: string;
    ric: string;
    sedol: string;
    ccy: string;
    listingDate: string;
}

interface ETFDBItem {
    id?: number;
    symbol: string;
    name: string;
    isin: string;
    net_asset_value: number | null;
    shares_outstanding: number | null;
    listings_and_codes?: ListingCodeEntry[] | null;
    distribution_history?: DistributionHistoryDBItem[] | null;
    variations?: string[] | null; // Array of ticker variations

}

type Instrument = {
    id?: number;
    ticker_id: number; // Foreign key to Ticker
    instrument_ticker: string; // Ticker used in Trading212
    isin: string; // ISIN code
    name: string; // Name of the instrument
    short_name: string; // Short name of the instrument
    currency: string; // Currency code
}

type PositionResponse = {
    id: number;
    instrument: Instrument;
    ticker: ETFDBItem;
    ticker_id: number;
    instrument_id: number;
    instrument_ticker: string;
    quantity: number;
    average_price: number;
    estimated_payout: number?;
    current_price: number;
    payout_updated_timestamp?: string;
}

type ETFResponse = {
    id: number;
    symbol: string;
    name: string;
    isin: string;
    latest_distribution: DistributionHistoryDBItem;
    distribution_history: DistributionHistoryDBItem[];
    listings_and_codes: ListingCodeEntry[];
    variations: string[];
    next_announcement_date: string;
}

// App types

type ETFItem = {
    name: string;
    ticker: string;
    shares: number;
    currentPrice: number;
    averagePrice: number;
    changePercentage: number;
    estimatedMonthlyPayout: number;
    payoutUpdated: string;
}

type PortfolioMetaWidgetKey = 'positions_count' | 'estimated_payout' | 'total_investment_value';
