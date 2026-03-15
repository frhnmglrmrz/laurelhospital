import apiClient from '../axios';

export const doctorService = {
  getAll() {
    return apiClient.get('/doctor');
  },
  
  getById(id: string | number) {
    return apiClient.get(`/doctor/${id}`);
  },
  
  create(data: any) {
    return apiClient.post('/doctor', data);
  },
  
  update(id: string | number, data: any) {
    return apiClient.patch(`/doctor/${id}`, data);
  },
  
  remove(id: string | number) {
    return apiClient.delete(`/doctor/${id}`);
  }
};
