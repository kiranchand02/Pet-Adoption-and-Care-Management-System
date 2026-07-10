import React, { useState, useEffect } from 'react';
import {
  Container, Typography, Card, CardContent, Grid, Chip, Button,
  Stepper, Step, StepLabel, Dialog, DialogTitle, DialogContent,
  DialogActions, TextField, Box, Tabs, Tab
} from '@mui/material';
import { DataGrid, GridColDef, GridActionsCellItem } from '@mui/x-data-grid';
import { CheckCircle, Cancel, Visibility, Assignment } from '@mui/icons-material';
import { apiService } from '../services/apiService';

interface AdoptionApplication {
  adoption_id: number;
  status: string;
  application_date: string;
  verification_date?: string;
  approval_date?: string;
  completion_date?: string;
  pet_name: string;
  pet_species: string;
  adopter_name: string;
  adopter_contact: string;
  notes?: string;
}

const AdoptionWorkflow: React.FC = () => {
  const [applications, setApplications] = useState<AdoptionApplication[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState<AdoptionApplication | null>(null);
  const [actionDialog, setActionDialog] = useState({ open: false, action: '', title: '' });
  const [actionNotes, setActionNotes] = useState('');
  const [tabValue, setTabValue] = useState(0);

  const steps = ['Application', 'Under Verification', 'Approved', 'Completed'];

  useEffect(() => {
    loadApplications();
  }, [tabValue]);

  const loadApplications = async () => {
    setLoading(true);
    try {
      const statusMap = ['Application', 'Under Verification', 'Approved', 'All'];
      const status = statusMap[tabValue] === 'All' ? undefined : statusMap[tabValue];
      const data = await apiService.listApplicationsByStatus(status);
      setApplications(data);
    } catch (error) {
      console.error('Error loading applications:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusStep = (status: string) => {
    const statusMap: { [key: string]: number } = {
      'Application': 0,
      'Under Verification': 1,
      'Approved': 2,
      'Completed': 3,
      'Rejected': -1,
    };
    return statusMap[status] || 0;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Application': return 'info';
      case 'Under Verification': return 'warning';
      case 'Approved': return 'success';
      case 'Completed': return 'primary';
      case 'Rejected': return 'error';
      default: return 'default';
    }
  };

  const handleAction = (application: AdoptionApplication, action: string) => {
    setSelectedApplication(application);
    setActionNotes('');
    
    const actionTitles: { [key: string]: string } = {
      verify: 'Move to Verification',
      approve: 'Approve Adoption',
      reject: 'Reject Application',
      complete: 'Complete Adoption',
    };
    
    setActionDialog({
      open: true,
      action,
      title: actionTitles[action] || 'Action',
    });
  };

  const executeAction = async () => {
    if (!selectedApplication) return;

    try {
      const { adoption_id } = selectedApplication;
      
      switch (actionDialog.action) {
        case 'verify':
          await apiService.moveToVerification(adoption_id, 'Staff Member', actionNotes);
          break;
        case 'approve':
          await apiService.approveAdoption(adoption_id, 'Manager', actionNotes);
          break;
        case 'reject':
          await apiService.rejectAdoption(adoption_id, 'Manager', actionNotes);
          break;
        case 'complete':
          await apiService.completeAdoption(adoption_id, actionNotes);
          break;
      }
      
      setActionDialog({ open: false, action: '', title: '' });
      loadApplications();
    } catch (error) {
      console.error('Error executing action:', error);
    }
  };

  const getAvailableActions = (status: string) => {
    switch (status) {
      case 'Application':
        return [
          { action: 'verify', label: 'Verify', icon: <CheckCircle />, color: 'primary' },
          { action: 'reject', label: 'Reject', icon: <Cancel />, color: 'error' },
        ];
      case 'Under Verification':
        return [
          { action: 'approve', label: 'Approve', icon: <CheckCircle />, color: 'success' },
          { action: 'reject', label: 'Reject', icon: <Cancel />, color: 'error' },
        ];
      case 'Approved':
        return [
          { action: 'complete', label: 'Complete', icon: <Assignment />, color: 'primary' },
        ];
      default:
        return [];
    }
  };

  const columns: GridColDef[] = [
    { field: 'adoption_id', headerName: 'ID', width: 70 },
    { field: 'pet_name', headerName: 'Pet', width: 120 },
    { field: 'pet_species', headerName: 'Species', width: 100 },
    { field: 'adopter_name', headerName: 'Adopter', width: 150 },
    {
      field: 'status',
      headerName: 'Status',
      width: 150,
      renderCell: (params) => (
        <Chip
          label={params.value}
          color={getStatusColor(params.value) as any}
          size="small"
        />
      ),
    },
    { field: 'application_date', headerName: 'Applied', width: 120 },
    {
      field: 'progress',
      headerName: 'Progress',
      width: 300,
      renderCell: (params) => (
        <Box sx={{ width: '100%', mt: 1 }}>
          <Stepper activeStep={getStatusStep(params.row.status)} alternativeLabel>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
        </Box>
      ),
    },
    {
      field: 'actions',
      type: 'actions',
      headerName: 'Actions',
      width: 200,
      getActions: (params) => {
        const actions = getAvailableActions(params.row.status);
        return [
          <GridActionsCellItem
            icon={<Visibility />}
            label="View"
            onClick={() => console.log('View application', params.row)}
          />,
          ...actions.map((action) => (
            <Button
              key={action.action}
              size="small"
              variant="outlined"
              color={action.color as any}
              startIcon={action.icon}
              onClick={() => handleAction(params.row, action.action)}
              sx={{ ml: 1 }}
            >
              {action.label}
            </Button>
          )),
        ];
      },
    },
  ];

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        Adoption Workflow
      </Typography>

      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={tabValue} onChange={(_, newValue) => setTabValue(newValue)}>
          <Tab label="New Applications" />
          <Tab label="Under Verification" />
          <Tab label="Approved" />
          <Tab label="All Applications" />
        </Tabs>
      </Box>

      <DataGrid
        rows={applications}
        columns={columns}
        getRowId={(row) => row.adoption_id}
        loading={loading}
        pageSizeOptions={[10, 25, 50]}
        initialState={{
          pagination: { paginationModel: { pageSize: 10 } },
        }}
        sx={{ height: 600 }}
        rowHeight={120}
      />

      <Dialog open={actionDialog.open} onClose={() => setActionDialog({ open: false, action: '', title: '' })}>
        <DialogTitle>{actionDialog.title}</DialogTitle>
        <DialogContent>
          {selectedApplication && (
            <Card sx={{ mb: 2 }}>
              <CardContent>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Typography variant="subtitle2">Pet:</Typography>
                    <Typography>{selectedApplication.pet_name} ({selectedApplication.pet_species})</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="subtitle2">Adopter:</Typography>
                    <Typography>{selectedApplication.adopter_name}</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="subtitle2">Current Status:</Typography>
                    <Chip
                      label={selectedApplication.status}
                      color={getStatusColor(selectedApplication.status) as any}
                      size="small"
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="subtitle2">Application Date:</Typography>
                    <Typography>{selectedApplication.application_date}</Typography>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          )}
          
          <TextField
            fullWidth
            multiline
            rows={4}
            label="Notes"
            value={actionNotes}
            onChange={(e) => setActionNotes(e.target.value)}
            placeholder="Enter notes for this action..."
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setActionDialog({ open: false, action: '', title: '' })}>
            Cancel
          </Button>
          <Button onClick={executeAction} variant="contained">
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default AdoptionWorkflow;