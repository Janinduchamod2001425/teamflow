import { defineStore } from "pinia";
import { ref } from "vue";
import { ProjectService } from "~/services/project.service";
import type {
  Project,
  CreateProjectDto,
  UpdateProjectDto,
} from "~/types/project";

export const useProjectStore = defineStore("project", () => {
  const projects = ref<Project[]>([]);
  const loading = ref(false);

  async function fetchProjects(workspaceId: string) {
    loading.value = true;
    try {
      const response = await ProjectService.findAll(workspaceId);
      projects.value = response.data.data;
    } finally {
      loading.value = false;
    }
  }

  async function createProject(workspaceId: string, data: CreateProjectDto) {
    await ProjectService.create(workspaceId, data);
    await fetchProjects(workspaceId);
  }

  async function updateProject(
    workspaceId: string,
    projectId: string,
    data: UpdateProjectDto,
  ) {
    await ProjectService.update(workspaceId, projectId, data);
    await fetchProjects(workspaceId);
  }

  async function deleteProject(workspaceId: string, projectId: string) {
    await ProjectService.remove(workspaceId, projectId);
    projects.value = projects.value.filter((p) => p.id !== projectId);
  }

  function reset() {
    projects.value = [];
  }

  return {
    projects,
    loading,
    fetchProjects,
    createProject,
    updateProject,
    deleteProject,
    reset,
  };
});
