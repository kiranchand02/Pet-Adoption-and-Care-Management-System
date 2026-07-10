import React, { useState, useEffect } from 'react';
import {
  Container, Typography, Button, Dialog, DialogTitle, DialogContent,
  DialogActions, TextField, MenuItem, Grid, Chip, Box, Fab, Card, CardContent
} from '@mui/material';
import { DataGrid, GridColDef, GridActionsCellItem } from '@mui/x-data-grid';
import { Add, Edit, Visibility, Pets, FavoriteOutlined } from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { apiService } from '../services/apiService';
import { useAuth } from '../contexts/AuthContext';
import dayjs from 'dayjs';

interface Pet {
  pet_id: number;
  name: string;
  species: string;
  breed: string;
  age: number;
  gender: string;
  health_status: string;
  rescue_date: string;
  current_status: string;
  shelter_name?: string;
}

const PetManagement: React.FC = () => {
  const { isAdmin } = useAuth();
  const [pets, setPets] = useState<Pet[]>([]);
  const [loading, setLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [applyDialogOpen, setApplyDialogOpen] = useState(false);
  const [selectedPet, setSelectedPet] = useState<Pet | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    species: '',
    breed: '',
    age: 0,
    gender: '',
    health_status: '',
    rescue_date: dayjs(),
    shelter_id: 1,
  });

  useEffect(() => {
    loadPets();
  }, []);

  const loadPets = async () => {
    setLoading(true);
    try {
      const data = await apiService.listPets();
      setPets(data);
    } catch (error) {
      console.error('Error loading pets:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddPet = () => {
    setSelectedPet(null);
    setFormData({
      name: '',
      species: '',
      breed: '',
      age: 0,
      gender: '',
      health_status: '',
      rescue_date: dayjs(),
      shelter_id: 1,
    });
    setDialogOpen(true);
  };

  const handleEditPet = (pet: Pet) => {
    setSelectedPet(pet);
    setFormData({
      name: pet.name,
      species: pet.species,
      breed: pet.breed,
      age: pet.age,
      gender: pet.gender,
      health_status: pet.health_status,
      rescue_date: dayjs(pet.rescue_date),
      shelter_id: 1,
    });
    setDialogOpen(true);
  };

  const handleSavePet = async () => {
    try {
      if (selectedPet) {
        await apiService.updatePet(selectedPet.pet_id, formData);
      } else {
        await apiService.addPet(formData);
      }
      setDialogOpen(false);
      loadPets();
    } catch (error) {
      console.error('Error saving pet:', error);
    }
  };

  const handleStatusChange = async (petId: number, status: string) => {
    try {
      await apiService.markPetStatus(petId, status);
      loadPets();
    } catch (error) {
      console.error('Error updating pet status:', error);
    }
  };

  const handleApplyForPet = (pet: Pet) => {
    setSelectedPet(pet);
    setApplyDialogOpen(true);
  };

  const handleSubmitApplication = async () => {
    try {
      if (selectedPet) {
        await apiService.submitAdoptionApplication({
          pet_id: selectedPet.pet_id,
          pet_name: selectedPet.name,
          applicant_name: 'Current User', // In real app, get from auth context
          application_date: new Date().toISOString(),
          status: 'Pending'
        });
      }
      setApplyDialogOpen(false);
      alert('Application submitted successfully! Admin will review and contact you soon.');
    } catch (error) {
      console.error('Error submitting application:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Available': return 'success';
      case 'Adopted': return 'primary';
      case 'Reserved': return 'warning';
      case 'Under Care': return 'error';
      default: return 'default';
    }
  };

  const columns: GridColDef[] = [
    { field: 'pet_id', headerName: 'ID', width: 70 },
    { field: 'name', headerName: 'Name', width: 130 },
    { field: 'species', headerName: 'Species', width: 100 },
    { field: 'breed', headerName: 'Breed', width: 150 },
    { field: 'age', headerName: 'Age', width: 80 },
    { field: 'gender', headerName: 'Gender', width: 100 },
    {
      field: 'current_status',
      headerName: 'Status',
      width: 120,
      renderCell: (params) => (
        <Chip
          label={params.value}
          color={getStatusColor(params.value) as any}
          size="small"
        />
      ),
    },
    { field: 'health_status', headerName: 'Health', width: 150 },
    { field: 'shelter_name', headerName: 'Shelter', width: 150 },
    {
      field: 'actions',
      type: 'actions',
      headerName: 'Actions',
      width: isAdmin ? 120 : 150,
      getActions: (params) => {
        const actions = [];
        
        if (isAdmin) {
          actions.push(
            <GridActionsCellItem
              key="edit"
              icon={<Edit />}
              label="Edit"
              onClick={() => handleEditPet(params.row)}
            />
          );
        }
        
        actions.push(
          <GridActionsCellItem
            key="view"
            icon={<Visibility />}
            label="View"
            onClick={() => console.log('View pet', params.row)}
          />
        );
        
        if (!isAdmin && params.row.current_status === 'Available') {
          actions.push(
            <GridActionsCellItem
              key="apply"
              icon={<FavoriteOutlined />}
              label="Apply"
              onClick={() => handleApplyForPet(params.row)}
            />
          );
        }
        
        return actions;
      },
    },
  ];

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" gutterBottom>
          {isAdmin ? 'Pet Management' : 'Available Pets'}
        </Typography>
        {isAdmin && (
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={handleAddPet}
          >
            Add Pet
          </Button>
        )}
      </Box>

      <DataGrid
        rows={pets}
        columns={columns}
        getRowId={(row) => row.pet_id}
        loading={loading}
        pageSizeOptions={[10, 25, 50]}
        initialState={{
          pagination: { paginationModel: { pageSize: 10 } },
        }}
        sx={{ height: 600 }}
      />

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          {selectedPet ? 'Edit Pet' : 'Add New Pet'}
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
                select
                label="Species"
                value={formData.species}
                onChange={(e) => setFormData({ ...formData, species: e.target.value })}
              >
                <MenuItem value="Dog">Dog</MenuItem>
                <MenuItem value="Cat">Cat</MenuItem>
                <MenuItem value="Bird">Bird</MenuItem>
                <MenuItem value="Rabbit">Rabbit</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Breed"
                value={formData.breed}
                onChange={(e) => setFormData({ ...formData, breed: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="number"
                label="Age"
                value={formData.age}
                onChange={(e) => setFormData({ ...formData, age: parseInt(e.target.value) })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                select
                label="Gender"
                value={formData.gender}
                onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
              >
                <MenuItem value="Male">Male</MenuItem>
                <MenuItem value="Female">Female</MenuItem>
                <MenuItem value="Unknown">Unknown</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <DatePicker
                label="Rescue Date"
                value={formData.rescue_date}
                onChange={(date) => setFormData({ ...formData, rescue_date: date || dayjs() })}
                slotProps={{ textField: { fullWidth: true } }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={3}
                label="Health Status"
                value={formData.health_status}
                onChange={(e) => setFormData({ ...formData, health_status: e.target.value })}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleSavePet} variant="contained">
            {selectedPet ? 'Update' : 'Add'}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={applyDialogOpen} onClose={() => setApplyDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle sx={{ 
          background: 'linear-gradient(135deg, #4A90E2, #357ABD)',
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          gap: 1
        }}>
          <FavoriteOutlined />
          Apply for Pet Adoption
        </DialogTitle>
        <DialogContent>
          {selectedPet && (
            <Box sx={{ mt: 2 }}>
              {/* Pet Header */}
              <Card sx={{ mb: 3, background: 'linear-gradient(135deg, #f8f9fa, #e9ecef)' }}>
                <CardContent>
                  <Box display="flex" alignItems="center" gap={2} mb={2}>
                    <Box sx={{ 
                      width: 60, 
                      height: 60, 
                      borderRadius: '50%', 
                      background: 'linear-gradient(135deg, #4A90E2, #357ABD)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '24px'
                    }}>
                      {selectedPet.species === 'Dog' ? '🐕' : 
                       selectedPet.species === 'Cat' ? '🐱' : 
                       selectedPet.species === 'Bird' ? '🐦' : 
                       selectedPet.species === 'Rabbit' ? '🐰' : 
                       selectedPet.species === 'Fish' ? '🐠' : 
                       selectedPet.species === 'Hedgehog' ? '🦔' : 
                       selectedPet.species === 'Guinea Pig' ? '🐹' : 
                       selectedPet.species === 'Ferret' ? '🦦' : 
                       selectedPet.species === 'Pig' ? '🐷' : '🐾'}
                    </Box>
                    <Box>
                      <Typography variant="h5" fontWeight={600} color="primary">
                        {selectedPet.name}
                      </Typography>
                      <Chip 
                        label={selectedPet.current_status} 
                        color={getStatusColor(selectedPet.current_status) as any}
                        size="small"
                        sx={{ mt: 0.5 }}
                      />
                    </Box>
                  </Box>
                </CardContent>
              </Card>

              {/* Pet Details Grid */}
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Card sx={{ height: '100%' }}>
                    <CardContent>
                      <Typography variant="h6" gutterBottom color="primary">
                        Basic Information
                      </Typography>
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                        <Box display="flex" justifyContent="space-between">
                          <Typography variant="body2" color="text.secondary">Species:</Typography>
                          <Typography variant="body2" fontWeight={600}>{selectedPet.species}</Typography>
                        </Box>
                        <Box display="flex" justifyContent="space-between">
                          <Typography variant="body2" color="text.secondary">Breed:</Typography>
                          <Typography variant="body2" fontWeight={600}>{selectedPet.breed}</Typography>
                        </Box>
                        <Box display="flex" justifyContent="space-between">
                          <Typography variant="body2" color="text.secondary">Age:</Typography>
                          <Typography variant="body2" fontWeight={600}>{selectedPet.age} years old</Typography>
                        </Box>
                        <Box display="flex" justifyContent="space-between">
                          <Typography variant="body2" color="text.secondary">Gender:</Typography>
                          <Typography variant="body2" fontWeight={600}>{selectedPet.gender}</Typography>
                        </Box>
                        <Box display="flex" justifyContent="space-between">
                          <Typography variant="body2" color="text.secondary">Rescue Date:</Typography>
                          <Typography variant="body2" fontWeight={600}>
                            {new Date(selectedPet.rescue_date).toLocaleDateString()}
                          </Typography>
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Card sx={{ height: '100%' }}>
                    <CardContent>
                      <Typography variant="h6" gutterBottom color="primary">
                        Health & Care
                      </Typography>
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                        <Box>
                          <Typography variant="body2" color="text.secondary" gutterBottom>
                            Health Status:
                          </Typography>
                          <Typography variant="body2" fontWeight={600}>
                            {selectedPet.health_status}
                          </Typography>
                        </Box>
                        <Box>
                          <Typography variant="body2" color="text.secondary" gutterBottom>
                            Current Location:
                          </Typography>
                          <Typography variant="body2" fontWeight={600}>
                            {selectedPet.shelter_name || 'Main Shelter'}
                          </Typography>
                        </Box>
                        <Box>
                          <Typography variant="body2" color="text.secondary" gutterBottom>
                            Pet ID:
                          </Typography>
                          <Typography variant="body2" fontWeight={600} sx={{ fontFamily: 'monospace' }}>
                            #{selectedPet.pet_id.toString().padStart(4, '0')}
                          </Typography>
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>

                <Grid item xs={12}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6" gutterBottom color="primary">
                        Adoption Information
                      </Typography>
                      <Typography variant="body2" color="text.secondary" paragraph>
                        By submitting this application, you are expressing interest in adopting <strong>{selectedPet.name}</strong>. 
                        Our adoption team will review your application and contact you within 2-3 business days to discuss the next steps.
                      </Typography>
                      <Typography variant="body2" color="text.secondary" paragraph>
                        <strong>What happens next:</strong>
                      </Typography>
                      <Box component="ul" sx={{ pl: 2, mt: 1 }}>
                        <Typography component="li" variant="body2" color="text.secondary">
                          Application review by our adoption specialists
                        </Typography>
                        <Typography component="li" variant="body2" color="text.secondary">
                          Phone interview to discuss your preferences and lifestyle
                        </Typography>
                        <Typography component="li" variant="body2" color="text.secondary">
                          Meet and greet session with {selectedPet.name}
                        </Typography>
                        <Typography component="li" variant="body2" color="text.secondary">
                          Home visit (if required) and final approval
                        </Typography>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 3, background: '#f8f9fa' }}>
          <Button onClick={() => setApplyDialogOpen(false)} size="large">
            Cancel
          </Button>
          <Button 
            onClick={handleSubmitApplication} 
            variant="contained" 
            size="large"
            sx={{
              background: 'linear-gradient(135deg, #27AE60, #1E8449)',
              '&:hover': {
                background: 'linear-gradient(135deg, #1E8449, #196F3D)',
              },
              px: 4
            }}
          >
            Submit Application for {selectedPet?.name}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default PetManagement;