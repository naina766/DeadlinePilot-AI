import { useState, useEffect, useCallback } from 'react';
import { getTasks, createTask, updateTask, deleteTask, autoScheduleTask, TaskItem } from '@/lib/api/task.api';

export const useTasks = (token: string | null, refreshTrigger: number = 0) => {
  const [tasks, setTasks] = useState<TaskItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTasks = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    setError(null);
    try {
      const data = await getTasks(token);
      setTasks(data);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to fetch tasks');
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks, refreshTrigger]);

  const handleCreateTask = async (taskData: Partial<TaskItem>) => {
    if (!token) return;
    setLoading(true);
    try {
      const created = await createTask(taskData, token);
      setTasks(prev => [...prev, created]);
      return created;
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to create task');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateTask = async (taskId: string, updates: Partial<TaskItem>) => {
    if (!token) return;
    try {
      const updated = await updateTask(taskId, updates, token);
      setTasks(prev => prev.map(t => t._id === taskId ? updated : t));
      return updated;
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to update task');
      throw err;
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    if (!token) return;
    try {
      await deleteTask(taskId, token);
      setTasks(prev => prev.filter(t => t._id !== taskId));
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to delete task');
      throw err;
    }
  };

  const handleAutoSchedule = async (taskId: string) => {
    if (!token) return;
    setLoading(true);
    try {
      const result = await autoScheduleTask(taskId, token);
      await fetchTasks();
      return result;
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to auto-schedule task');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    tasks,
    loading,
    error,
    refresh: fetchTasks,
    createTask: handleCreateTask,
    updateTask: handleUpdateTask,
    deleteTask: handleDeleteTask,
    autoSchedule: handleAutoSchedule
  };
};

export default useTasks;
