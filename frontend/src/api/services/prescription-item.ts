import apiClient from '../axios';

export const prescriptionItemService = {
  getAll() {
    return apiClient.get('/prescription-item');
  },
  
  getById(id: string | number) {
    return apiClient.get(`/prescription-item/${id}`);
  },
  
  create(data: any) {
    return apiClient.post('/prescription-item', data);
  },
  
  update(id: string | number, data: any) {
    return apiClient.patch(`/prescription-item/${id}`, data);
  },
  
  remove(id: string | number) {
    return apiClient.delete(`/prescription-item/${id}`);
  }
};
