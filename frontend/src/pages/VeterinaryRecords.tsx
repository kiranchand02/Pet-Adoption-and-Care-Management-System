import React, { useState, useEffect } from 'react';
import {
  Container, Typography, Card, CardContent, Grid, Button,
  Dialog, DialogTitle, DialogContent, DialogActions, TextField,
  MenuItem, Box, Tabs, Tab, Chip
} from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { Add, LocalHospital, Vaccines } from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { apiService } from '../services/apiService';
import dayjs from 'dayjs';

interface VetRecord {
  care_id?: number;
  vaccination_id?: number;
  pet_id: number;
  pet_name?: string;
  date: string;
  description: string;
  vet_name: string;
  type: 'vaccination' | 'treatment';
}

const VeterinaryRecords: React.FC = () => {
  const [records, setRecords] = useState<VetRecord[]>([]);
  const [reminders, setReminders] = useState<any[]>([]);
  const [vaccinationRecords, setVaccinationRecords] = useState<any[]>([]);
  const [treatmentHistory, setTreatmentHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [tabValue, setTabValue] = useState(0);
  const [formData, setFormData] = useState({
    pet_id: 0,
    type: 'vaccination',
    vaccine_name: '',
    treatment: '',
    date: dayjs(),
    next_due_date: dayjs().add(1, 'year'),
    vet_name: '',
    batch_number: '',
    notes: '',
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [pendingReminders, vaccinations, treatments] = await Promise.all([
        apiService.getPendingReminders(30),
        apiService.getVaccinationRecords(),
        apiService.getTreatmentHistory()
      ]);
      setReminders(pendingReminders);
      setVaccinationRecords(vaccinations);
      setTreatmentHistory(treatments);
    } catch (error) {
      console.error('Error loading veterinary data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddRecord = () => {
    setFormData({
      pet_id: 0,
      type: 'vaccination',
      vaccine_name: '',
      treatment: '',
      date: dayjs(),
      next_due_date: dayjs().add(1, 'year'),
      vet_name: '',
      batch_number: '',
      notes: '',
    });
    setDialogOpen(true);
  };

  const handleSaveRecord = async () => {
    try {
      if (formData.type === 'vaccination') {
        await apiService.addVaccinationRecord({
          pet_id: formData.pet_id,
          vaccine_name: formData.vaccine_name,
          vaccination_date: formData.date.format('YYYY-MM-DD'),
          next_due_date: formData.next_due_date.format('YYYY-MM-DD'),
          vet_name: formData.vet_name,
          batch_number: formData.batch_number,
          notes: formData.notes,
        });
      } else {
        await apiService.addTreatmentRecord({
          pet_id: formData.pet_id,
          checkup_date: formData.date.format('YYYY-MM-DD'),
          treatment: formData.treatment,
          vet_name: formData.vet_name,
          follow_up_date: formData.next_due_date.format('YYYY-MM-DD'),
        });
      }
      setDialogOpen(false);
      loadData();
    } catch (error) {
      console.error('Error saving record:', error);
    }
  };

  const reminderColumns: GridColDef[] = [
    { field: 'pet_name', headerName: 'Pet', width: 120 },
    { field: 'reminder_type', headerName: 'Type', width: 150 },
    { field: 'due_date', headerName: 'Due Date', width: 120 },
    { field: 'description', headerName: 'Description', width: 250 },
    {
      field: 'status',
      headerName: 'Status',
      width: 100,
      renderCell: (params) => (
        <Chip
          label={params.value}
          color={params.value === 'Overdue' ? 'error' : 'warning'}
          size="small"
        />
      ),
    },
  ];

  const vaccinationColumns: GridColDef[] = [
    { field: 'pet_name', headerName: 'Pet', width: 120 },
    { field: 'vaccine_name', headerName: 'Vaccine', width: 150 },
    { field: 'vaccination_date', headerName: 'Date Given', width: 120 },
    { field: 'next_due_date', headerName: 'Next Due', width: 120 },
    { field: 'vet_name', headerName: 'Veterinarian', width: 150 },
    { field: 'batch_number', headerName: 'Batch #', width: 120 },
    { field: 'notes', headerName: 'Notes', width: 200 },
  ];

  const treatmentColumns: GridColDef[] = [
    { field: 'pet_name', headerName: 'Pet', width: 120 },
    { field: 'checkup_date', headerName: 'Date', width: 120 },
    { field: 'treatment', headerName: 'Treatment', width: 250 },
    { field: 'vet_name', headerName: 'Veterinarian', width: 150 },
    { field: 'follow_up_date', headerName: 'Follow-up', width: 120 },
    { field: 'notes', headerName: 'Notes', width: 200 },
  ];

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" gutterBottom>
          Veterinary Records
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={handleAddRecord}
        >
          Add Record
        </Button>
      </Box>

      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={tabValue} onChange={(_, newValue) => setTabValue(newValue)}>
          <Tab label="Pending Reminders" />
          <Tab label="Vaccination Records" />
          <Tab label="Treatment History" />
        </Tabs>
      </Box>

      {tabValue === 0 && (
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Upcoming & Overdue Checkups
            </Typography>
            <DataGrid
              rows={reminders}
              columns={reminderColumns}
              getRowId={(row) => row.reminder_id}
              loading={loading}
              pageSizeOptions={[10, 25]}
              initialState={{
                pagination: { paginationModel: { pageSize: 10 } },
              }}
              sx={{ height: 400 }}
            />
          </CardContent>
        </Card>
      )}

      {tabValue === 1 && (
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Vaccination Records
            </Typography>
            <DataGrid
              rows={vaccinationRecords}
              columns={vaccinationColumns}
              getRowId={(row) => row.vaccination_id}
              loading={loading}
              pageSizeOptions={[10, 25]}
              initialState={{
                pagination: { paginationModel: { pageSize: 10 } },
              }}
              sx={{ height: 400 }}
            />
          </CardContent>
        </Card>
      )}

      {tabValue === 2 && (
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Treatment History
            </Typography>
            <DataGrid
              rows={treatmentHistory}
              columns={treatmentColumns}
              getRowId={(row) => row.care_id}
              loading={loading}
              pageSizeOptions={[10, 25]}
              initialState={{
                pagination: { paginationModel: { pageSize: 10 } },
              }}
              sx={{ height: 400 }}
            />
          </CardContent>
        </Card>
      )}

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Add Veterinary Record</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="number"
                label="Pet ID"
                value={formData.pet_id}
                onChange={(e) => setFormData({ ...formData, pet_id: parseInt(e.target.value) })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                select
                label="Record Type"
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value as 'vaccination' | 'treatment' })}
              >
                <MenuItem value="vaccination">Vaccination</MenuItem>
                <MenuItem value="treatment">Treatment</MenuItem>
              </TextField>
            </Grid>
            
            {formData.type === 'vaccination' ? (
              <>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Vaccine Name"
                    value={formData.vaccine_name}
                    onChange={(e) => setFormData({ ...formData, vaccine_name: e.target.value })}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Batch Number"
                    value={formData.batch_number}
                    onChange={(e) => setFormData({ ...formData, batch_number: e.target.value })}
                  />
                </Grid>
              </>
            ) : (
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  label="Treatment Description"
                  value={formData.treatment}
                  onChange={(e) => setFormData({ ...formData, treatment: e.target.value })}
                />
              </Grid>
            )}
            
            <Grid item xs={12} sm={6}>
              <DatePicker
                label="Date"
                value={formData.date}
                onChange={(date) => setFormData({ ...formData, date: date || dayjs() })}
                slotProps={{ textField: { fullWidth: true } }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <DatePicker
                label="Next Due Date"
                value={formData.next_due_date}
                onChange={(date) => setFormData({ ...formData, next_due_date: date || dayjs() })}
                slotProps={{ textField: { fullWidth: true } }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Veterinarian Name"
                value={formData.vet_name}
                onChange={(e) => setFormData({ ...formData, vet_name: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={3}
                label="Notes"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleSaveRecord} variant="contained">
            Save Record
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default VeterinaryRecords;