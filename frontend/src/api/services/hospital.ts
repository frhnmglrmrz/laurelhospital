import apiClient from '../axios';

export const hospitalService = {
  getAll() {
    return apiClient.get('/hospital');
  },
  
  getById(id: string | number) {
    return apiClient.get(`/hospital/${id}`);
  },
  
  create(data: any) {
    return apiClient.post('/hospital', data);
  },
  
  update(id: string | number, data: any) {
    return apiClient.patch(`/hospital/${id}`, data);
  },
  
  remove(id: string | number) {
    return apiClient.delete(`/hospital/${id}`);
  }
};
