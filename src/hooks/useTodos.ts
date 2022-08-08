import axios, { AxiosError } from 'axios';
import { useEffect, useState } from 'react';
import { ITag } from '../models/Tag';
import { ITask } from '../models/Task';

export function useTodos() {
  const [tags, setTags] = useState<ITag[]>([]);
  const [tasks, setTasks] = useState<ITask[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchTags();
    fetchTodos();
  }, []);

  const addTag = (tag: ITag) => {
    setTags((prev) => [...prev, tag]);
  };

  async function fetchTags() {
    try {
      setLoading(true);
      setError('');
      const response = await axios.get<ITag[]>('http://localhost:3001/tags');
      setTags(response.data);
      setLoading(false);
      console.log('hi');
    } catch (e) {
      const error = e as AxiosError;
      setLoading(false);
      setError(error.message);
    }
  }

  const addTodo = (task: ITask) => {
    setTasks((prev) => [...prev, task]);
  };

  async function fetchTodos() {
    try {
      setLoading(true);
      setError('');
      const response = await axios.get<ITask[]>('http://localhost:3001/tasks');
      setTasks(response.data);
      setLoading(false);
    } catch (e) {
      const error = e as AxiosError;
      setLoading(false);
      setError(error.message);
    }
  }

  return { tags, tasks, error, loading, addTag, addTodo };
}
