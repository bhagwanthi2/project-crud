// C:\Users\BhagwanthiM\OneDrive - 4i Apps Solutions Pvt Ltd\Desktop\project-crud\employees\src\components\ListEmployee.tsx
import { useEffect, useState } from "react";
import { getEmployees, deleteEmployee } from "../services/employeeService";
import { useLocation } from "react-router-dom";
import { Snackbar, SnackbarContent } from "@mui/material";
import { green } from "@mui/material/colors";
import { MoreVert, Search, Add, DeleteOutline, Edit, Visibility, FilterList } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  IconButton,
  TextField,
  InputAdornment,
  Stack,
  Button,
  Checkbox,
  TablePagination,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Box,
  Menu,
  ListItemIcon,
  ListItemText,
  CircularProgress
} from "@mui/material";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,

} from "@mui/material";

import { Employee } from "../types/Employee";
// import "./ListEmployee.css";

  const ListEmployee = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selected, setSelected] = useState<string[]>([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage] = useState(10);
  const [orgFilter, setOrgFilter] = useState("");
  const [showFilter, setShowFilter] = useState(false);

  const navigate = useNavigate();
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [loadingDelete, setLoadingDelete] = useState(false);
  const location = useLocation(); 
  const [loading, setLoading] = useState(true); 

  

  useEffect(() => {
    if (location.state?.success) {
      setSnackbarMessage("Employee added successfully!");
      setOpenSnackbar(true);
  
      navigate(location.pathname, { replace: true });
    }
  }, [location, navigate]);
  
  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };


  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedEmpId, setSelectedEmpId] = useState<string | null>(null);
  const [openBatchDialog, setOpenBatchDialog] = useState(false);

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const response = await getEmployees();
  
      setTimeout(() => {
        setEmployees(response.data);
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error("Failed to fetch employees", error);
      setLoading(false);
    }
  };
  

  
  
  const handleBatchDelete = () => {
    setOpenBatchDialog(true);
  };





  const handleConfirmBatchDelete = async () => {
    setLoadingDelete(true);
    await Promise.all(selected.map(id => deleteEmployee(id)));
    setSelected([]);
    fetchEmployees();
    setOpenBatchDialog(false);
    setLoadingDelete(false);
  };
  
  
  const handleCancelDelete = () => {
    setOpenDialog(false);
    setSelectedId(null);
  };
  

  const handleAddEmployee = () => navigate("/create");

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleSelectRow = (id: string) => {
    setSelected(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleSelectAll = (checked: boolean) => {
    const allVisibleIds = filteredEmployees.slice(startIndex, endIndex).map(emp => emp.id);
    setSelected(checked ? allVisibleIds : []);
  };

  const handleOrgFilter = (e: any) => {
    setOrgFilter(e.target.value);
  };

  const toggleFilter = () => {
    setShowFilter(prev => {
      const newState = !prev;
      if (!newState) {
        setOrgFilter("");
      }
      return newState;
    });
  };
  

  const filteredEmployees = employees.filter((emp) =>
    (emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
     emp.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
     emp.organ.toLowerCase().includes(searchTerm.toLowerCase()))
    && (orgFilter ? emp.organ === orgFilter : true)
  );
  const handleDelete = (id: string) => {
    setSelectedId(id);
    setOpenDialog(true);
  };
 
  const handleConfirmDelete = async () => {
    if (selectedId) {
      setLoadingDelete(true);
      await deleteEmployee(selectedId);
      fetchEmployees();
      setOpenDialog(false);
      setSelectedId(null);
      setLoadingDelete(false)
    }
  };
  const startIndex = page * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const paginatedEmployees = filteredEmployees.slice(startIndex, endIndex);

  const uniqueOrgs = Array.from(new Set(employees.map(emp => emp.organ)));
  

  return (<>
  
    {loading ? (
      <Container className="container" sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "60vh" }}>
        <CircularProgress />
      </Container>
    ) :(
      <Container className="container">
      <Typography variant="h4" className="header">Employee List</Typography>

      <Stack direction="row" justifyContent="space-between" alignItems="center" className="button" sx={{ mb: 2 }}>
        <TextField
          placeholder="Search..."
          variant="outlined"
          size="small"
          value={searchTerm}
          onChange={handleSearch}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <Search />
              </InputAdornment>
            ),
          }}
          sx={{ width: 250 }}
        />

<Dialog open={openDialog} onClose={handleCancelDelete}>
  <DialogTitle>Confirm Deletion</DialogTitle>
  <DialogContent>
    <Typography>Are you sure you want to delete this employee?</Typography>
  </DialogContent>
  <DialogActions>
    <Button onClick={handleCancelDelete}>Cancel</Button>
    <Button onClick={handleConfirmBatchDelete} color="error" disabled={loadingDelete}  startIcon={loadingDelete ? <CircularProgress size={18} /> : undefined}> {loadingDelete ? <CircularProgress size={24} /> : 'Delete'}</Button>
  </DialogActions>
