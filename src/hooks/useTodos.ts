import axios, { AxiosError } from 'axios';
import { useEffect, useState } from 'react';

export function useTodos<T>(link: string) {
  const [items, setItems] = useState<T[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchItems();
    // eslint-disable-next-line
  }, []);

  async function addItem(item: T) {
    try {
      setLoading(true);
      setError('');
      const response = await axios.post<T>(
        `http://localhost:3001/${link}`,
        item
      );
      setItems((prev) => [...prev, response.data]);
      setLoading(false);
    } catch (e) {
      const error = e as AxiosError;
      setLoading(false);
      setError(error.message);
    }
  }

  async function fetchItems() {
    try {
      setLoading(true);
      setError('');
      const response = await axios.get<T[]>(`http://localhost:3001/${link}`);
      setItems(response.data);
      setLoading(false);
    } catch (e) {
      const error = e as AxiosError;
      setLoading(false);
      setError(error.message);
    }
  }

  return { items, error, loading, addItem };
}
