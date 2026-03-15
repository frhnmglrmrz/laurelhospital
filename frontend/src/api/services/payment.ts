import apiClient from '../axios';

export const paymentService = {
  getAll() {
    return apiClient.get('/payment');
  },
  
  getById(id: string | number) {
    return apiClient.get(`/payment/${id}`);
  },
  
  create(data: any) {
    return apiClient.post('/payment', data);
  },
  
  update(id: string | number, data: any) {
    return apiClient.patch(`/payment/${id}`, data);
  },
  
  remove(id: string | number) {
    return apiClient.delete(`/payment/${id}`);
  }
};
