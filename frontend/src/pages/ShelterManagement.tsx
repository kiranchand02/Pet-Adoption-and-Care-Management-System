import React, { useState, useEffect } from 'react';
import {
  Container, Typography, Grid, Card, CardContent, Box,
  LinearProgress, Chip, Button, Dialog, DialogTitle,
  DialogContent, DialogActions, TextField
} from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { Home, Pets, TrendingUp } from '@mui/icons-material';
import { apiService } from '../services/apiService';

interface Shelter {
  shelter_id: number;
  name: string;
  location: string;
  capacity: number;
  current_occupancy: number;
  available_space: number;
  occupancy_percentage: number;
  status: string;
  total_rescued: number;
}

const ShelterManagement: React.FC = () => {
  const [shelters, setShelters] = useState<Shelter[]>([]);
  const [capacityReport, setCapacityReport] = useState<any>({});
  const [loading, setLoading] = useState(false);
  const [transferDialog, setTransferDialog] = useState(false);
  const [transferData, setTransferData] = useState({
    petId: 0,
    fromShelterId: 0,
    toShelterId: 0,
  });

  useEffect(() => {
    loadShelterData();
  }, []);

  const loadShelterData = async () => {
    setLoading(true);
    try {
      const [shelterOverview, report] = await Promise.all([
        apiService.getAllSheltersOverview(),
        apiService.getCapacityReport(),
      ]);
      setShelters(shelterOverview);
      setCapacityReport(report);
    } catch (error) {
      console.error('Error loading shelter data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'success';
      case 'Full': return 'error';
      case 'Inactive': return 'default';
      default: return 'default';
    }
  };

  const handleTransferPet = async () => {
    try {
      await apiService.transferPet(
        transferData.petId,
        transferData.fromShelterId,
        transferData.toShelterId
      );
      setTransferDialog(false);
      loadShelterData();
    } catch (error) {
      console.error('Error transferring pet:', error);
    }
  };

  const columns: GridColDef[] = [
    { field: 'shelter_id', headerName: 'ID', width: 70 },
    { field: 'name', headerName: 'Shelter Name', width: 200 },
    { field: 'location', headerName: 'Location', width: 200 },
    { field: 'capacity', headerName: 'Capacity', width: 100 },
    { field: 'current_occupancy', headerName: 'Occupied', width: 100 },
    { field: 'available_space', headerName: 'Available', width: 100 },
    {
      field: 'occupancy_percentage',
      headerName: 'Occupancy %',
      width: 150,
      renderCell: (params) => (
        <Box sx={{ width: '100%' }}>
          <LinearProgress
            variant="determinate"
            value={params.value}
            color={params.value > 90 ? 'error' : params.value > 70 ? 'warning' : 'success'}
          />
          <Typography variant="caption">{params.value}%</Typography>
        </Box>
      ),
    },
    {
      field: 'status',
      headerName: 'Status',
      width: 100,
      renderCell: (params) => (
        <Chip
          label={params.value}
          color={getStatusColor(params.value) as any}
          size="small"
        />
      ),
    },
    { field: 'total_rescued', headerName: 'Total Rescued', width: 120 },
  ];

  const StatCard = ({ title, value, icon, color }: any) => (
    <Card>
      <CardContent>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Box>
            <Typography color="textSecondary" gutterBottom variant="h6">
              {title}
            </Typography>
            <Typography variant="h4" component="h2">
              {value}
            </Typography>
          </Box>
          <Box sx={{ color, fontSize: 40 }}>
            {icon}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        Shelter Management
      </Typography>

      {/* Summary Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Shelters"
            value={capacityReport.total_shelters || 0}
            icon={<Home />}
            color="#2196f3"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Capacity"
            value={capacityReport.total_capacity || 0}
            icon={<Pets />}
            color="#4caf50"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Currently Occupied"
            value={capacityReport.total_occupied || 0}
            icon={<TrendingUp />}
            color="#ff9800"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Available Spaces"
            value={capacityReport.total_available || 0}
            icon={<Home />}
            color="#9c27b0"
          />
        </Grid>
      </Grid>

      {/* Shelter Details Grid */}
      <Card>
        <CardContent>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="h6">
              Shelter Overview
            </Typography>
            <Button
              variant="outlined"
              onClick={() => setTransferDialog(true)}
            >
              Transfer Pet
            </Button>
          </Box>
          <DataGrid
            rows={shelters}
            columns={columns}
            getRowId={(row) => row.shelter_id}
            loading={loading}
            pageSizeOptions={[10, 25]}
            initialState={{
              pagination: { paginationModel: { pageSize: 10 } },
            }}
            sx={{ height: 500 }}
          />
        </CardContent>
      </Card>

      {/* Transfer Pet Dialog */}
      <Dialog open={transferDialog} onClose={() => setTransferDialog(false)}>
        <DialogTitle>Transfer Pet Between Shelters</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                type="number"
                label="Pet ID"
                value={transferData.petId}
                onChange={(e) => setTransferData({ ...transferData, petId: parseInt(e.target.value) })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="number"
                label="From Shelter ID"
                value={transferData.fromShelterId}
                onChange={(e) => setTransferData({ ...transferData, fromShelterId: parseInt(e.target.value) })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="number"
                label="To Shelter ID"
                value={transferData.toShelterId}
                onChange={(e) => setTransferData({ ...transferData, toShelterId: parseInt(e.target.value) })}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setTransferDialog(false)}>Cancel</Button>
          <Button onClick={handleTransferPet} variant="contained">
            Transfer
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default ShelterManagement;