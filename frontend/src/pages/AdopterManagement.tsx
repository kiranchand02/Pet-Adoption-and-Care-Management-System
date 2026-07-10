import React, { useState, useEffect } from 'react';
import {
  Container, Typography, Button, Dialog, DialogTitle, DialogContent,
  DialogActions, TextField, Grid, Box
} from '@mui/material';
import { DataGrid, GridColDef, GridActionsCellItem } from '@mui/x-data-grid';
import { Add, Edit, Visibility } from '@mui/icons-material';
import { apiService } from '../services/apiService';
import { useAuth } from '../contexts/AuthContext';

interface Adopter {
  adopter_id: number;
  name: string;
  contact_details: string;
  address: string;
  preference: string;
}

const AdopterManagement: React.FC = () => {
  const { isAdmin } = useAuth();
  const [adopters, setAdopters] = useState<Adopter[]>([]);
  const [loading, setLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [selectedAdopter, setSelectedAdopter] = useState<Adopter | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    contact_details: '',
    address: '',
    preference: '',
  });

  useEffect(() => {
    loadAdopters();
  }, []);

  const loadAdopters = async () => {
    setLoading(true);
    try {
      const data = await apiService.listAdopters();
      setAdopters(data);
    } catch (error) {
      console.error('Error loading adopters:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddAdopter = () => {
    setSelectedAdopter(null);
    setFormData({
      name: '',
      contact_details: '',
      address: '',
      preference: '',
    });
    setDialogOpen(true);
  };

  const handleEditAdopter = (adopter: Adopter) => {
    setSelectedAdopter(adopter);
    setFormData({
      name: adopter.name,
      contact_details: adopter.contact_details,
      address: adopter.address,
      preference: adopter.preference,
    });
    setDialogOpen(true);
  };

  const handleSaveAdopter = async () => {
    try {
      if (selectedAdopter) {
        await apiService.updateAdopter(selectedAdopter.adopter_id, formData);
      } else {
        await apiService.registerAdopter(formData);
      }
      setDialogOpen(false);
      loadAdopters();
    } catch (error) {
      console.error('Error saving adopter:', error);
    }
  };

  const columns: GridColDef[] = [
    { field: 'adopter_id', headerName: 'ID', width: 70 },
    { field: 'name', headerName: 'Name', width: 150 },
    { field: 'contact_details', headerName: 'Contact', width: 200 },
    { field: 'address', headerName: 'Address', width: 200 },
    { field: 'preference', headerName: 'Preferences', width: 200 },
    {
      field: 'actions',
      type: 'actions',
      headerName: 'Actions',
      width: 120,
      getActions: (params) => {
        const actions = [];
        
        if (isAdmin) {
          actions.push(
            <GridActionsCellItem
              key="edit"
              icon={<Edit />}
              label="Edit"
              onClick={() => handleEditAdopter(params.row)}
            />
          );
        }
        
        actions.push(
          <GridActionsCellItem
            key="view"
            icon={<Visibility />}
            label="View"
            onClick={() => {
              setSelectedAdopter(params.row);
              setViewDialogOpen(true);
            }}
          />
        );
        
        return actions;
      },
    },
  ];

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" gutterBottom>
          {isAdmin ? 'Adopter Management' : 'Adopter Profiles'}
        </Typography>
        {isAdmin && (
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={handleAddAdopter}
          >
            Add Adopter
          </Button>
        )}
      </Box>

      <DataGrid
        rows={adopters}
        columns={columns}
        getRowId={(row) => row.adopter_id}
        loading={loading}
        pageSizeOptions={[10, 25, 50]}
        initialState={{
          pagination: { paginationModel: { pageSize: 10 } },
        }}
        sx={{ height: 600 }}
      />

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          {selectedAdopter ? 'Edit Adopter' : 'Add New Adopter'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Contact Details"
                value={formData.contact_details}
                onChange={(e) => setFormData({ ...formData, contact_details: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={2}
                label="Address"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={3}
                label="Preferences"
                value={formData.preference}
                onChange={(e) => setFormData({ ...formData, preference: e.target.value })}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleSaveAdopter} variant="contained">
            {selectedAdopter ? 'Update' : 'Add'}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={viewDialogOpen} onClose={() => setViewDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          Adopter Profile - {selectedAdopter?.name}
        </DialogTitle>
        <DialogContent>
          {selectedAdopter && (
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="text.secondary">Name:</Typography>
                <Typography variant="body1" sx={{ mb: 2 }}>{selectedAdopter.name}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="text.secondary">ID:</Typography>
                <Typography variant="body1" sx={{ mb: 2 }}>#{selectedAdopter.adopter_id}</Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="subtitle2" color="text.secondary">Contact Details:</Typography>
                <Typography variant="body1" sx={{ mb: 2 }}>{selectedAdopter.contact_details}</Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="subtitle2" color="text.secondary">Address:</Typography>
                <Typography variant="body1" sx={{ mb: 2 }}>{selectedAdopter.address}</Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="subtitle2" color="text.secondary">Pet Preferences:</Typography>
                <Typography variant="body1">{selectedAdopter.preference}</Typography>
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setViewDialogOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default AdopterManagement;