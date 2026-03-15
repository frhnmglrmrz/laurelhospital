import apiClient from '../axios';

export const roomService = {
  getAll() {
    return apiClient.get('/room');
  },
  
  getById(id: string | number) {
    return apiClient.get(`/room/${id}`);
  },
  
  create(data: any) {
    return apiClient.post('/room', data);
  },
  
  update(id: string | number, data: any) {
    return apiClient.patch(`/room/${id}`, data);
  },
  
  remove(id: string | number) {
    return apiClient.delete(`/room/${id}`);
  }
};
