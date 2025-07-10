import axios from "axios";
import { useAppData } from "../contexts/AppDataContext";
import { useEffect } from "react";

const useFetchPositions = () => {
    const { updatePositions } = useAppData();

    useEffect(() => {
        const fetchPositionData = async () => {
            try {
                const response = await axios.get<PositionResponse[]>(`http://localhost:2002/etf/positions`);
                if (!response.data) {
                    console.warn('No positions data received');
                    return;
                }

                updatePositions(response.data);
            } catch (error) {
                console.error('Error fetching positions data:', error);
            }
        }

        fetchPositionData();
    }, []);

    return null; // This hook does not return anything, it just fetches data and updates context
};

export default useFetchPositions;
