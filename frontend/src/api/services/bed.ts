import apiClient from '../axios';

export const bedService = {
  getAll() {
    return apiClient.get('/bed');
  },
  
  getById(id: string | number) {
    return apiClient.get(`/bed/${id}`);
  },
  
  create(data: any) {
    return apiClient.post('/bed', data);
  },
  
  update(id: string | number, data: any) {
    return apiClient.patch(`/bed/${id}`, data);
  },
  
  remove(id: string | number) {
    return apiClient.delete(`/bed/${id}`);
  }
};
