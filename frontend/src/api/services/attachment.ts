import apiClient from '../axios';

export const attachmentService = {
  getAll() {
    return apiClient.get('/attachment');
  },
  
  getById(id: string | number) {
    return apiClient.get(`/attachment/${id}`);
  },
  
  create(data: any) {
    return apiClient.post('/attachment', data);
  },
  
  update(id: string | number, data: any) {
    return apiClient.patch(`/attachment/${id}`, data);
  },
  
  remove(id: string | number) {
    return apiClient.delete(`/attachment/${id}`);
  }
};
