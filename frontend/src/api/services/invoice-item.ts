import apiClient from '../axios';

export const invoiceItemService = {
  getAll() {
    return apiClient.get('/invoice-item');
  },
  
  getById(id: string | number) {
    return apiClient.get(`/invoice-item/${id}`);
  },
  
  create(data: any) {
    return apiClient.post('/invoice-item', data);
  },
  
  update(id: string | number, data: any) {
    return apiClient.patch(`/invoice-item/${id}`, data);
  },
  
  remove(id: string | number) {
    return apiClient.delete(`/invoice-item/${id}`);
  }
};
