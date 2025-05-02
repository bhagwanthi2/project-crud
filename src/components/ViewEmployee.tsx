import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getEmployeeById } from "../services/employeeService";
import { Employee } from "../types/Employee";
import {
  Container,
  Typography,
  Card,
  CardContent,
  Stack,
  Divider,
  Grid
  
} from "@mui/material";

const ViewEmployee = () => {
  const { id } = useParams<{ id: string }>();
  const [employee, setEmployee] = useState<Employee | null>(null);

  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        const res = await getEmployeeById(id!);
        setEmployee(res.data);
      } catch (err) {
        console.error("Failed to fetch employee", err);
      }
    };
    fetchEmployee();
  }, [id]);

  if (!employee) return <Typography>Loading...</Typography>;

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Employee Details
      </Typography>
      <Divider sx={{ mb: 3 }} />

      {/* import { Grid } from '@mui/material'; */}

      {/* import { Grid, Card, CardContent, Typography, Stack } from "@mui/material"; */}

<Grid sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
  {/* Basic Info Card */}
  <Card>
    <CardContent>
      <Typography variant="h6" gutterBottom>
        Basic Information
      </Typography>
      <Stack spacing={1}>
        <Typography><strong>Employee ID:</strong> {employee.emp_id}</Typography>
        <Typography><strong>Name:</strong> {employee.name}</Typography>
        <Typography><strong>Organization:</strong> {employee.organ}</Typography>
        <Typography><strong>Position:</strong> {employee.position}</Typography>
      </Stack>
    </CardContent>
  </Card>

  {/* Addresses Card */}
  <Card>
    <CardContent>
      <Typography variant="h6" gutterBottom>
        Addresses
      </Typography>
      {employee.addresses && employee.addresses.length > 0 ? (
        <Stack spacing={2}>
          {employee.addresses.map((addr, idx) => (
            <Card key={idx} variant="outlined" sx={{ p: 2 }}>
              <Typography><strong>Location:</strong> {addr.location}</Typography>
              <Typography><strong>Pincode:</strong> {addr.pincode}</Typography>
              <Typography><strong>Contact:</strong> {addr.contact}</Typography>
            </Card>
          ))}
        </Stack>
      ) : (
        <Typography>No addresses found.</Typography>
      )}
    </CardContent>
  </Card>
</Grid>

    </Container>
  );
};

export default ViewEmployee;
