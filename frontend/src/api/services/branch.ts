import apiClient from '../axios';

export const branchService = {
  getAll() {
    return apiClient.get('/branch');
  },
  
  getById(id: string | number) {
    return apiClient.get(`/branch/${id}`);
  },
  
  create(data: any) {
    return apiClient.post('/branch', data);
  },
  
  update(id: string | number, data: any) {
    return apiClient.patch(`/branch/${id}`, data);
  },
  
  remove(id: string | number) {
    return apiClient.delete(`/branch/${id}`);
  }
};
