import apiClient from '../axios';

export const admissionService = {
  getAll() {
    return apiClient.get('/admission');
  },
  
  getById(id: string | number) {
    return apiClient.get(`/admission/${id}`);
  },
  
  create(data: any) {
    return apiClient.post('/admission', data);
  },
  
  update(id: string | number, data: any) {
    return apiClient.patch(`/admission/${id}`, data);
  },
  
  remove(id: string | number) {
    return apiClient.delete(`/admission/${id}`);
  }
};
