export interface Task {
  assignee: Array<unknown>;
  category: string;
  date: string;
  description: string;
  prio: string,
  status: string;
  subtasks: Array<unknown>;
  title: string;
}
