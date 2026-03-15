import apiClient from '../axios';

export const labResultService = {
  getAll() {
    return apiClient.get('/lab-result');
  },
  
  getById(id: string | number) {
    return apiClient.get(`/lab-result/${id}`);
  },
  
  create(data: any) {
    return apiClient.post('/lab-result', data);
  },
  
  update(id: string | number, data: any) {
    return apiClient.patch(`/lab-result/${id}`, data);
  },
  
  remove(id: string | number) {
    return apiClient.delete(`/lab-result/${id}`);
  }
};
