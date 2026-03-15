import apiClient from '../axios';

export const invoiceService = {
  getAll() {
    return apiClient.get('/invoice');
  },
  
  getById(id: string | number) {
    return apiClient.get(`/invoice/${id}`);
  },
  
  create(data: any) {
    return apiClient.post('/invoice', data);
  },
  
  update(id: string | number, data: any) {
    return apiClient.patch(`/invoice/${id}`, data);
  },
  
  remove(id: string | number) {
    return apiClient.delete(`/invoice/${id}`);
  }
};
