import axios from 'axios';
import { Employee } from '../types/Employee';

const API_URL = 'http://localhost:3001/employees';

export const getEmployees = () => axios.get<Employee[]>(API_URL);

export const getEmployeeById = (id: string) => axios.get<Employee>(`${API_URL}/${id}`);

export const createEmployee = (data: any) => axios.post(API_URL, data);

export const updateEmployee = (id: string, employee: Employee) => axios.put(`${API_URL}/${id}`, employee);

export const deleteEmployee = (id: string) => axios.delete(`${API_URL}/${id}`);
