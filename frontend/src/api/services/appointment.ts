import apiClient from '../axios';

export const appointmentService = {
  getAll() {
    return apiClient.get('/appointment');
  },
  
  getById(id: string | number) {
    return apiClient.get(`/appointment/${id}`);
  },
  
  create(data: any) {
    return apiClient.post('/appointment', data);
  },
  
  update(id: string | number, data: any) {
    return apiClient.patch(`/appointment/${id}`, data);
  },
  
  remove(id: string | number) {
    return apiClient.delete(`/appointment/${id}`);
  }
};
