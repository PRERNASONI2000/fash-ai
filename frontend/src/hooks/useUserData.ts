
// src/hooks/useUserData.ts
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL;

interface UserData {
  name: string;
  email: string;
  credits: number;
  activePlan: { name: string; credits: number } | null;
  purchasedAddons: Array<{ name: string; credits: number }>;
}

export function useUserData() {
  const [userData, setUserData] = useState<UserData>({
    name: '',
    email: '',
    credits: 0,
    activePlan: null,
    purchasedAddons: [],
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setIsLoading(false);
      return;
    }

    const fetchUserData = async () => {
      setIsLoading(true);
      setError('');
      try {
        const response = await fetch(`${API_URL}/api/auth/profile`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.message || 'Failed to load user data');
        }
        
        setUserData({
          name: data.name || '',
          email: data.email || '',
          credits: data.credits ?? 0,
          activePlan: data.activePlan || null,
          purchasedAddons: data.purchasedAddons || [],
        });
      } catch (err: any) {
        setError(err.message || 'Unable to load user data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [navigate]);

  return { userData, isLoading, error, setUserData };
}