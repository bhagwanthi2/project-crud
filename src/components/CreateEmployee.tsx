// C:\Users\BhagwanthiM\OneDrive - 4i Apps Solutions Pvt Ltd\Desktop\project-crud\employees\src\components\CreateEmployee.tsx
import { useState } from "react";
import { useFormik } from "formik";
// import '../components/createEmployee.css';
import { 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem, 
  FormHelperText ,
  Checkbox
} from '@mui/material';
import { validateZodSchema } from './validateZodSchema';
import { Container, TextField, Button, Stack, IconButton, Typography, Paper, Table, TableHead, TableRow, TableCell, TableBody, TablePagination, Dialog, DialogTitle, DialogContent, DialogActions, Snackbar } from "@mui/material";
import MuiAlert from "@mui/material/Alert";
import { Add, DeleteOutline, Edit } from "@mui/icons-material";
import { createEmployee } from "../services/employeeService";
import { useNavigate, useLocation } from "react-router-dom";
import { employeeSchema } from "../validations/employeeSchema";
import { zodResolver } from "@hookform/resolvers/zod"; 
import {z} from "zod";
import { Employee } from '../types/Employee';
import { Card, CardContent, Grid } from '@mui/material';
import { companyRoles } from "./companyRoles";
type EmployeeFormData = z.infer<typeof employeeSchema>;
type Address = {
  id: string;
  address:string;
  location: string;
  pincode: string;
  contact: string;
};
// const [selectedAddressIds, setSelectedAddressIds] = useState<string[]>([]);
import '../components/createEmployee.css';

