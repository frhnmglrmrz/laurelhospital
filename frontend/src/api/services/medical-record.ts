import apiClient from '../axios';

export const medicalRecordService = {
  getAll() {
    return apiClient.get('/medical-record');
  },
  
  getById(id: string | number) {
    return apiClient.get(`/medical-record/${id}`);
  },
  
  create(data: any) {
    return apiClient.post('/medical-record', data);
  },
  
  update(id: string | number, data: any) {
    return apiClient.patch(`/medical-record/${id}`, data);
  },
  
  remove(id: string | number) {
    return apiClient.delete(`/medical-record/${id}`);
  }
};
