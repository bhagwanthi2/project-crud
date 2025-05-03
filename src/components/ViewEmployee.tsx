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
  Grid,
  Alert,
  CircularProgress
  
} from "@mui/material";

const ViewEmployee = () => {
  const { id } = useParams<{ id: string }>();
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    const fetchEmployee = async () => {
      if (!id) {
        setError("Invalid Employee ID");
        setLoading(false);
        return;
      }

      try {
        const res = await getEmployeeById(id);
        setEmployee(res.data);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch employee data");
        setLoading(false);
      }
    };

    fetchEmployee();
  }, [id]);
  if (loading) return <CircularProgress sx={{ mt: 4 }} />;
  if (error) return <Alert severity="error" sx={{ mt: 4 }}>{error}</Alert>;
  if (!employee) return <Typography>Loading...</Typography>;

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Employee Details
      </Typography>
      <Divider sx={{ mb: 3 }} />



<Grid sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
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

  <Card>
    <CardContent>
      <Typography variant="h6" gutterBottom>
        Addresses
      </Typography>
      {employee.addresses && employee.addresses.length > 0 ? (
        <Stack spacing={2}>
          {employee.addresses.map((addr, idx) => (
            <Card key={idx} variant="outlined" sx={{ p: 2 }}>
               <Typography><strong>Address:</strong> {addr.address}</Typography>
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
