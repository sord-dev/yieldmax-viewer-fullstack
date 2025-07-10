import React, { createContext, useState } from 'react';

type AppDataContextType = {
    positions: PositionResponse[];
    updatePositions: (newPositions: PositionResponse[]) => void;
    returnPayoutSummary: () => { ticker: string, payout: number }[];
    returnTotalEstimatedPayout: () => number;
    returnPositionInfo: (ticker: string | undefined) => ETFItem[] | null;
};

const AppDataContext = createContext<AppDataContextType | undefined>(undefined);

export const AppDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [positions, setPositions] = useState<PositionResponse[]>([]);

    const updatePositions = (newPositions: PositionResponse[]) => {
        if (!newPositions || newPositions.length === 0) {
            setPositions([]);
            return;
        }

        console.log(`Updating positions with ${newPositions.length} items`);
        setPositions(newPositions);
    };

    const returnPayoutSummary = () => {
        if (!positions || positions.length === 0) {
            return [];
        }
        // order positions by estimated payout in descending order

        const orderedPositions = positions
            .slice() // create a shallow copy to avoid mutating state
            .sort((a, b) => {
                return (b.estimated_payout || 0) - (a.estimated_payout || 0);
            })
            .slice(0, 3); // take top 3 positions

        return orderedPositions.map(position => ({
            ticker: position.instrument.instrument_ticker.slice(0, 4).toUpperCase(),
            payout: position.estimated_payout || 0
        }));
    };

    const returnTotalEstimatedPayout = () => {
        if (!positions || positions.length === 0) {
            return 0;
        }
        return positions.reduce((total, position) => {
            return total + (position.estimated_payout || 0);
        }, 0);
    };

    const returnPositionInfo = (ticker: string | undefined) => {
        if (!ticker) {
            return positions.map(position => ({
                name: position.instrument.name,
                ticker: position.instrument.instrument_ticker.slice(0, 4).toUpperCase(),
                shares: position.quantity,
                currentPrice: position.current_price,
                averagePrice: position.average_price,
                changePercentage: ((position.current_price - position.average_price) / position.average_price) * 100,
                estimatedMonthlyPayout: position.estimated_payout ?? 0,
                payoutUpdated: position.payout_updated_timestamp ?? ''
            }));
        }

        const filteredPositions = positions.filter(position => {
            return position.ticker.symbol === ticker || position.instrument.instrument_ticker.slice(0, 4).toUpperCase() === ticker.toUpperCase();
        });
        if (filteredPositions.length === 0) {
            return null;
        }

        return filteredPositions.map(position => ({
            name: position.instrument.name,
            ticker: position.instrument.instrument_ticker.slice(0, 4).toUpperCase(),
            shares: position.quantity,
            currentPrice: position.current_price,
            averagePrice: position.average_price,
            changePercentage: ((position.current_price - position.average_price) / position.average_price) * 100,
            estimatedMonthlyPayout: position.estimated_payout ?? 0,
            payoutUpdated: position.payout_updated_timestamp ?? ''
        }));
    };

    return (
        <AppDataContext.Provider value={{ positions, updatePositions, returnPayoutSummary, returnTotalEstimatedPayout, returnPositionInfo }}>
            {children}
        </AppDataContext.Provider>
    );
};


export const useAppData = () => {
    const context = React.useContext(AppDataContext);
    if (!context) {
        throw new Error('useAppData must be used within an AppDataProvider');
    }
    return context;
};