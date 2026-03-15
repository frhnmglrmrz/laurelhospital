import apiClient from '../axios';

export const labTestService = {
  getAll() {
    return apiClient.get('/lab-test');
  },
  
  getById(id: string | number) {
    return apiClient.get(`/lab-test/${id}`);
  },
  
  create(data: any) {
    return apiClient.post('/lab-test', data);
  },
  
  update(id: string | number, data: any) {
    return apiClient.patch(`/lab-test/${id}`, data);
  },
  
  remove(id: string | number) {
    return apiClient.delete(`/lab-test/${id}`);
  }
};
