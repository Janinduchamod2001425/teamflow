export interface Project {
  id: string;
  name: string;
  description: string | null;
  color: string | null;
  workspaceId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateProjectDto {
  name: string;
  description?: string;
  color?: string;
}

export interface UpdateProjectDto {
  name?: string;
  description?: string;
  color?: string;
}
