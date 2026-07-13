export interface DashboardOverview {
  totalProjects: number;
  totalMembers: number;
  totalTasks: number;
  completedTasks: number;
  overdueTasks: number;
  completionRate: number;
}

export interface TasksByStatus {
  TODO: number;
  IN_PROGRESS: number;
  REVIEW: number;
  DONE: number;
}

export interface ActivityUser {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string | null;
}

export interface Activity {
  id: string;
  action: string;
  description: string;
  metadata: Record<string, any> | null;
  createdAt: string;
  workspaceId: string;
  userId: string;
  user: ActivityUser;
}

export interface WorkspaceDashboard {
  overview: DashboardOverview;
  tasksByStatus: TasksByStatus;
  recentActivities: Activity[];
}
