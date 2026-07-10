import React, { useState, useEffect } from 'react';
import {
  Container, Typography, Button, Dialog, DialogTitle, DialogContent,
  DialogActions, TextField, MenuItem, Grid, Box, Card, CardContent, Chip
} from '@mui/material';
import { DataGrid, GridColDef, GridActionsCellItem } from '@mui/x-data-grid';
import { Add, Visibility, AttachMoney, Favorite } from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { apiService } from '../services/apiService';
import { useAuth } from '../contexts/AuthContext';
import dayjs from 'dayjs';

interface Donation {
  donation_id: number;
  donor_name: string;
  amount: number;
  date: string;
  purpose: string;
}

interface DonationStats {
  total_amount: number;
  total_donations: number;
  food_donations: number;
  medical_donations: number;
  shelter_donations: number;
}

const DonationManagement: React.FC = () => {
  const { isAdmin } = useAuth();
  const [donations, setDonations] = useState<Donation[]>([]);
  const [stats, setStats] = useState<DonationStats>({
    total_amount: 0,
    total_donations: 0,
    food_donations: 0,
    medical_donations: 0,
    shelter_donations: 0
  });
  const [loading, setLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    donor_name: '',
    amount: 0,
    date: dayjs(),
    purpose: 'Food',
  });

  useEffect(() => {
    loadDonations();
    loadStats();
  }, []);

  const loadDonations = async () => {
    setLoading(true);
    try {
      const data = await apiService.listDonations();
      setDonations(data);
    } catch (error) {
      console.error('Error loading donations:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const data = await apiService.getDonationStats();
      setStats(data);
    } catch (error) {
      console.error('Error loading donation stats:', error);
    }
  };

  const handleAddDonation = () => {
    setFormData({
      donor_name: '',
      amount: 0,
      date: dayjs(),
      purpose: 'Food',
    });
    setDialogOpen(true);
  };

  const handleSaveDonation = async () => {
    try {
      await apiService.addDonation(formData);
      setDialogOpen(false);
      loadDonations();
      loadStats();
    } catch (error) {
      console.error('Error saving donation:', error);
    }
  };

  const getPurposeColor = (purpose: string) => {
    switch (purpose) {
      case 'Food': return 'success';
      case 'Medical': return 'error';
      case 'Shelter': return 'primary';
      default: return 'default';
    }
  };

  const StatCard = ({ title, value, icon, color }: any) => (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Box>
            <Typography color="textSecondary" gutterBottom variant="h6">
              {title}
            </Typography>
            <Typography variant="h4" component="h2">
              {typeof value === 'number' && title.includes('$') ? `$${value.toLocaleString()}` : value}
            </Typography>
          </Box>
          <Box sx={{ color, fontSize: 40 }}>
            {icon}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );

  const columns: GridColDef[] = [
    { field: 'donation_id', headerName: 'ID', width: 70 },
    { field: 'donor_name', headerName: 'Donor Name', width: 200 },
    { 
      field: 'amount', 
      headerName: 'Amount', 
      width: 120,
      renderCell: (params) => `$${params.value.toLocaleString()}`
    },
    { 
      field: 'date', 
      headerName: 'Date', 
      width: 120,
      renderCell: (params) => new Date(params.value).toLocaleDateString()
    },
    {
      field: 'purpose',
      headerName: 'Purpose',
      width: 120,
      renderCell: (params) => (
        <Chip
          label={params.value}
          color={getPurposeColor(params.value) as any}
          size="small"
        />
      ),
    },
    {
      field: 'actions',
      type: 'actions',
      headerName: 'Actions',
      width: 100,
      getActions: (params) => [
        <GridActionsCellItem
          key="view"
          icon={<Visibility />}
          label="View"
          onClick={() => console.log('View donation', params.row)}
        />
      ],
    },
  ];

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" gutterBottom>
          Donation Management
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={handleAddDonation}
          sx={{
            background: 'linear-gradient(135deg, #27AE60, #1E8449)',
            '&:hover': {
              background: 'linear-gradient(135deg, #1E8449, #196F3D)',
            }
          }}
        >
          Record Donation
        </Button>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Donations"
            value={`$${stats.total_amount.toLocaleString()}`}
            icon={<AttachMoney />}
            color="#27AE60"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Food Support"
            value={`$${stats.food_donations.toLocaleString()}`}
            icon={<Favorite />}
            color="#4CAF50"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Medical Fund"
            value={`$${stats.medical_donations.toLocaleString()}`}
            icon={<AttachMoney />}
            color="#F44336"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Shelter Support"
            value={`$${stats.shelter_donations.toLocaleString()}`}
            icon={<AttachMoney />}
            color="#2196F3"
          />
        </Grid>
      </Grid>

      <DataGrid
        rows={donations}
        columns={columns}
        getRowId={(row) => row.donation_id}
        loading={loading}
        pageSizeOptions={[10, 25, 50]}
        initialState={{
          pagination: { paginationModel: { pageSize: 10 } },
        }}
        sx={{ height: 600 }}
      />

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Record New Donation</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Donor Name"
                value={formData.donor_name}
                onChange={(e) => setFormData({ ...formData, donor_name: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="number"
                label="Amount ($)"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: parseFloat(e.target.value) })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <DatePicker
                label="Donation Date"
                value={formData.date}
                onChange={(date) => setFormData({ ...formData, date: date || dayjs() })}
                slotProps={{ textField: { fullWidth: true } }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                select
                label="Purpose"
                value={formData.purpose}
                onChange={(e) => setFormData({ ...formData, purpose: e.target.value })}
              >
                <MenuItem value="Food">Food</MenuItem>
                <MenuItem value="Medical">Medical</MenuItem>
                <MenuItem value="Shelter">Shelter</MenuItem>
              </TextField>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleSaveDonation} variant="contained">
            Record Donation
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default DonationManagement;