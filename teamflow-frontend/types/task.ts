export type TaskStatus = "TODO" | "IN_PROGRESS" | "REVIEW" | "DONE";
export type Priority = "LOW" | "MEDIUM" | "HIGH" | "URGENT";

export interface TaskUser {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string | null;
}

export interface Task {
  id: string;
  title: string;
  description: string | null;
  status: TaskStatus;
  priority: Priority;
  dueDate: string | null;
  projectId: string;
  assigneeId: string | null;
  createdById: string;
  assignee: TaskUser | null;
  createdBy: TaskUser;
  createdAt: string;
  updatedAt: string;
  _count?: { comments: number };
  project?: { id: string; name: string; color: string | null };
}

export interface CreateTaskDto {
  title: string;
  description?: string;
  priority?: Priority;
  dueDate?: string;
  assigneeId?: string;
  projectId: string;
}

export type UpdateTaskDto = Partial<Omit<CreateTaskDto, "projectId">>;

export interface TaskBoard {
  TODO: Task[];
  IN_PROGRESS: Task[];
  REVIEW: Task[];
  DONE: Task[];
}

export interface TaskSearchParams {
  keyword?: string;
  status?: TaskStatus;
  priority?: Priority;
  assigneeId?: string;
  projectId?: string;
  dueBefore?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  order?: "asc" | "desc";
}

export interface TaskSearchResult {
  items: Task[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}
