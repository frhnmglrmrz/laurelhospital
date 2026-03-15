import apiClient from '../axios';

export const doctorScheduleService = {
  getAll() {
    return apiClient.get('/doctor-schedule');
  },
  
  getById(id: string | number) {
    return apiClient.get(`/doctor-schedule/${id}`);
  },
  
  create(data: any) {
    return apiClient.post('/doctor-schedule', data);
  },
  
  update(id: string | number, data: any) {
    return apiClient.patch(`/doctor-schedule/${id}`, data);
  },
  
  remove(id: string | number) {
    return apiClient.delete(`/doctor-schedule/${id}`);
  }
};
