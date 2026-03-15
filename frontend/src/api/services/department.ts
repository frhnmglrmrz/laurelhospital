import apiClient from '../axios';

export const departmentService = {
  getAll() {
    return apiClient.get('/department');
  },
  
  getById(id: string | number) {
    return apiClient.get(`/department/${id}`);
  },
  
  create(data: any) {
    return apiClient.post('/department', data);
  },
  
  update(id: string | number, data: any) {
    return apiClient.patch(`/department/${id}`, data);
  },
  
  remove(id: string | number) {
    return apiClient.delete(`/department/${id}`);
  }
};
