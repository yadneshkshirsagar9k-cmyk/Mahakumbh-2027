import { create } from 'zustand';

export interface OperationalTask {
  id: string;
  title: string;
  departmentId: string;
  assignedTo: string;
  status: 'Pending' | 'InProgress' | 'Completed';
  priority: 'Low' | 'Medium' | 'High';
  dueDate: number;
  relatedIncidentId?: string;
  relatedMissionId?: string;
}

interface TaskState {
  tasks: OperationalTask[];
  addTask: (task: OperationalTask) => void;
  updateTaskStatus: (id: string, status: OperationalTask['status']) => void;
}

export const useTaskStore = create<TaskState>((set) => ({
  tasks: [],
  addTask: (task) => set((state) => ({ tasks: [...state.tasks, task] })),
  updateTaskStatus: (id, status) => set((state) => ({
    tasks: state.tasks.map(t => t.id === id ? { ...t, status } : t)
  }))
}));
