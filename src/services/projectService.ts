import api from './api';

export interface Project {
  _id: string;
  title: string;
  description?: string;
  status: string;
  mainTasks?: any[];
  dueDate?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface MainTask {
  title: string;
  description?: string;
  status?: string;
  subtasks?: any[];
}

export interface Subtask {
  title: string;
  description?: string;
  status?: string;
}

export interface Comment {
  text: string;
  author?: string;
}

class ProjectService {
  /**
   * Upload a PDF file and create a project from it
   */
  async uploadPDF(file: File): Promise<Project> {
    const formData = new FormData();
    formData.append('pdf', file);

    const response = await api.post('/projects/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data.data;
  }

  /**
   * Get all projects for the current user
   */
  async getProjects(page = 1, limit = 10): Promise<any> {
    const response = await api.get('/projects', {
      params: { page, limit },
    });
    return response.data.data;
  }

  /**
   * Get a specific project by ID
   */
  async getProjectById(id: string): Promise<Project> {
    const response = await api.get(`/projects/${id}`);
    return response.data.data;
  }

  /**
   * Create a new project
   */
  async createProject(projectData: Partial<Project>): Promise<Project> {
    const response = await api.post('/projects', projectData);
    return response.data.data;
  }

  /**
   * Update a project
   */
  async updateProject(id: string, data: Partial<Project>): Promise<Project> {
    const response = await api.put(`/projects/${id}`, data);
    return response.data.data;
  }

  /**
   * Delete a project
   */
  async deleteProject(id: string): Promise<any> {
    const response = await api.delete(`/projects/${id}`);
    return response.data.data;
  }

  /**
   * Add a main task to a project
   */
  async addMainTask(projectId: string, task: MainTask): Promise<any> {
    const response = await api.post(`/projects/${projectId}/mainTasks`, task);
    return response.data.data;
  }

  /**
   * Update a main task
   */
  async updateMainTask(projectId: string, mainTaskIndex: number, data: Partial<MainTask>): Promise<any> {
    const response = await api.put(
      `/projects/${projectId}/mainTasks/${mainTaskIndex}`,
      data
    );
    return response.data.data;
  }

  /**
   * Delete a main task
   */
  async deleteMainTask(projectId: string, mainTaskIndex: number): Promise<any> {
    const response = await api.delete(`/projects/${projectId}/mainTasks/${mainTaskIndex}`);
    return response.data.data;
  }

  /**
   * Add a subtask to a main task
   */
  async addSubtask(projectId: string, mainTaskIndex: number, subtask: Subtask): Promise<any> {
    const response = await api.post(
      `/projects/${projectId}/mainTasks/${mainTaskIndex}/subtasks`,
      subtask
    );
    return response.data.data;
  }

  /**
   * Update a subtask
   */
  async updateSubtask(
    projectId: string,
    mainTaskIndex: number,
    subtaskIndex: number,
    data: Partial<Subtask>
  ): Promise<any> {
    const response = await api.put(
      `/projects/${projectId}/mainTasks/${mainTaskIndex}/subtasks/${subtaskIndex}`,
      data
    );
    return response.data.data;
  }

  /**
   * Delete a subtask
   */
  async deleteSubtask(
    projectId: string,
    mainTaskIndex: number,
    subtaskIndex: number
  ): Promise<any> {
    const response = await api.delete(
      `/projects/${projectId}/mainTasks/${mainTaskIndex}/subtasks/${subtaskIndex}`
    );
    return response.data.data;
  }

  /**
   * Get comments for a main task
   */
  async getTaskComments(projectId: string, mainTaskIndex: number): Promise<any[]> {
    const response = await api.get(
      `/projects/${projectId}/mainTasks/${mainTaskIndex}/comments`
    );
    return response.data.data;
  }

  /**
   * Add a comment to a main task
   */
  async addTaskComment(projectId: string, mainTaskIndex: number, comment: Comment): Promise<any> {
    const response = await api.post(
      `/projects/${projectId}/mainTasks/${mainTaskIndex}/comments`,
      comment
    );
    return response.data.data;
  }

  /**
   * Get comments for a subtask
   */
  async getSubtaskComments(
    projectId: string,
    mainTaskIndex: number,
    subtaskIndex: number
  ): Promise<any[]> {
    const response = await api.get(
      `/projects/${projectId}/mainTasks/${mainTaskIndex}/subtasks/${subtaskIndex}/comments`
    );
    return response.data.data;
  }

  /**
   * Add a comment to a subtask
   */
  async addSubtaskComment(
    projectId: string,
    mainTaskIndex: number,
    subtaskIndex: number,
    comment: Comment
  ): Promise<any> {
    const response = await api.post(
      `/projects/${projectId}/mainTasks/${mainTaskIndex}/subtasks/${subtaskIndex}/comments`,
      comment
    );
    return response.data.data;
  }
}

export default new ProjectService();
