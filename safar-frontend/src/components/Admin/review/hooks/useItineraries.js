import { useState, useEffect } from 'react';
import { get } from '../../../../constants/axiosClient';

export const useItineraries = () => {
  const [itineraries, setItineraries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchItineraries = async () => {
    setLoading(true);
    try {
      const response = await get('/common/itineraries?limit=1000');
      if (response?.success && response?.data?.itineraries) {
        setItineraries(response.data.itineraries);
      }
    } catch (error) {
      setError(error);
      console.error('Error fetching itineraries:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItineraries();
  }, []);

  return {
    itineraries,
    loading,
    error,
    refreshItineraries: fetchItineraries
  };
};