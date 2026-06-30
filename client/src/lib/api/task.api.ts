const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';

export interface TaskItem {
  _id: string;
  title: string;
  description: string;
  deadline: string;
  estimatedHours: number;
  actualHours: number;
  status: string;
  priority: string;
  category: string;
  deadlineRiskPercent: number;
  scheduledStart?: string;
  scheduledEnd?: string;
  subtasks: any[];
}

export const getTasks = async (token: string): Promise<TaskItem[]> => {
  const response = await fetch(`${API_URL}/api/tasks`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  if (!response.ok) throw new Error('Failed to fetch tasks');
  return response.json();
};

export const createTask = async (task: Partial<TaskItem>, token: string): Promise<TaskItem> => {
  const response = await fetch(`${API_URL}/api/tasks`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(task)
  });
  if (!response.ok) throw new Error('Failed to create task');
  return response.json();
};

export const updateTask = async (taskId: string, updates: Partial<TaskItem>, token: string): Promise<TaskItem> => {
  const response = await fetch(`${API_URL}/api/tasks/${taskId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(updates)
  });
  if (!response.ok) throw new Error('Failed to update task');
  return response.json();
};

export const deleteTask = async (taskId: string, token: string): Promise<boolean> => {
  const response = await fetch(`${API_URL}/api/tasks/${taskId}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  if (!response.ok) throw new Error('Failed to delete task');
  return true;
};

export const autoScheduleTask = async (taskId: string, token: string): Promise<any> => {
  const response = await fetch(`${API_URL}/api/ai/schedule-task/${taskId}`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  if (!response.ok) throw new Error('Failed to auto-schedule task');
  return response.json();
};
