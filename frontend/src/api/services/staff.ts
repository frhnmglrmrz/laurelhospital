import apiClient from '../axios';

export const staffService = {
  getAll() {
    return apiClient.get('/staff');
  },
  
  getById(id: string | number) {
    return apiClient.get(`/staff/${id}`);
  },
  
  create(data: any) {
    return apiClient.post('/staff', data);
  },
  
  update(id: string | number, data: any) {
    return apiClient.patch(`/staff/${id}`, data);
  },
  
  remove(id: string | number) {
    return apiClient.delete(`/staff/${id}`);
  }
};
