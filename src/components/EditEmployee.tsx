//Editpage..


// import { useNavigate } from "react-router-dom";

// C:\Users\BhagwanthiM\OneDrive - 4i Apps Solutions Pvt Ltd\Desktop\project-crud\employees\src\components\EditEmployee.tsx
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getEmployeeById, updateEmployee } from "../services/employeeService";
import { Employee } from "../types/Employee";
// import '../components/EditEmployee.css';
import { companyRoles } from "./companyRoles";
import { FormControl, InputLabel, Select, MenuItem, FormHelperText } from "@mui/material";
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton, Checkbox
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
// import DeleteIcon from "@mui/icons-material/Delete";
// import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
// import IconButton from "@mui/material/IconButton";
import Dialog from "@mui/material/Dialog";
  import DialogTitle from "@mui/material/DialogTitle";
  import DialogContent from "@mui/material/DialogContent";
  import DialogActions from "@mui/material/DialogActions";
  import formik from "formik";
  import { useFormik } from "formik";
  // import { z } from "zod";
  // import { toFormikValidationSchema } from "@hookform/resolvers/zod";
  import { toFormikValidationSchema } from 'zod-formik-adapter';

  
import {
   Card, CardContent, Grid } from '@mui/material';
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
  });const [selectedRows, setSelectedRows] = useState<number[]>([]);
  
  // Address schema
  const addressSchema = z.object({
    address: z.string().min(1, "Address required"),
    location: z.string().min(1, "Location required"),
    pincode: z.number().min(100000, "Invalid pincode"),
    contact: z.number().min(1000000000, "Invalid contact"),
  });
  
  type AddressForm = z.infer<typeof addressSchema>;
  
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  
  const [selectedRow, setSelectedRow] = useState<number | null>(null);
  const handleSelectRow = (index: number) => {
    setSelectedRows((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };
  
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
  const formik = useFormik<AddressForm>({
    initialValues: {
      address: "",
      location: "",
      pincode: 0,
      contact: 0,
    },
    validationSchema: toFormikValidationSchema(addressSchema),
    enableReinitialize: true,
    onSubmit: (values) => {
      if (editingIndex !== null) {
        const updated = [...employee.addresses];
        updated[editingIndex] = values;
        setEmployee({ ...employee, addresses: updated });
        setIsDialogOpen(false);
      }
    },
  });
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmployee({ ...employee, [e.target.name]: e.target.value });
  };
  const handleDeleteAddress = (index: number) => {
    const updated = [...employee.addresses];
    updated.splice(index, 1);
    setEmployee({ ...employee, addresses: updated });
    if (selectedRow === index) {
      setSelectedRow(null);
    }
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
    <Container sx={{ mt: 4 , width:"80%" }}><Stack direction="row" alignItems="center" spacing={2} mb={2}>
    <IconButton onClick={() => navigate("/list")} aria-label="Go back">
      <ArrowBackIcon />
    </IconButton>
    {/* <Typography variant="h4">Edit Employee</Typography> */}
  </Stack>
  
  <form onSubmit={handleSubmit}>
    {/* Basic Details */}
    <Card sx={{ p: 2, mt: 4, mb: 4 }}>
        <Typography variant="h4" gutterBottom>
              Edit Employee
            </Typography>
      
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Basic Details
        </Typography>
        <Grid sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
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
         <FormControl fullWidth>
  <InputLabel id="org-label">Organization</InputLabel>
  <Select
    labelId="org-label"
    id="organ"
    name="organ"
    value={employee.organ}
    onChange={(e) => {
      const selectedOrg = e.target.value;
      setEmployee({
        ...employee,
        organ: selectedOrg,
        position: "", // Reset position if org changes
      });
    }}
  >
    {Object.keys(companyRoles).map((org) => (
      <MenuItem key={org} value={org}>
        {org}
      </MenuItem>
    ))}
  </Select>
</FormControl>

<FormControl fullWidth disabled={!employee.organ}>
  <InputLabel id="position-label">Position</InputLabel>
  <Select
    labelId="position-label"
    id="position"
    name="position"
    value={employee.position}
    onChange={(e) => {
      setEmployee({ ...employee, position: e.target.value });
    }}
  >
    {(companyRoles[employee.organ] || []).map((pos) => (
      <MenuItem key={pos} value={pos}>
        {pos}
      </MenuItem>
    ))}
  </Select>
</FormControl>

        </Grid>
      </CardContent>
    </Card>

    {/* Addresses */}
    <Card sx={{ p: 2, mb: 4 }}>
      <CardContent>
     
        <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
  <Typography variant="h6">Addresses</Typography>
  <Stack direction="row" spacing={2}>
  <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
  {/* <Typography variant="h6">Addresses</Typography> */}

  <Stack direction="row" spacing={1}>
    <Tooltip title="Add Address">
      <IconButton
        color="primary"
        onClick={() =>
          setEmployee({
            ...employee,
            addresses: [
              ...employee.addresses,
              { address: "", location: "", pincode: 0, contact: 0 },
            ],
          })
        }
      >
        <AddIcon />
      </IconButton>
    </Tooltip>

    <Tooltip title="Delete Selected">
      <IconButton
        color="error"
        onClick={() => {
          const filtered = employee.addresses.filter(
            (_, index) => !selectedRows.includes(index)
          );
          setEmployee({ ...employee, addresses: filtered });
          setSelectedRows([]);
        }}
        disabled={selectedRows.length === 0}
      >
        <DeleteIcon />
      </IconButton>
    </Tooltip>
  </Stack>
</Stack>

  </Stack>
</Stack>

        {/* <Grid sx={{ display: "flex", flexDirection: "column", gap: 2 }}> */}
        <TableContainer component={Paper}><Dialog open={isDialogOpen} onClose={() => setIsDialogOpen(false)} fullWidth maxWidth="sm">
  <DialogTitle>Edit Address</DialogTitle>
  <form onSubmit={formik.handleSubmit}>
    <DialogContent>
      <Stack spacing={2}>
        <TextField
          label="Address"
          name="address"
          value={formik.values.address}
          onChange={formik.handleChange}
          error={formik.touched.address && !!formik.errors.address}
          helperText={formik.touched.address && formik.errors.address}
          fullWidth
        />
        <TextField
          label="Location"
          name="location"
          value={formik.values.location}
          onChange={formik.handleChange}
          error={formik.touched.location && !!formik.errors.location}
          helperText={formik.touched.location && formik.errors.location}
          fullWidth
        />
        <TextField
          label="Pincode"
          name="pincode"
          type="number"
          value={formik.values.pincode}
          onChange={formik.handleChange}
          error={formik.touched.pincode && !!formik.errors.pincode}
          helperText={formik.touched.pincode && formik.errors.pincode}
          fullWidth
        />
        <TextField
          label="Contact"
          name="contact"
          type="number"
          value={formik.values.contact}
          onChange={formik.handleChange}
          error={formik.touched.contact && !!formik.errors.contact}
          helperText={formik.touched.contact && formik.errors.contact}
          fullWidth
        />
      </Stack>
    </DialogContent>
    <DialogActions>
      <Button onClick={() => setIsDialogOpen(false)}>Cancel</Button>
      <Button type="submit" variant="contained">Save</Button>
    </DialogActions>
  </form>
</Dialog>

  <Table>
    <TableHead>
      <TableRow>
        <TableCell>Select</TableCell>
        <TableCell>Address</TableCell>
        <TableCell>Location</TableCell>
        <TableCell>Pincode</TableCell>
        <TableCell>Contact</TableCell>
        <TableCell>Actions</TableCell>
      </TableRow>
    </TableHead>
    <TableBody>
      {employee.addresses.map((addr, index) => (
        <TableRow key={index}>
          <TableCell padding="checkbox">
          <Checkbox
  checked={selectedRows.includes(index)}
  onChange={() => handleSelectRow(index)}
/>

          </TableCell>
          <TableCell>
            <TextField
              name="address"
              value={addr.address}
              // onChange={(e) => handleAddressChange(index, e)}
              fullWidth
            />
          </TableCell>
          <TableCell>
            <TextField
              name="location"
              value={addr.location}
              // onChange={(e) => handleAddressChange(index, e)}
              fullWidth
            />
          </TableCell>
          <TableCell>
            <TextField
              name="pincode"
              value={addr.pincode}
              // onChange={(e) => handleAddressChange(index, e)}
              fullWidth
            />
          </TableCell>
          <TableCell>
            <TextField
              name="contact"
              value={addr.contact}
              // onChange={(e) => handleAddressChange(index, e)}
              fullWidth
            />
          </TableCell>
          <TableCell>
          <IconButton
  onClick={() => {
    setEditingIndex(index);
    formik.setValues(employee.addresses[index]); // Pre-fill
    setIsDialogOpen(true);
  }}
>
  <EditIcon />
</IconButton>

            <IconButton onClick={() => handleDeleteAddress(index)}>
              <DeleteIcon />
            </IconButton>
          </TableCell>
        </TableRow>
      ))}
    </TableBody>
  </Table>
</TableContainer>

        
      </CardContent>
    </Card>

    <center>
      <Button variant="contained" type="submit">
        Update
      </Button>
    </center>
  </form>
</Container>


  );
};

export default EditEmployee;