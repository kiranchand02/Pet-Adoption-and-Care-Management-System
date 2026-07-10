import React, { useState, useEffect } from 'react';
import {
  Container, Typography, Grid, Card, CardContent, Box,
  FormControl, InputLabel, Select, MenuItem, Button
} from '@mui/material';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  PieChart, Pie, Cell, LineChart, Line, ResponsiveContainer,
  AreaChart, Area, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar,
  ComposedChart, Scatter, ScatterChart, ZAxis, Treemap, FunnelChart, Funnel, LabelList
} from 'recharts';
import { Download, Assessment } from '@mui/icons-material';
import { apiService } from '../services/apiService';

const Reports: React.FC = () => {
  const [adoptionStats, setAdoptionStats] = useState<any>({});
  const [speciesData, setSpeciesData] = useState<any[]>([]);
  const [breedData, setBreedData] = useState<any[]>([]);
  const [monthlyTrends, setMonthlyTrends] = useState<any[]>([]);
  const [ageGroupData, setAgeGroupData] = useState<any[]>([]);
  const [waitingTimeData, setWaitingTimeData] = useState<any[]>([]);
  const [selectedYear, setSelectedYear] = useState(2024);
  const [selectedSpecies, setSelectedSpecies] = useState('');

  useEffect(() => {
    loadReportData();
  }, [selectedYear, selectedSpecies]);

  const loadReportData = async () => {
    try {
      // Enhanced mock data with multi-year records
      const yearlyData = {
        2022: {
          stats: { total_adopted: 38, still_waiting: 28, total_pets: 66, adoption_rate_percentage: 57.6 },
          species: [
            { species: 'Dog', total_count: 28, adopted_count: 16, available_count: 12, adoption_rate: 57.1 },
            { species: 'Cat', total_count: 22, adopted_count: 14, available_count: 8, adoption_rate: 63.6 },
            { species: 'Bird', total_count: 10, adopted_count: 5, available_count: 5, adoption_rate: 50.0 },
            { species: 'Rabbit', total_count: 6, adopted_count: 3, available_count: 3, adoption_rate: 50.0 }
          ],
          trends: [
            { year: 2022, month: 1, month_name: 'January', completed_adoptions: 6, total_applications: 9 },
            { year: 2022, month: 2, month_name: 'February', completed_adoptions: 4, total_applications: 8 },
            { year: 2022, month: 3, month_name: 'March', completed_adoptions: 8, total_applications: 12 },
            { year: 2022, month: 4, month_name: 'April', completed_adoptions: 5, total_applications: 9 },
            { year: 2022, month: 5, month_name: 'May', completed_adoptions: 7, total_applications: 11 },
            { year: 2022, month: 6, month_name: 'June', completed_adoptions: 8, total_applications: 13 }
          ]
        },
        2023: {
          stats: { total_adopted: 42, still_waiting: 25, total_pets: 67, adoption_rate_percentage: 62.7 },
          species: [
            { species: 'Dog', total_count: 30, adopted_count: 19, available_count: 11, adoption_rate: 63.3 },
            { species: 'Cat', total_count: 24, adopted_count: 16, available_count: 8, adoption_rate: 66.7 },
            { species: 'Bird', total_count: 8, adopted_count: 4, available_count: 4, adoption_rate: 50.0 },
            { species: 'Rabbit', total_count: 5, adopted_count: 3, available_count: 2, adoption_rate: 60.0 }
          ],
          trends: [
            { year: 2023, month: 1, month_name: 'January', completed_adoptions: 7, total_applications: 10 },
            { year: 2023, month: 2, month_name: 'February', completed_adoptions: 5, total_applications: 9 },
            { year: 2023, month: 3, month_name: 'March', completed_adoptions: 9, total_applications: 14 },
            { year: 2023, month: 4, month_name: 'April', completed_adoptions: 6, total_applications: 10 },
            { year: 2023, month: 5, month_name: 'May', completed_adoptions: 8, total_applications: 12 },
            { year: 2023, month: 6, month_name: 'June', completed_adoptions: 7, total_applications: 11 }
          ]
        },
        2024: {
          stats: { total_adopted: 45, still_waiting: 23, total_pets: 68, adoption_rate_percentage: 66.2 },
          species: [
            { species: 'Dog', total_count: 32, adopted_count: 22, available_count: 10, adoption_rate: 68.8 },
            { species: 'Cat', total_count: 26, adopted_count: 18, available_count: 8, adoption_rate: 69.2 },
            { species: 'Bird', total_count: 7, adopted_count: 3, available_count: 4, adoption_rate: 42.9 },
            { species: 'Rabbit', total_count: 3, adopted_count: 2, available_count: 1, adoption_rate: 66.7 }
          ],
          trends: [
            { year: 2024, month: 1, month_name: 'January', completed_adoptions: 8, total_applications: 12 },
            { year: 2024, month: 2, month_name: 'February', completed_adoptions: 6, total_applications: 10 },
            { year: 2024, month: 3, month_name: 'March', completed_adoptions: 10, total_applications: 15 },
            { year: 2024, month: 4, month_name: 'April', completed_adoptions: 7, total_applications: 11 },
            { year: 2024, month: 5, month_name: 'May', completed_adoptions: 9, total_applications: 14 },
            { year: 2024, month: 6, month_name: 'June', completed_adoptions: 5, total_applications: 8 }
          ]
        }
      };

      const currentYearData = yearlyData[selectedYear as keyof typeof yearlyData] || yearlyData[2024];
      
      setAdoptionStats(currentYearData.stats);
      setSpeciesData(currentYearData.species);
      setMonthlyTrends(currentYearData.trends);
      
      // Enhanced age group and waiting time data
      setAgeGroupData([
        { age_group: 'Baby (0-1 years)', total_count: 15, adopted_count: 12, available_count: 3, avg_days_in_shelter: 25 },
        { age_group: 'Young (2-3 years)', total_count: 28, adopted_count: 20, available_count: 8, avg_days_in_shelter: 45 },
        { age_group: 'Adult (4-7 years)', total_count: 25, adopted_count: 15, available_count: 10, avg_days_in_shelter: 75 },
        { age_group: 'Senior (8+ years)', total_count: 13, adopted_count: 5, available_count: 8, avg_days_in_shelter: 120 }
      ]);
      
      setWaitingTimeData([
        { waiting_period: '0-30 days', pet_count: 8, pets: 'Luna (Cat), Max (Dog)' },
        { waiting_period: '31-90 days', pet_count: 12, pets: 'Buddy (Dog), Whiskers (Cat)' },
        { waiting_period: '91-180 days', pet_count: 6, pets: 'Charlie (Dog), Mittens (Cat)' },
        { waiting_period: '181-365 days', pet_count: 3, pets: 'Rex (Dog)' },
        { waiting_period: 'Over 1 year', pet_count: 2, pets: 'Shadow (Cat)' }
      ]);
      
      // Enhanced breed data based on selected species
      const breedsBySpecies = {
        Dog: [
          { breed: 'Golden Retriever', species: 'Dog', total_count: 8, adopted_count: 6, available_count: 2, adoption_rate: 75.0 },
          { breed: 'Labrador', species: 'Dog', total_count: 7, adopted_count: 5, available_count: 2, adoption_rate: 71.4 },
          { breed: 'German Shepherd', species: 'Dog', total_count: 6, adopted_count: 4, available_count: 2, adoption_rate: 66.7 },
          { breed: 'Bulldog', species: 'Dog', total_count: 5, adopted_count: 3, available_count: 2, adoption_rate: 60.0 }
        ],
        Cat: [
          { breed: 'Persian', species: 'Cat', total_count: 6, adopted_count: 5, available_count: 1, adoption_rate: 83.3 },
          { breed: 'Siamese', species: 'Cat', total_count: 5, adopted_count: 4, available_count: 1, adoption_rate: 80.0 },
          { breed: 'Maine Coon', species: 'Cat', total_count: 4, adopted_count: 3, available_count: 1, adoption_rate: 75.0 },
          { breed: 'British Shorthair', species: 'Cat', total_count: 3, adopted_count: 2, available_count: 1, adoption_rate: 66.7 }
        ]
      };
      
      setBreedData(selectedSpecies ? breedsBySpecies[selectedSpecies as keyof typeof breedsBySpecies] || [] : [
        ...breedsBySpecies.Dog,
        ...breedsBySpecies.Cat
      ]);
      
    } catch (error) {
      console.error('Error loading report data:', error);
    }
  };

  const COLORS = {
    primary: ['#667eea', '#764ba2', '#f093fb', '#f5576c', '#4facfe', '#00f2fe'],
    gradient: {
      blue: ['#667eea', '#764ba2'],
      purple: ['#f093fb', '#f5576c'],
      ocean: ['#4facfe', '#00f2fe'],
      sunset: ['#fa709a', '#fee140'],
      forest: ['#56ab2f', '#a8e6cf'],
      fire: ['#ff6b6b', '#feca57']
    },
    status: {
      success: '#10ac84',
      warning: '#f39801',
      error: '#ee5a52',
      info: '#0abde3',
      neutral: '#747d8c'
    }
  };

  const exportReport = () => {
    const reportData = {
      year: selectedYear,
      species_filter: selectedSpecies || 'All',
      generated_at: new Date().toISOString(),
      adoption_statistics: adoptionStats,
      species_breakdown: speciesData,
      monthly_trends: monthlyTrends,
      age_group_analysis: ageGroupData,
      waiting_time_distribution: waitingTimeData,
      popular_breeds: breedData
    };
    
    const dataStr = JSON.stringify(reportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `pet_adoption_report_${selectedYear}_${Date.now()}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" gutterBottom>
          Reports & Analytics
        </Typography>
        <Button
          variant="contained"
          startIcon={<Download />}
          onClick={exportReport}
        >
          Export Report
        </Button>
      </Box>

      {/* Filters */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <FormControl fullWidth>
            <InputLabel>Year</InputLabel>
            <Select
              value={selectedYear}
              label="Year"
              onChange={(e) => setSelectedYear(e.target.value as number)}
            >
              <MenuItem value={2024}>2024</MenuItem>
              <MenuItem value={2023}>2023</MenuItem>
              <MenuItem value={2022}>2022</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <FormControl fullWidth>
            <InputLabel>Species Filter</InputLabel>
            <Select
              value={selectedSpecies}
              label="Species Filter"
              onChange={(e) => setSelectedSpecies(e.target.value)}
            >
              <MenuItem value="">All Species</MenuItem>
              <MenuItem value="Dog">Dog</MenuItem>
              <MenuItem value="Cat">Cat</MenuItem>
              <MenuItem value="Bird">Bird</MenuItem>
              <MenuItem value="Rabbit">Rabbit</MenuItem>
            </Select>
          </FormControl>
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        {/* Adoption Statistics - Radar Chart */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Adoption Performance Radar
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <RadarChart data={[
                  { metric: 'Adoption Rate', value: adoptionStats.adoption_rate_percentage || 0, fullMark: 100 },
                  { metric: 'Available Pets', value: (adoptionStats.still_waiting / adoptionStats.total_pets) * 100 || 0, fullMark: 100 },
                  { metric: 'Processing Speed', value: 85, fullMark: 100 },
                  { metric: 'Success Rate', value: 92, fullMark: 100 },
                  { metric: 'Satisfaction', value: 88, fullMark: 100 }
                ]}>
                  <PolarGrid gridType="polygon" />
                  <PolarAngleAxis dataKey="metric" tick={{ fontSize: 12 }} />
                  <PolarRadiusAxis angle={90} domain={[0, 100]} tick={false} />
                  <Radar
                    name="Performance"
                    dataKey="value"
                    stroke={COLORS.status.info}
                    fill={COLORS.status.info}
                    fillOpacity={0.3}
                    strokeWidth={2}
                  />
                  <Tooltip />
                </RadarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Species Distribution - Sunburst Chart */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Species Distribution & Status
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <defs>
                    {speciesData.map((_, index) => (
                      <linearGradient key={index} id={`speciesGradient${index}`} x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0%" stopColor={COLORS.primary[index % COLORS.primary.length]} stopOpacity={0.8} />
                        <stop offset="100%" stopColor={COLORS.primary[index % COLORS.primary.length]} stopOpacity={0.4} />
                      </linearGradient>
                    ))}
                  </defs>
                  <Pie
                    data={speciesData}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={80}
                    paddingAngle={2}
                    dataKey="total_count"
                    label={({ species, total_count, adoption_rate }) => 
                      `${species}: ${total_count} (${adoption_rate.toFixed(1)}%)`
                    }
                    labelLine={false}
                  >
                    {speciesData.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={`url(#speciesGradient${index})`}
                        stroke={COLORS.primary[index % COLORS.primary.length]}
                        strokeWidth={2}
                      />
                    ))}
                  </Pie>
                  <Pie
                    data={speciesData}
                    cx="50%"
                    cy="50%"
                    innerRadius={85}
                    outerRadius={110}
                    paddingAngle={1}
                    dataKey="adopted_count"
                  >
                    {speciesData.map((entry, index) => (
                      <Cell 
                        key={`adopted-${index}`} 
                        fill={COLORS.status.success}
                        fillOpacity={0.7}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload[0]) {
                        const data = payload[0].payload;
                        return (
                          <div style={{
                            backgroundColor: 'rgba(255,255,255,0.95)',
                            padding: '12px',
                            border: 'none',
                            borderRadius: '8px',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
                          }}>
                            <p style={{ fontWeight: 'bold', margin: '0 0 8px 0' }}>{data.species}</p>
                            <p style={{ margin: '4px 0' }}>Total: {data.total_count} pets</p>
                            <p style={{ margin: '4px 0' }}>Adopted: {data.adopted_count}</p>
                            <p style={{ margin: '4px 0' }}>Available: {data.available_count}</p>
                            <p style={{ margin: '4px 0', color: COLORS.status.success }}>Rate: {data.adoption_rate.toFixed(1)}%</p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Monthly Adoption Trends - Composed Chart */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Monthly Adoption Analytics ({selectedYear})
              </Typography>
              <ResponsiveContainer width="100%" height={400}>
                <ComposedChart data={monthlyTrends}>
                  <defs>
                    <linearGradient id="adoptionGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={COLORS.status.success} stopOpacity={0.8}/>
                      <stop offset="95%" stopColor={COLORS.status.success} stopOpacity={0.1}/>
                    </linearGradient>
                    <linearGradient id="applicationGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={COLORS.status.info} stopOpacity={0.8}/>
                      <stop offset="95%" stopColor={COLORS.status.info} stopOpacity={0.1}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.1)" />
                  <XAxis 
                    dataKey="month_name" 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12 }}
                  />
                  <YAxis 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12 }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgba(255,255,255,0.95)',
                      border: 'none',
                      borderRadius: '8px',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
                    }}
                  />
                  <Legend />
                  <Area
                    type="monotone"
                    dataKey="total_applications"
                    fill="url(#applicationGradient)"
                    stroke={COLORS.status.info}
                    strokeWidth={2}
                    name="Applications"
                  />
                  <Bar
                    dataKey="completed_adoptions"
                    fill={COLORS.status.success}
                    name="Completed"
                    radius={[4, 4, 0, 0]}
                  />
                  <Line
                    type="monotone"
                    dataKey="completed_adoptions"
                    stroke={COLORS.status.warning}
                    strokeWidth={3}
                    dot={{ fill: COLORS.status.warning, strokeWidth: 2, r: 6 }}
                    name="Success Rate"
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Age Group Analysis - Fixed Pipeline */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Age Group Adoption Pipeline
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart 
                  data={ageGroupData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <defs>
                    <linearGradient id="totalGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.8} />
                      <stop offset="100%" stopColor="#1e40af" stopOpacity={0.6} />
                    </linearGradient>
                    <linearGradient id="adoptedGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#10b981" stopOpacity={0.8} />
                      <stop offset="100%" stopColor="#047857" stopOpacity={0.6} />
                    </linearGradient>
                    <linearGradient id="availableGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#f59e0b" stopOpacity={0.8} />
                      <stop offset="100%" stopColor="#d97706" stopOpacity={0.6} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.1)" />
                  <XAxis 
                    dataKey="age_group"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 10 }}
                    angle={-45}
                    textAnchor="end"
                    height={80}
                  />
                  <YAxis 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12 }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgba(255,255,255,0.95)',
                      border: 'none',
                      borderRadius: '8px',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
                    }}
                  />
                  <Legend />
                  <Bar 
                    dataKey="total_count" 
                    fill="url(#totalGrad)"
                    name="Total Pets"
                    radius={[4, 4, 0, 0]}
                  />
                  <Bar 
                    dataKey="adopted_count" 
                    fill="url(#adoptedGrad)"
                    name="Adopted"
                    radius={[4, 4, 0, 0]}
                  />
                  <Bar 
                    dataKey="available_count" 
                    fill="url(#availableGrad)"
                    name="Available"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Waiting Time Analysis */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Waiting Time Distribution
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={waitingTimeData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ waiting_period, percent }) => `${waiting_period} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="pet_count"
                  >
                    {waitingTimeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS.primary[index % COLORS.primary.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Popular Breeds */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Popular Breeds {selectedSpecies && `(${selectedSpecies})`}
              </Typography>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={breedData.slice(0, 10)}>
                  <defs>
                    <linearGradient id="breedTotal" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#8b5cf6" stopOpacity={0.8} />
                      <stop offset="100%" stopColor="#6d28d9" stopOpacity={0.6} />
                    </linearGradient>
                    <linearGradient id="breedAdopted" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#06d6a0" stopOpacity={0.8} />
                      <stop offset="100%" stopColor="#118ab2" stopOpacity={0.6} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.1)" />
                  <XAxis 
                    dataKey="breed" 
                    angle={-45} 
                    textAnchor="end" 
                    height={100}
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12 }}
                  />
                  <YAxis 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12 }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgba(255,255,255,0.95)',
                      border: 'none',
                      borderRadius: '8px',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
                    }}
                  />
                  <Legend />
                  <Bar 
                    dataKey="total_count" 
                    fill="url(#breedTotal)" 
                    name="Total Pets"
                    radius={[4, 4, 0, 0]}
                  />
                  <Bar 
                    dataKey="adopted_count" 
                    fill="url(#breedAdopted)" 
                    name="Successfully Adopted"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Reports;