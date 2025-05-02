import React, { createContext, useState, useContext, useEffect } from "react";
import { Employee } from "../types/Employee";
import { getEmployees, deleteEmployee } from "../services/employeeService";

interface EmployeeContextType {
  employees: Employee[];
  fetchEmployees: () => void;
  handleDelete: (id: string) => Promise<void>;
}

const EmployeeContext = createContext<EmployeeContextType | undefined>(undefined);

export const EmployeeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [employees, setEmployees] = useState<Employee[]>([]);

  const fetchEmployees = async () => {
    try {
      const response = await getEmployees();
      setEmployees(response.data);
    } catch (error) {
      console.error("Failed to fetch employees", error);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete?")) {
      await deleteEmployee(id);
      fetchEmployees();
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  return (
    <EmployeeContext.Provider value={{ employees, fetchEmployees, handleDelete }}>
      {children}
    </EmployeeContext.Provider>
  );
};

export const useEmployeeContext = () => {
  const context = useContext(EmployeeContext);
  if (!context) {
    throw new Error("useEmployeeContext must be used within an EmployeeProvider");
  }
  return context;
};
