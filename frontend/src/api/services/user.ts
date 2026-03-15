import apiClient from '../axios';

export const userService = {
  getAll() {
    return apiClient.get('/user');
  },
  
  getById(id: string | number) {
    return apiClient.get(`/user/${id}`);
  },
  
  create(data: any) {
    return apiClient.post('/user', data);
  },
  
  update(id: string | number, data: any) {
    return apiClient.patch(`/user/${id}`, data);
  },
  
  remove(id: string | number) {
    return apiClient.delete(`/user/${id}`);
  }
};