</Dialog>
<Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
  <DialogTitle>Confirm Deletion</DialogTitle>
  <DialogContent>
    <Typography>Are you sure you want to delete this employee?</Typography>
  </DialogContent>
  <DialogActions>
    <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
    <Button onClick={handleConfirmDelete} color="error" disabled={loadingDelete}>
      {loadingDelete ? <CircularProgress size={24} /> : "Delete"}
    </Button>
  </DialogActions>
</Dialog>

        <Stack direction="row" spacing={1}>
          <IconButton onClick={handleBatchDelete} disabled={selected.length === 0}>
            <DeleteOutline />
          </IconButton>

          <IconButton onClick={toggleFilter}>
            <FilterList />
          </IconButton>

          <IconButton onClick={handleAddEmployee}>
            <Add />
          </IconButton>
        </Stack>
      </Stack>

      {showFilter && (
  <Box sx={{ mb: 2 }}>
    <Stack direction="row" spacing={2} alignItems="center">
      <FormControl sx={{ minWidth: 250 }} size="small">
        <InputLabel>Filter by Organization</InputLabel>
        <Select
          value={orgFilter}
          onChange={handleOrgFilter}
          label="Filter by Organization"
        >
          <MenuItem value="">All</MenuItem>
          {uniqueOrgs.map((org) => (
            <MenuItem key={org} value={org}>{org}</MenuItem>
          ))}
        </Select>
      </FormControl>

     
      <Button variant="outlined" color="primary" onClick={() => setOrgFilter("")}>
        Clear Filter
      </Button>
    </Stack>
  </Box>
)}


      <TableContainer component={Paper} className="table-container">
        <Table>
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox">
              <Checkbox
        indeterminate={selected.length > 0 && selected.length < paginatedEmployees.length}
        checked={paginatedEmployees.length > 0 && selected.every(id => selected.includes(id))}
        onChange={(e) => handleSelectAll(e.target.checked)}
      />
              </TableCell>
             
              <TableCell>Employee ID</TableCell>
              <TableCell>Employee Name</TableCell>
              <TableCell>Organization</TableCell>
              <TableCell>Position</TableCell>
              <TableCell align="center">Actions</TableCell>
              
            </TableRow>
          </TableHead>
         
          <TableBody>
            {paginatedEmployees.length > 0 ? (
              paginatedEmployees.map((emp) => (
                <TableRow key={emp.id} hover>
                  <TableCell padding="checkbox">
                  <Checkbox
    checked={selected.includes(emp.id)}
    onChange={() => handleSelectRow(emp.id)}
  />
                  </TableCell>
                 
                  <TableCell>{emp.emp_id}</TableCell>
                  <TableCell>{emp.name}</TableCell>
                  <TableCell>{emp.organ}</TableCell>
                  <TableCell>{emp.position}</TableCell>
                  <TableCell align="center">
                    <IconButton
                      onClick={(event) => {
                        setAnchorEl(event.currentTarget);
                        setSelectedEmpId(emp.id);
                      }}
                    >
                      <MoreVert />
                    </IconButton>

                    <Menu
                      anchorEl={anchorEl}
                      open={Boolean(anchorEl) && selectedEmpId === emp.id}
                      onClose={() => {
                        setAnchorEl(null);
                        setSelectedEmpId(null);
                      }}
                    >
                      <MenuItem onClick={() => { navigate(`/view/${emp.id}`); setAnchorEl(null); }}>
                        <ListItemIcon><Visibility /></ListItemIcon>
                        <ListItemText primary="View" />
                      </MenuItem>
                      <MenuItem onClick={() => { navigate(`/edit/${emp.id}`); setAnchorEl(null); }}>
                        <ListItemIcon><Edit /></ListItemIcon>
                        <ListItemText primary="Edit" />
                      </MenuItem>
                      <MenuItem onClick={() => { handleDelete(emp.id); setAnchorEl(null); }}>
                        <ListItemIcon><DeleteOutline /></ListItemIcon>
                        <ListItemText primary="Delete" />
                      </MenuItem>
                    </Menu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} align="center">No employees found</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        <TablePagination
          component="div"
          count={filteredEmployees.length}
          page={page}
          onPageChange={(e, newPage) => setPage(newPage)}
          rowsPerPage={rowsPerPage}
          rowsPerPageOptions={[10]}
        />
      <Dialog open={openBatchDialog} onClose={() => setOpenBatchDialog(false)}>
  <DialogTitle>Confirm Batch Deletion</DialogTitle>
  <DialogContent>
    <Typography>
      Are you sure you want to delete {selected.length} selected {selected.length === 1 ? "employee" : "employees"}?
    </Typography>
  </DialogContent>
  <DialogActions>
    <Button onClick={() => setOpenBatchDialog(false)}>Cancel</Button>
    <Button onClick={handleConfirmBatchDelete} color="error"  disabled={loadingDelete}>  {loadingDelete ? <CircularProgress size={24} /> : 'Delete'}</Button>
  </DialogActions>
</Dialog> <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        open={openSnackbar}
        autoHideDuration={3000} 
        onClose={handleCloseSnackbar}
      >
        <SnackbarContent
          style={{ backgroundColor: green[500] }}
          message={snackbarMessage}
        />
      </Snackbar>

      </TableContainer>
    </Container>   
          )}
          </>
  );
}

export default ListEmployee;
