import apiClient from '../axios';

export const medicineStockService = {
  getAll() {
    return apiClient.get('/medicine-stock');
  },
  
  getById(id: string | number) {
    return apiClient.get(`/medicine-stock/${id}`);
  },
  
  create(data: any) {
    return apiClient.post('/medicine-stock', data);
  },
  
  update(id: string | number, data: any) {
    return apiClient.patch(`/medicine-stock/${id}`, data);
  },
  
  remove(id: string | number) {
    return apiClient.delete(`/medicine-stock/${id}`);
  }
};
