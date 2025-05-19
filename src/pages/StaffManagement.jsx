import * as React from 'react';
import { useState, useEffect } from 'react';
// Import MUI components individually
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import IconButton from '@mui/material/IconButton';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import CircularProgress from '@mui/material/CircularProgress';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Alert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';

import { getAllStaff, registerStaff, deleteStaff, getAllModules, assignStaffToModule } from '../services/api';

const StaffManagement = () => {
  const [staff, setStaff] = useState([]);
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [openAssignDialog, setOpenAssignDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [selectedModule, setSelectedModule] = useState('');
  const [newStaffData, setNewStaffData] = useState({
    name: '',
    email: '',
    location: ''
  });

  useEffect(() => {
    fetchStaff();
    fetchModules();
  }, []);

  const fetchStaff = async () => {
    try {
      setLoading(true);
      const response = await getAllStaff();
      setStaff(response.data);
    } catch (error) {
      console.error('Error fetching staff:', error);
      setError('Failed to load staff members');
    } finally {
      setLoading(false);
    }
  };

  const fetchModules = async () => {
    try {
      const response = await getAllModules();
      setModules(response.data.modules || []);
    } catch (error) {
      console.error('Error fetching modules:', error);
    }
  };

  const handleOpenAddDialog = () => {
    setNewStaffData({
      name: '',
      email: '',
      location: ''
    });
    setOpenAddDialog(true);
  };

  const handleCloseAddDialog = () => {
    setOpenAddDialog(false);
  };

  const handleOpenAssignDialog = (staff) => {
    setSelectedStaff(staff);
    setSelectedModule('');
    setOpenAssignDialog(true);
  };

  const handleCloseAssignDialog = () => {
    setOpenAssignDialog(false);
  };

  const handleOpenDeleteDialog = (staff) => {
    setSelectedStaff(staff);
    setOpenDeleteDialog(true);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
  };

  const handleNewStaffChange = (e) => {
    const { name, value } = e.target;
    setNewStaffData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddStaff = async () => {
    try {
      setLoading(true);
      await registerStaff(newStaffData);
      setOpenAddDialog(false);
      fetchStaff();
      setSuccess('Staff member added successfully with default password: 12345');
    } catch (error) {
      console.error('Error adding staff:', error);
      setError(error.response?.data?.message || 'Failed to add staff member');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteStaff = async () => {
    try {
      setLoading(true);
      await deleteStaff(selectedStaff._id);
      setOpenDeleteDialog(false);
      fetchStaff();
      setSuccess('Staff member deleted successfully');
    } catch (error) {
      console.error('Error deleting staff:', error);
      setError('Failed to delete staff member');
    } finally {
      setLoading(false);
    }
  };

  const handleAssignStaff = async () => {
    try {
      setLoading(true);
      await assignStaffToModule(selectedModule, selectedStaff._id);
      setOpenAssignDialog(false);
      setSuccess('Staff assigned to module successfully');
    } catch (error) {
      console.error('Error assigning staff:', error);
      setError('Failed to assign staff to module');
    } finally {
      setLoading(false);
    }
  };

  const handleCloseSnackbar = () => {
    setSuccess('');
    setError('');
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Staff Management
        </Typography>

        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 3 }}>
          <Button 
            variant="contained" 
            onClick={handleOpenAddDialog}
          >
            Add Staff
          </Button>
        </Box>

        <Snackbar 
          open={!!success} 
          autoHideDuration={6000} 
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        >
          <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: '100%' }}>
            {success}
          </Alert>
        </Snackbar>

        <Snackbar 
          open={!!error} 
          autoHideDuration={6000} 
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        >
          <Alert onClose={handleCloseSnackbar} severity="error" sx={{ width: '100%' }}>
            {error}
          </Alert>
        </Snackbar>

        <Paper sx={{ width: '100%', overflow: 'hidden' }}>
          <TableContainer sx={{ maxHeight: 650 }}>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Location</TableCell>
                  <TableCell align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={4} align="center">
                      <CircularProgress size={24} />
                    </TableCell>
                  </TableRow>
                ) : staff.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} align="center">
                      No staff members found
                    </TableCell>
                  </TableRow>
                ) : (
                  staff.map((staffMember) => (
                    <TableRow key={staffMember._id}>
                      <TableCell>{staffMember.name}</TableCell>
                      <TableCell>{staffMember.email}</TableCell>
                      <TableCell>{staffMember.location}</TableCell>
                      <TableCell align="center">
                        <IconButton 
                          color="primary" 
                          onClick={() => handleOpenAssignDialog(staffMember)}
                          title="Assign to module"
                        >
                          Assign
                        </IconButton>
                        <IconButton 
                          color="error" 
                          onClick={() => handleOpenDeleteDialog(staffMember)}
                          title="Delete staff"
                        >
                          Delete
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Box>

      {/* Add Staff Dialog */}
      <Dialog open={openAddDialog} onClose={handleCloseAddDialog}>
        <DialogTitle>Add New Staff</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Enter the staff member's details. The default password will be "12345".
          </DialogContentText>
          <TextField
            margin="dense"
            name="name"
            label="Full Name"
            type="text"
            fullWidth
            variant="outlined"
            value={newStaffData.name}
            onChange={handleNewStaffChange}
            required
          />
          <TextField
            margin="dense"
            name="email"
            label="Email Address"
            type="email"
            fullWidth
            variant="outlined"
            value={newStaffData.email}
            onChange={handleNewStaffChange}
            required
          />
          <TextField
            margin="dense"
            name="location"
            label="Location"
            type="text"
            fullWidth
            variant="outlined"
            value={newStaffData.location}
            onChange={handleNewStaffChange}
            required
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseAddDialog}>Cancel</Button>
          <Button onClick={handleAddStaff} disabled={loading}>
            {loading ? <CircularProgress size={24} /> : 'Add Staff'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Assign Staff Dialog */}
      <Dialog open={openAssignDialog} onClose={handleCloseAssignDialog}>
        <DialogTitle>Assign Staff to Module</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Assign {selectedStaff?.name} to a training module.
          </DialogContentText>
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel id="module-select-label">Training Module</InputLabel>
            <Select
              labelId="module-select-label"
              id="module-select"
              value={selectedModule}
              label="Training Module"
              onChange={(e) => setSelectedModule(e.target.value)}
            >
              {modules.map((module) => (
                <MenuItem key={module._id} value={module._id}>
                  {module.title} ({module.location || 'No location'})
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseAssignDialog}>Cancel</Button>
          <Button onClick={handleAssignStaff} disabled={!selectedModule || loading}>
            {loading ? <CircularProgress size={24} /> : 'Assign'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={openDeleteDialog} onClose={handleCloseDeleteDialog}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete {selectedStaff?.name}? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog}>Cancel</Button>
          <Button onClick={handleDeleteStaff} color="error" disabled={loading}>
            {loading ? <CircularProgress size={24} /> : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default StaffManagement; 