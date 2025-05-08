import axios from 'axios';
// import { Address } from '../components/types/Employee/address';  // Assuming Address type is defined
import {Employee,Address} from "../types/Employee.ts"
const API_URL = 'http://localhost:3001/employees';  // Base API URL for employees

export const getEmployees = () => axios.get<Employee[]>(API_URL);

export const getEmployeeById = (id: string) => axios.get<Employee>(`${API_URL}/${id}`);

export const createEmployee = (data: any) => axios.post(API_URL, data);

export const updateEmployee = (id: string, employee: Employee) => axios.put(`${API_URL}/${id}`, employee);

export const deleteEmployee = (id: string) => axios.delete(`${API_URL}/${id}`);

// Assuming address-related API endpoint follows a similar structure
const ADDRESS_API_URL = 'http://localhost:3001/employees/addresses';

export const addAddress = async (addressData: Address) => {
    try {
        const response = await axios.post(ADDRESS_API_URL, addressData);
        return response.data;
    } catch (error) {
        console.error('Error adding address:', error);
        throw new Error('Error adding address');
    }
};

export const updateAddress = async (addressId: string, addressData: Address) => {
    try {
        const response = await axios.put(`${ADDRESS_API_URL}/${addressId}`, addressData);
        return response.data;
    } catch (error) {
        console.error('Error updating address:', error);
        throw new Error('Error updating address');
    }
};
