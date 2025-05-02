import { useState } from "react";
import { useFormik } from "formik";
import {
  Container,
  TextField,
  Button,
  Stack,
  IconButton,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  TablePagination,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  Card,
  CardContent,
  Snackbar,
} from "@mui/material";
import MuiAlert from "@mui/material/Alert";
import { Add, DeleteOutline, Edit } from "@mui/icons-material";
import { createEmployee } from "../services/employeeService";
import { useNavigate, useLocation } from "react-router-dom";
import "./createEmployee.css";

interface Address {
  id: string;
  location: string;
  pincode: string;
  contact: string;
}

const CreateEmployee = () => {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [addressId, setAddressId] = useState<number>(1);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [addressForm, setAddressForm] = useState({
    location: "",
    pincode: "",
    contact: "",
  });
  const [page, setPage] = useState(0);
  const rowsPerPage = 10;
  const navigate = useNavigate();
  const location = useLocation();
  const [openSnackbar, setOpenSnackbar] = useState(location.state?.success || false);

  const formik = useFormik({
    initialValues: {
      emp_id: "",
      name: "",
      organ: "",
      position: "",
    },
    onSubmit: async (values) => {
      if (
        !values.emp_id.trim() ||
        !values.name.trim() ||
        !values.organ.trim() ||
        !values.position.trim()
      ) {
        alert("Please fill in all basic employee details.");
        return;
      }

      if (addresses.length === 0) {
        alert("Please add at least one address.");
        return;
      }

      const anyEmptyAddress = addresses.some(
        (addr) => !addr.location.trim() || !addr.pincode.trim() || !addr.contact.trim()
      );
      if (anyEmptyAddress) {
        alert("Please fill all fields in each address.");
        return;
      }

      const data = {
        ...values,
        addresses,
      };

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
        location: address.location,
        pincode: address.pincode,
        contact: address.contact,
      });
    } else {
      setEditingId(null);
      setAddressForm({ location: "", pincode: "", contact: "" });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleAddressFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setAddressForm({ ...addressForm, [name]: value });
  };

  const handleSaveAddress = () => {
    if (!addressForm.location || !addressForm.pincode || !addressForm.contact) {
      alert("All fields are required.");
      return;
    }

    if (editingId) {
      setAddresses((prev) =>
        prev.map((a) => (a.id === editingId ? { ...a, ...addressForm } : a))
      );
    } else {
      setAddresses([
        ...addresses,
        {
          id: `${addressId}`,
          ...addressForm,
        },
      ]);
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
    <Container className="container" sx={{ mt: 4 }}>
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={() => setOpenSnackbar(false)}
      >
        <MuiAlert
          onClose={() => setOpenSnackbar(false)}
          severity="success"
          sx={{ width: "100%" }}
        >
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
              />
              <TextField
                label="Employee Name"
                variant="outlined"
                fullWidth
                required
                name="name"
                value={formik.values.name}
                onChange={formik.handleChange}
              />
              <TextField
                label="Organization"
                variant="outlined"
                fullWidth
                required
                name="organ"
                value={formik.values.organ}
                onChange={formik.handleChange}
              />
              <TextField
                label="Position"
                variant="outlined"
                fullWidth
                required
                name="position"
                value={formik.values.position}
                onChange={formik.handleChange}
              />
            </Grid>
          </CardContent>
        </Card>

        <Container sx={{ mt: 4 }}>
          <Typography variant="h6">Addresses</Typography>
          <Stack direction="row" justifyContent="flex-end" mb={2}>
            <IconButton color="primary" onClick={() => handleOpenDialog()}>
              <Add />
            </IconButton>
          </Stack>

          <Paper sx={{ p: 2, overflowX: "auto" }}>
            <Table sx={{ minWidth: 650 }}>
              <TableHead>
                <TableRow>
                  <TableCell>Location</TableCell>
                  <TableCell>Pincode</TableCell>
                  <TableCell>Contact</TableCell>
                  <TableCell align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {addresses
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((address) => (
                    <TableRow key={address.id}>
                      <TableCell>{address.location}</TableCell>
                      <TableCell>{address.pincode}</TableCell>
                      <TableCell>{address.contact}</TableCell>
                      <TableCell align="center">
                        <IconButton color="primary" onClick={() => handleOpenDialog(address)}>
                          <Edit />
                        </IconButton>
                        <IconButton color="error" onClick={() => handleDeleteAddress(address.id)}>
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

            <center>
              <Button className="create-submit" variant="contained" type="submit">
                Submit
              </Button>
            </center>
          </Paper>
        </Container>
      </form>

      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>{editingId ? "Edit Address" : "Add Address"}</DialogTitle>
        <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
          <TextField
            label="Location"
            name="location"
            value={addressForm.location}
            onChange={handleAddressFormChange}
            fullWidth
          />
          <TextField
            label="Pincode"
            name="pincode"
            value={addressForm.pincode}
            onChange={handleAddressFormChange}
            fullWidth
          />
          <TextField
            label="Contact"
            name="contact"
            value={addressForm.contact}
            onChange={handleAddressFormChange}
            fullWidth
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
