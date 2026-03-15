import apiClient from '../axios';

export const prescriptionService = {
  getAll() {
    return apiClient.get('/prescription');
  },
  
  getById(id: string | number) {
    return apiClient.get(`/prescription/${id}`);
  },
  
  create(data: any) {
    return apiClient.post('/prescription', data);
  },
  
  update(id: string | number, data: any) {
    return apiClient.patch(`/prescription/${id}`, data);
  },
  
  remove(id: string | number) {
    return apiClient.delete(`/prescription/${id}`);
  }
};
