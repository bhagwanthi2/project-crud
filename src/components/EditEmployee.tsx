// C:\Users\BhagwanthiM\OneDrive - 4i Apps Solutions Pvt Ltd\Desktop\project-crud\employees\src\components\EditEmployee.tsx
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getEmployeeById, updateEmployee } from "../services/employeeService";
import { Employee } from "../types/Employee";
import {
  Container,
  Paper,
  Typography,
  Stack,
  TextField,
  Button,
} from "@mui/material";
 import { zodResolver } from "@hookform/resolvers/zod";
import { employeeSchema } from "../validations/employeeSchema";
import { z } from "zod";

type EmployeeFormData = z.infer<typeof employeeSchema>;

const EditEmployee = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [employee, setEmployee] = useState<Employee>({
    id :"",
    emp_id: 0,
    name: "",
    organ: "",
    position: "",
    addresses: [{ address:"",location: "", pincode:0 , contact:0}],
  });

  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        const res = await getEmployeeById(id!);
        setEmployee(res.data);
      } catch (error) {
        console.error("Failed to fetch employee", error);
      }
    };
    fetchEmployee();
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmployee({ ...employee, [e.target.name]: e.target.value });
  };

  const handleAddressChange = (
    index: number,
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    const updated = [...employee.addresses];
    const updatedAddress = { ...updated[index] };
  
    if (name === "address" || name === "location") {
      updatedAddress[name as "address" | "location"] = value;
    } else if (name === "pincode" || name === "contact") {
      updatedAddress[name as "pincode" | "contact"] = Number(value);
    }
  
    updated[index] = updatedAddress;
    setEmployee({ ...employee, addresses: updated });
  };
  

  const handleSubmit = async () => {
    try {
      await updateEmployee(id!, employee);
      navigate("/list");
    } catch (error) {
      console.error("Update failed", error);
    }
  };

  return (
    <Container maxWidth="sm">
      <Paper sx={{ p: 4, mt: 5 }}>
        <Typography variant="h5" gutterBottom>Edit Employee</Typography>
        <Stack spacing={2}>
          <TextField
            label="Employee ID"
            name="emp_id"
            value={employee.emp_id}
            fullWidth
            
          />
          <TextField
            label="Name"
            name="name"
            value={employee.name}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            label="Organization"
            name="organ"
            value={employee.organ}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            label="Position"
            name="position"
            value={employee.position}
            onChange={handleChange}
            fullWidth
          />

          <Typography variant="h6" sx={{ mt: 2 }}>Addresses</Typography>
          {employee.addresses.map((addr, index) => (
            <Stack key={index} spacing={1}>
               <TextField
                label="Address"
                name="address"
                value={addr.address}
                onChange={(e) => handleAddressChange(index, e)}
                fullWidth
              />
              <TextField
                label="Location"
                name="location"
                value={addr.location}
                onChange={(e) => handleAddressChange(index, e)}
                fullWidth
              />
              <TextField
                label="Pincode"
                name="pincode"
                value={addr.pincode}
                onChange={(e) => handleAddressChange(index, e)}
                fullWidth
              />
              <TextField
                label="Contact"
                name="contact"
                value={addr.contact}
                onChange={(e) => handleAddressChange(index, e)}
                fullWidth
              />
            </Stack>
          ))}

          <Button variant="contained" onClick={handleSubmit}>
            Update
          </Button>
        </Stack>
      </Paper>
    </Container>
  );
};

export default EditEmployee;
