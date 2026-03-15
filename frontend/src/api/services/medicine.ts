import apiClient from '../axios';

export const medicineService = {
  getAll() {
    return apiClient.get('/medicine');
  },
  
  getById(id: string | number) {
    return apiClient.get(`/medicine/${id}`);
  },
  
  create(data: any) {
    return apiClient.post('/medicine', data);
  },
  
  update(id: string | number, data: any) {
    return apiClient.patch(`/medicine/${id}`, data);
  },
  
  remove(id: string | number) {
    return apiClient.delete(`/medicine/${id}`);
  }
};
