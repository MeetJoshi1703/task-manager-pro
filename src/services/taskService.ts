import apiClient from "../utils/api";
import type { 
  CreateTaskRequestData, 
  UpdateTaskData, 
  MoveTaskData, 
  AddAssigneeData, 
  AddTagData, 
  AddCommentData, 
  AddAttachmentData 
} from '../types/types';

export class TaskService {
  async createTask(taskData: CreateTaskRequestData) {
    const response = await apiClient.post('/tasks', taskData);
    return response;
  }

  async getTasksByColumn(columnId: string) {
    const response = await apiClient.get(`/tasks/${columnId}`);
    return response;
  }

  async getAllTasks() {
    const response = await apiClient.get('/tasks/getAllTasks');
    return response;
  }

  async getTaskById(taskId: string) {
    const response = await apiClient.get(`/tasks/details/${taskId}`);
    return response;
  }

  async updateTask(taskId: string, updates: UpdateTaskData) {
    const response = await apiClient.put(`/tasks/${taskId}`, updates);
    return response;
  }

  async deleteTask(taskId: string) {
    const response = await apiClient.delete(`/tasks/${taskId}`);
    return response;
  }

  async moveTask(moveData: MoveTaskData) {
    const response = await apiClient.post('/tasks/move', moveData);
    return response;
  }

  async addAssignee(taskId: string, assigneeData: AddAssigneeData) {
    const response = await apiClient.post(`/tasks/${taskId}/assignees`, assigneeData);
    return response;
  }

  async removeAssignee(taskId: string, userId: string) {
    const response = await apiClient.delete(`/tasks/${taskId}/assignees/${userId}`);
    return response;
  }

  async addTag(taskId: string, tagData: AddTagData) {
    const response = await apiClient.post(`/tasks/${taskId}/tags`, tagData);
    return response;
  }

  async removeTag(taskId: string, tag: string) {
    const response = await apiClient.delete(`/tasks/${taskId}/tags/${tag}`);
    return response;
  }

  async addComment(taskId: string, commentData: AddCommentData) {
    const response = await apiClient.post(`/tasks/${taskId}/comments`, commentData);
    return response;
  }

  async deleteComment(taskId: string, commentId: string) {
    const response = await apiClient.delete(`/tasks/${taskId}/comments/${commentId}`);
    return response;
  }

  async addAttachment(taskId: string, attachmentData: AddAttachmentData) {
    const response = await apiClient.post(`/tasks/${taskId}/attachments`, attachmentData);
    return response;
  }

  async deleteAttachment(taskId: string, attachmentId: string) {
    const response = await apiClient.delete(`/tasks/${taskId}/attachments/${attachmentId}`);
    return response;
  }
}

export const taskService = new TaskService();
