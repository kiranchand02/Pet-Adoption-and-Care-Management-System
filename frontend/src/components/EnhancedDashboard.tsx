import React, { useState, useEffect } from 'react';
import {
  Container, Grid, Card, CardContent, Typography, Box, Paper,
  Avatar, LinearProgress, Chip, IconButton, Tooltip, Button,
  List, ListItem, ListItemText, ListItemAvatar, Divider,
  Alert, CircularProgress
} from '@mui/material';
import {
  PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip as RechartsTooltip, Legend, ResponsiveContainer, LineChart,
  Line, AreaChart, Area
} from 'recharts';
import {
  Pets, People, Assignment, Home, TrendingUp, Favorite,
  Schedule, LocalHospital, Notifications, ArrowUpward,
  ArrowDownward, MoreVert, Refresh
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { apiService } from '../services/apiService';

interface DashboardStats {
  totalPets: number;
  availablePets: number;
  adoptedPets: number;
  totalAdopters: number;
  pendingApplications: number;
  totalShelters: number;
  monthlyAdoptions: number;
  adoptionRate: number;
}

interface RecentActivity {
  id: number;
  type: 'adoption' | 'rescue' | 'medical' | 'application';
  title: string;
  description: string;
  timestamp: string;
  avatar: string;
}

const EnhancedDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState<DashboardStats>({
    totalPets: 0,
    availablePets: 0,
    adoptedPets: 0,
    totalAdopters: 0,
    pendingApplications: 0,
    totalShelters: 0,
    monthlyAdoptions: 0,
    adoptionRate: 0,
  });

  const [speciesData, setSpeciesData] = useState<any[]>([]);
  const [monthlyTrends, setMonthlyTrends] = useState<any[]>([]);
  const [recentActivities, setRecentActivities] = useState<RecentActivity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const [adoptionStats, popularSpecies, trends, shelters] = await Promise.all([
        apiService.getAdoptionStats(),
        apiService.getPopularSpecies(),
        apiService.getMonthlyTrends(2024),
        apiService.getAllSheltersOverview(),
      ]);

      setStats({
        totalPets: adoptionStats.total_pets,
        availablePets: adoptionStats.still_waiting,
        adoptedPets: adoptionStats.total_adopted,
        totalAdopters: adoptionStats.total_adopters,
        pendingApplications: adoptionStats.pending_applications,
        totalShelters: shelters.length,
        monthlyAdoptions: 12,
        adoptionRate: adoptionStats.adoption_rate_percentage,
      });

      setSpeciesData(popularSpecies);
      setMonthlyTrends(trends);

      // Mock recent activities
      setRecentActivities([
        {
          id: 1,
          type: 'adoption',
          title: 'Buddy was adopted!',
          description: 'Golden Retriever found his forever home with the Johnson family',
          timestamp: '2 hours ago',
          avatar: '🐕'
        },
        {
          id: 2,
          type: 'rescue',
          title: 'New rescue: Luna',
          description: 'Persian cat rescued from downtown area, needs medical attention',
          timestamp: '4 hours ago',
          avatar: '🐱'
        },
        {
          id: 3,
          type: 'application',
          title: 'New adoption application',
          description: 'Sarah Wilson applied to adopt Max the German Shepherd',
          timestamp: '6 hours ago',
          avatar: '📋'
        },
        {
          id: 4,
          type: 'medical',
          title: 'Vaccination completed',
          description: 'Charlie received his annual vaccinations',
          timestamp: '1 day ago',
          avatar: '💉'
        }
      ]);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ title, value, subtitle, icon, color, trend, trendValue }: any) => (
    <Card
      sx={{
        height: '100%',
        background: `linear-gradient(135deg, ${color}, ${color}dd)`,
        color: 'white',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <CardContent>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Box>
            <Typography variant="h6" sx={{ opacity: 0.9, mb: 1 }}>
              {title}
            </Typography>
            <Typography variant="h3" component="h2" fontWeight={700}>
              {value}
            </Typography>
            {subtitle && (
              <Typography variant="body2" sx={{ opacity: 0.8, mt: 1 }}>
                {subtitle}
              </Typography>
            )}
            {trend && (
              <Box display="flex" alignItems="center" mt={1}>
                {trend === 'up' ? (
                  <ArrowUpward sx={{ fontSize: 16, mr: 0.5 }} />
                ) : (
                  <ArrowDownward sx={{ fontSize: 16, mr: 0.5 }} />
                )}
                <Typography variant="caption">
                  {trendValue}% from last month
                </Typography>
              </Box>
            )}
          </Box>
          <Box sx={{ fontSize: 48, opacity: 0.3 }}>
            {icon}
          </Box>
        </Box>
      </CardContent>
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          right: 0,
          width: 100,
          height: 100,
          background: 'rgba(255,255,255,0.1)',
          borderRadius: '50%',
          transform: 'translate(30px, -30px)',
        }}
      />
    </Card>
  );

  const COLORS = ['#4A90E2', '#27AE60', '#F39C12', '#E74C3C', '#9B59B6'];

  const petStatusData = [
    { name: 'Available', value: stats.availablePets, color: '#27AE60' },
    { name: 'Adopted', value: stats.adoptedPets, color: '#4A90E2' },
    { name: 'Reserved', value: 8, color: '#F39C12' },
    { name: 'Under Care', value: 5, color: '#E74C3C' },
  ];

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'adoption': return <Favorite sx={{ color: '#E74C3C' }} />;
      case 'rescue': return <Pets sx={{ color: '#27AE60' }} />;
      case 'application': return <Assignment sx={{ color: '#4A90E2' }} />;
      case 'medical': return <LocalHospital sx={{ color: '#9B59B6' }} />;
      default: return <Notifications />;
    }
  };

  if (loading) {
    return (
      <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
        <Box display="flex" justifyContent="center" alignItems="center" height="400px">
          <CircularProgress size={60} />
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Box>
          <Typography variant="h4" gutterBottom fontWeight={600}>
            Dashboard Overview
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Welcome back! Here's what's happening with your pet adoption center.
          </Typography>
        </Box>
        <Button
          variant="outlined"
          startIcon={<Refresh />}
          onClick={loadDashboardData}
          disabled={loading}
        >
          {loading ? 'Refreshing...' : 'Refresh Data'}
        </Button>
      </Box>

      {/* Alert Banner */}
      <Alert severity="info" sx={{ mb: 3 }}>
        <Typography variant="body2">
          🎉 Great news! You've successfully placed {stats.monthlyAdoptions} pets in loving homes this month.
        </Typography>
      </Alert>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Pets"
            value={stats.totalPets}
            subtitle="In our care"
            icon={<Pets />}
            color="#4A90E2"
            trend="up"
            trendValue="8"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Available"
            value={stats.availablePets}
            subtitle="Ready for adoption"
            icon={<Favorite />}
            color="#27AE60"
            trend="down"
            trendValue="3"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Adopters"
            value={stats.totalAdopters}
            subtitle="Registered families"
            icon={<People />}
            color="#F39C12"
            trend="up"
            trendValue="12"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Success Rate"
            value={`${stats.adoptionRate}%`}
            subtitle="Adoption success"
            icon={<TrendingUp />}
            color="#9B59B6"
            trend="up"
            trendValue="5"
          />
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        {/* Pet Status Distribution */}
        <Grid item xs={12} md={6} lg={4}>
          <Card sx={{ height: 400 }}>
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h6" fontWeight={600}>
                  Pet Status Distribution
                </Typography>
                <Tooltip title="View Details">
                  <IconButton size="small" onClick={() => navigate('/pets')}>
                    <MoreVert />
                  </IconButton>
                </Tooltip>
              </Box>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={petStatusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {petStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <RechartsTooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Monthly Adoption Trends */}
        <Grid item xs={12} md={6} lg={8}>
          <Card sx={{ height: 400 }}>
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h6" fontWeight={600}>
                  Monthly Adoption Trends
                </Typography>
                <Tooltip title="View Full Report">
                  <Chip 
                    label="2024" 
                    color="primary" 
                    variant="outlined" 
                    onClick={() => navigate('/reports')}
                    sx={{ cursor: 'pointer' }}
                  />
                </Tooltip>
              </Box>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={monthlyTrends}>
                  <defs>
                    <linearGradient id="colorAdoptions" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#4A90E2" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#4A90E2" stopOpacity={0.1}/>
                    </linearGradient>
                    <linearGradient id="colorApplications" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#27AE60" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#27AE60" stopOpacity={0.1}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month_name" />
                  <YAxis />
                  <RechartsTooltip />
                  <Legend />
                  <Area
                    type="monotone"
                    dataKey="completed_adoptions"
                    stroke="#4A90E2"
                    fillOpacity={1}
                    fill="url(#colorAdoptions)"
                    name="Completed Adoptions"
                  />
                  <Area
                    type="monotone"
                    dataKey="total_applications"
                    stroke="#27AE60"
                    fillOpacity={1}
                    fill="url(#colorApplications)"
                    name="Total Applications"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Species Popularity */}
        <Grid item xs={12} md={6}>
          <Card sx={{ height: 400 }}>
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h6" fontWeight={600}>
                  Species Popularity Trends
                </Typography>
                <Chip label="Live Data" color="success" variant="outlined" size="small" />
              </Box>
              <ResponsiveContainer width="100%" height={320}>
                <LineChart data={speciesData}>
                  <defs>
                    <linearGradient id="dogGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#4A90E2" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#4A90E2" stopOpacity={0.1}/>
                    </linearGradient>
                    <linearGradient id="catGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#27AE60" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#27AE60" stopOpacity={0.1}/>
                    </linearGradient>
                    <linearGradient id="birdGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#F39C12" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#F39C12" stopOpacity={0.1}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.1)" />
                  <XAxis 
                    dataKey="species" 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: '#666' }}
                  />
                  <YAxis 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: '#666' }}
                  />
                  <RechartsTooltip 
                    contentStyle={{
                      backgroundColor: 'rgba(255,255,255,0.95)',
                      border: 'none',
                      borderRadius: '8px',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
                    }}
                  />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="total_count" 
                    stroke="#4A90E2" 
                    strokeWidth={3}
                    dot={{ fill: '#4A90E2', strokeWidth: 2, r: 6 }}
                    activeDot={{ r: 8, stroke: '#4A90E2', strokeWidth: 2, fill: '#fff' }}
                    name="Total Pets"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="adopted_count" 
                    stroke="#27AE60" 
                    strokeWidth={3}
                    strokeDasharray="5 5"
                    dot={{ fill: '#27AE60', strokeWidth: 2, r: 6 }}
                    activeDot={{ r: 8, stroke: '#27AE60', strokeWidth: 2, fill: '#fff' }}
                    name="Adopted"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="available_count" 
                    stroke="#F39C12" 
                    strokeWidth={3}
                    strokeDasharray="10 5"
                    dot={{ fill: '#F39C12', strokeWidth: 2, r: 6 }}
                    activeDot={{ r: 8, stroke: '#F39C12', strokeWidth: 2, fill: '#fff' }}
                    name="Available"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Recent Activities */}
        <Grid item xs={12} md={6}>
          <Card sx={{ height: 400 }}>
            <CardContent>
              <Typography variant="h6" fontWeight={600} gutterBottom>
                Recent Activities
              </Typography>
              <List sx={{ maxHeight: 320, overflow: 'auto' }}>
                {recentActivities.map((activity, index) => (
                  <React.Fragment key={activity.id}>
                    <ListItem 
                      alignItems="flex-start"
                      sx={{ 
                        cursor: 'pointer',
                        '&:hover': { backgroundColor: 'action.hover' }
                      }}
                      onClick={() => {
                        switch(activity.type) {
                          case 'adoption':
                          case 'application':
                            navigate('/adoptions');
                            break;
                          case 'rescue':
                            navigate('/pets');
                            break;
                          case 'medical':
                            navigate('/veterinary');
                            break;
                          default:
                            break;
                        }
                      }}
                    >
                      <ListItemAvatar>
                        <Avatar sx={{ bgcolor: 'transparent', fontSize: '1.5rem' }}>
                          {activity.avatar}
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={
                          <Box display="flex" alignItems="center" gap={1}>
                            {getActivityIcon(activity.type)}
                            <Typography variant="body2" fontWeight={600}>
                              {activity.title}
                            </Typography>
                          </Box>
                        }
                        secondary={
                          <Box>
                            <Typography variant="body2" color="text.secondary">
                              {activity.description}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {activity.timestamp}
                            </Typography>
                          </Box>
                        }
                      />
                    </ListItem>
                    {index < recentActivities.length - 1 && <Divider variant="inset" component="li" />}
                  </React.Fragment>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Quick Actions */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" fontWeight={600} gutterBottom>
                Quick Actions
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6} md={3}>
                  <Button
                    fullWidth
                    variant="outlined"
                    startIcon={<Pets />}
                    sx={{ py: 2 }}
                    onClick={() => navigate('/pets')}
                  >
                    Add New Pet
                  </Button>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Button
                    fullWidth
                    variant="outlined"
                    startIcon={<People />}
                    sx={{ py: 2 }}
                    onClick={() => navigate('/adopters')}
                  >
                    Register Adopter
                  </Button>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Button
                    fullWidth
                    variant="outlined"
                    startIcon={<Assignment />}
                    sx={{ py: 2 }}
                    onClick={() => navigate('/adoptions')}
                  >
                    Process Application
                  </Button>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Button
                    fullWidth
                    variant="outlined"
                    startIcon={<Schedule />}
                    sx={{ py: 2 }}
                    onClick={() => navigate('/veterinary')}
                  >
                    Schedule Checkup
                  </Button>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default EnhancedDashboard;