const CreateEmployee = () => {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [addressId, setAddressId] = useState<number>(1);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [addressForm, setAddressForm] = useState({address:"", location: "", pincode: "", contact: "" });
  const [page, setPage] = useState(0);
  const rowsPerPage = 10;
  const navigate = useNavigate();
  const location = useLocation();
const [selectedAddressIds, setSelectedAddressIds] = useState<string[]>([]);
const [selectedAddresses, setSelectedAddresses] = useState<string[]>([]);
const handleSelectRow = (id: string) => {
  setSelectedAddresses((prev) =>
    prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
  );
};


  const [openSnackbar, setOpenSnackbar] = useState(location.state?.success || false);
  // const [missingAddressDialog, setMissingAddressDialog] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  // const [selectedOrg, setSelectedOrg] = useState<string | null>(null);
  const orgOptions = Object.keys(companyRoles);
  const [addressErrors, setAddressErrors] = useState({
    address:false,
    location: false,
    pincode: false,
    contact: false,
  });
  const handleAddressCheckboxToggle = (id: string) => {
    setSelectedAddressIds((prev) =>
      prev.includes(id) ? prev.filter((sid) => sid !== id) : [...prev, id]
    );
  };
  const handleDeleteSelectedAddresses = () => {
    const updated = addresses.filter((address) => !selectedAddressIds.includes(address.id));
    setAddresses(updated);
    setSelectedAddressIds([]);
    formik.setFieldValue("addresses", updated);
  };
  
  
  const formik = useFormik({
    initialValues: {
      emp_id: "",
      name: "",
      organ: "",
      position: "",
      addresses: [],
     
    },
    validate: validateZodSchema, // Using your custom Zod validation function here
    onSubmit: async (values) => {
      console.log("form submitted", values);
      setIsSubmitted(true);
  
      // Check if all required basic fields are filled
      if (!values.emp_id.trim() || !values.name.trim() || !values.organ.trim() || !values.position.trim()) {
        alert("Please fill in all basic employee details.");
        return;
      }
      console.log("empty");
      // Check if at least one address is added
      if (values.addresses.length === 0) {
        alert("At least one address is required.");
        console.log("empty");
        return;
      }if (!Array.isArray(values.addresses) || values.addresses.length === 0) {
        alert("At least one address is required.");
        console.log("empty");
        return;
      }
  
      // Prepare the data and submit
      const data = { ...values };
  
      try {
        await createEmployee(data);
        navigate("/list", { state: { success: true } });
      } catch (error) {
        console.error("Error submitting form:", error);
      }
    },
  });
  
  
  const handleOpenDialog = (address?: Address) => {
    if (address) {
      setEditingId(address.id);
      setAddressForm({
        address:address.address,
        location: address.location,
        pincode: address.pincode,
        contact: address.contact,
      });
    } else {
      setEditingId(null);
      setAddressForm({ address:"",location: "", pincode: "", contact: "" });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleAddressFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const updatedValue = name === "emp_id" ? Number(value) : value;

    setAddressForm({ ...addressForm, [name]: updatedValue });
  };
 
  
  const handleSaveAddress = () => {
    const trimmed = {
      address:addressForm.address.trim(),
      location: addressForm.location.trim(),
      pincode: addressForm.pincode.trim(),
      contact: addressForm.contact.trim(),
    };
  
    const errors = {
      address: !trimmed.address,
      location: !trimmed.location,
      pincode: !/^\d{6}$/.test(trimmed.pincode), 
      contact: !/^\d{10}$/.test(trimmed.contact),
    };
  
    setAddressErrors(errors);
  
    if (errors.address||errors.location || errors.pincode || errors.contact) {
      return;
    }
  
    if (editingId) {
      const updated = addresses.map((a) =>
        a.id === editingId ? { ...a, ...trimmed } : a
      );
      setAddresses(updated);
      formik.setFieldValue("addresses", updated);
    } else {
      const newAddress = {
        id: `${addressId}`,
        ...trimmed,
      };
      const updated = [...addresses, newAddress];
      setAddresses(updated);
      formik.setFieldValue("addresses", updated);
      setAddressId(addressId + 1);
    }
  
    setOpenDialog(false);
  };
  
  const handleDeleteAddress = (id: string) => {
    setAddresses(addresses.filter((address) => address.id !== id));
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  return (
    <Container className="container" sx={{ mt: 4 , width:"80%" }}>
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={() => setOpenSnackbar(false)}
      >
        <MuiAlert onClose={() => setOpenSnackbar(false)} severity="success" sx={{ width: "100%" }}>
          Submitted successfully!
        </MuiAlert>
      </Snackbar>

      <Typography variant="h4" gutterBottom>
        Create Employee
      </Typography>

      <form onSubmit={formik.handleSubmit}>
        <Card sx={{ mb: 4, p: 2 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Basic Details
            </Typography>
            <Grid sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <TextField
  label="Employee ID"
  variant="outlined"
  fullWidth
  required
  name="emp_id"
  value={formik.values.emp_id}
  onChange={formik.handleChange}
  error={formik.touched.emp_id && Boolean(formik.errors.emp_id)}
  helperText={formik.touched.emp_id && formik.errors.emp_id}
/>

              <TextField
                label="Employee Name"
                variant="outlined"
                fullWidth
                required
                name="name"
                value={formik.values.name}
                onChange={formik.handleChange}
                error={formik.touched.name && Boolean(formik.errors.name)}
                helperText={formik.touched.name && formik.errors.name}
              />
              <FormControl fullWidth margin="normal">
  <InputLabel id="org-label">Organization</InputLabel>
  <Select
    labelId="org-label"
    id="organ"
     variant="outlined"
    name="organ"
    value={formik.values.organ}
    onChange={(e) => {
      const selectedOrg = e.target.value;
      formik.setFieldValue("organ", selectedOrg);
      formik.setFieldValue("position", ""); // reset position when org changes
    }}
    error={formik.touched.organ && Boolean(formik.errors.organ)}
  >
    {Object.keys(companyRoles).map((org) => (
      <MenuItem key={org} value={org}>
        {org}
      </MenuItem>
    ))}
  </Select>
  {formik.touched.organ && formik.errors.organ && (
    <FormHelperText error>{formik.errors.organ}</FormHelperText>
  )}
</FormControl>

<FormControl fullWidth margin="normal" disabled={!formik.values.organ}>
  <InputLabel id="position-label">Position</InputLabel>
  <Select
    labelId="position-label"
    id="position"
    name="position"
    value={formik.values.position}
    onChange={formik.handleChange}
    error={formik.touched.position && Boolean(formik.errors.position)}
  >
    {(companyRoles[formik.values.organ] || []).map((pos) => (
      <MenuItem key={pos} value={pos}>
        {pos}
      </MenuItem>
    ))}
  </Select>
  {formik.touched.position && formik.errors.position && (
    <FormHelperText error>{formik.errors.position}</FormHelperText>
  )}
</FormControl>

            </Grid>
          </CardContent>
        </Card>

      
      
        <Container sx={{ mt: 4 }}><Stack direction="row" justifyContent="space-between" mb={2}>
  
 
</Stack>

          <Typography variant="h6">Addresses</Typography>
          <Stack direction="row" justifyContent="flex-end" mb={2}>
          <IconButton color="error" onClick={handleDeleteSelectedAddresses} disabled={selectedAddressIds.length === 0}>
    <DeleteOutline />
  </IconButton>
            <IconButton id="add" onClick={() => handleOpenDialog()}>
              <Add />
            </IconButton>
          </Stack>

          <Paper sx={{ p: 2, overflowX: "auto" }}>
     <Table sx={{ minWidth: 650 }}>
              <TableHead>
                <TableRow>
                <TableCell padding="checkbox"></TableCell>
                  <TableCell>Address</TableCell>
                  <TableCell>Location</TableCell>
                  <TableCell>Pincode</TableCell>
                  <TableCell>Contact</TableCell>
                  <TableCell align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
              {(addresses.length === 0
  ? [{ address:"", location: "", pincode: "", contact: "", id: "temp" }]
  : addresses.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
).map((address) => (
  <TableRow key={address.id !== "temp" ? address.id : "dummy"}>
    <TableCell padding="checkbox">
      <Checkbox
        checked={selectedAddressIds.includes(address.id)}
        onChange={() => handleAddressCheckboxToggle(address.id)}
        disabled={address.id === "temp"}
      /> 
    </TableCell>

    <TableCell>
      {address.address ? (
        address.address
      ) : (
        <Typography color="error">
          {isSubmitted && !address.address ? "Fill this field" : ""}
        </Typography>
      )}
    </TableCell>

    <TableCell>
      {address.location ? (
        address.location
      ) : (
        <Typography color="error">
          {isSubmitted && !address.location ? "Fill this field" : ""}
        </Typography>
      )}
    </TableCell>

    <TableCell>
      {address.pincode ? (
        address.pincode
      ) : (
        <Typography color="error">
          {isSubmitted && !address.pincode ? "Fill this field" : ""}
        </Typography>
      )}
    </TableCell>

    <TableCell>
      {address.contact ? (
        address.contact
      ) : (
        <Typography color="error">
          {isSubmitted && !address.contact ? "Fill this field" : ""}
        </Typography>
      )}
    </TableCell>

    <TableCell align="center">
      <IconButton
        color="primary"
        onClick={() => handleOpenDialog(address)}
        disabled={address.id === "temp"}
      >
        <Edit />
      </IconButton>
      <IconButton
        color="error"
        onClick={() => handleDeleteAddress(address.id)}
        disabled={address.id === "temp"}
      >
        <DeleteOutline />
      </IconButton>
    </TableCell>
  </TableRow>
))}

</TableBody>



   </Table>

            <TablePagination
              component="div"
              count={addresses.length}
              page={page}
              onPageChange={handleChangePage}
              rowsPerPage={rowsPerPage}
              rowsPerPageOptions={[]}
            />
          </Paper>
        </Container>

        <center>
          <Button className="create-submit" variant="contained" type="submit">
            Submit
          </Button>
        </center>
      </form>

      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>{editingId ? "Edit Address" : "Add Address"}</DialogTitle>
        <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
        <TextField
  label="Address"
  name="address"
  value={addressForm.address}
  error={addressErrors.address || (isSubmitted && !addressForm.address)}
  helperText={(addressErrors.address || (isSubmitted && !addressForm.address)) ? "Fill this field" : ""}
  onChange={handleAddressFormChange}
  fullWidth
  required
/>
        <TextField
        
  label="Location"
  name="location"
  value={addressForm.location}
  error={addressErrors.location || (isSubmitted && !addressForm.location)}
  helperText={(addressErrors.location || (isSubmitted && !addressForm.location)) ? "Fill this field" : ""}
  onChange={handleAddressFormChange}
  fullWidth
  required
/>
<TextField
  label="Pincode"
  name="pincode"
  value={addressForm.pincode}
  error={addressErrors.pincode || (isSubmitted && !addressForm.pincode)}
  helperText={(addressErrors.pincode || (isSubmitted && !addressForm.pincode)) ? "Enter a valid pincode" : ""}
  onChange={handleAddressFormChange}
  fullWidth
  required
/>
<TextField
  label="Contact"
  name="contact"
  value={addressForm.contact}
  error={addressErrors.contact || (isSubmitted && !addressForm.contact)}
  helperText={(addressErrors.contact || (isSubmitted && !addressForm.contact)) ? "Enter a valid contact" : ""}
  onChange={handleAddressFormChange}
  fullWidth
  required
/>

        </DialogContent>
       
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSaveAddress} variant="contained">
            {editingId ? "Update" : "Add"}
          </Button>
        </DialogActions>
      </Dialog>
    
    </Container>
  );
  
};

export default CreateEmployee;
