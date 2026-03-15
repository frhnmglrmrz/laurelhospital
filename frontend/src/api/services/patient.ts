import apiClient from '../axios';

export const patientService = {
  getAll() {
    return apiClient.get('/patient');
  },
  
  getById(id: string | number) {
    return apiClient.get(`/patient/${id}`);
  },
  
  create(data: any) {
    return apiClient.post('/patient', data);
  },
  
  update(id: string | number, data: any) {
    return apiClient.patch(`/patient/${id}`, data);
  },
  
  remove(id: string | number) {
    return apiClient.delete(`/patient/${id}`);
  }
};
