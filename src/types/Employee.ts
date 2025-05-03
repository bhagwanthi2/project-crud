// C:\Users\BhagwanthiM\OneDrive - 4i Apps Solutions Pvt Ltd\Desktop\project-crud\employees\src\types\Employee.ts
export interface Address {
  address:string;
  location: string;
  pincode: number;
  contact: number;
}

export interface Employee {
  id: string; 
  emp_id: number;
  name: string;
  organ: string;
  position: string;
  addresses: Address[]; 
}
