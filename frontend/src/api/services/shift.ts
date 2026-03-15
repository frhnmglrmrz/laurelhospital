import apiClient from '../axios';

export const shiftService = {
  getAll() {
    return apiClient.get('/shift');
  },
  
  getById(id: string | number) {
    return apiClient.get(`/shift/${id}`);
  },
  
  create(data: any) {
    return apiClient.post('/shift', data);
  },
  
  update(id: string | number, data: any) {
    return apiClient.patch(`/shift/${id}`, data);
  },
  
  remove(id: string | number) {
    return apiClient.delete(`/shift/${id}`);
  }
};
