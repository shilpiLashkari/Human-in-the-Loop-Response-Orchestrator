import React, { useEffect, useState } from 'react';
import {
  Paper,
  Typography,
  Box,
  Card,
  CardContent,
  AppBar,
  Toolbar,
  Chip,
  IconButton,
  CssBaseline,
  ThemeProvider,
  createTheme
} from '@mui/material';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer
} from 'recharts';

import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import AssessmentIcon from '@mui/icons-material/Assessment';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import RadarIcon from '@mui/icons-material/Radar';
import TimelineIcon from '@mui/icons-material/Timeline';


const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: { main: '#6366f1' },
    secondary: { main: '#ec4899' },
    background: {
      default: '#0b1120',
      paper: '#111827'
    }
  },
  typography: {
    fontFamily: '"Outfit", "Inter", sans-serif',
  }
});

const getMockIncidents = () => [
  { id: 1, severity: 'high', source: 'Prometheus', status: 'active', title: 'High CPU Usage' },
  { id: 2, severity: 'critical', source: 'Datadog', status: 'investigating', title: 'DB Pool Exhausted' },
  { id: 3, severity: 'medium', source: 'CloudWatch', status: 'remediated', title: 'Disk Space Low' },
  { id: 4, severity: 'high', source: 'PagerDuty', status: 'active', title: 'Memory Leak' },
  { id: 5, severity: 'low', source: 'Grafana', status: 'closed', title: 'Cert Expiring' },
  { id: 6, severity: 'critical', source: 'Prometheus', status: 'active', title: 'Traffic Spike' }
];

const StatCard = ({ title, value, icon, color, gradient }) => (
  <Card sx={{
    height: '100%',
    background: 'rgba(31, 41, 55, 0.4)',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(255, 255, 255, 0.05)',
    position: 'relative',
    overflow: 'hidden',
    '&::before': {
      content: '""',
      position: 'absolute',
      left: 0,
      top: 0,
      bottom: 0,
      width: '4px',
      backgroundColor: color,
    }
  }}>
    <CardContent sx={{ p: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="overline" sx={{ color: 'text.secondary', fontWeight: 600, letterSpacing: 1 }}>
            {title}
          </Typography>
          <Typography variant="h4" sx={{ fontWeight: 800, mt: 0.5 }}>
            {value}
          </Typography>
        </Box>
        <Box sx={{
          p: 1.5,
          borderRadius: '16px',
          background: gradient,
          color: '#fff',
          boxShadow: '0 8px 32px -4px rgba(0,0,0,0.3)'
        }}>
          {icon}
        </Box>
      </Box>
    </CardContent>
  </Card>
);

function App() {
  const [incidents, setIncidents] = useState([]);

  useEffect(() => {
    fetch('http://localhost:3002/api/incidents')
      .then(res => res.json())
      .then(data => {
        if (!data || data.length === 0) setIncidents(getMockIncidents());
        else setIncidents(data);
      })
      .catch(() => setIncidents(getMockIncidents()));
  }, []);

  const severityData = [
    { name: 'Low', count: incidents.filter(i => i.severity === 'low').length },
    { name: 'Medium', count: incidents.filter(i => i.severity === 'medium').length },
    { name: 'High', count: incidents.filter(i => i.severity === 'high').length },
    { name: 'Critical', count: incidents.filter(i => i.severity === 'critical').length },
  ];

  const sourceMap = {};
  incidents.forEach(i => { sourceMap[i.source] = (sourceMap[i.source] || 0) + 1; });
  const sourceData = Object.keys(sourceMap).map(key => ({ name: key, value: sourceMap[key] }));
  const COLORS = ['#6366f1', '#ec4899', '#f59e0b', '#10b981', '#a855f7'];

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{
        width: '100vw',
        minHeight: '100vh',
        background: '#0b1120',
        margin: 0,
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        bgcolor: '#0a0a1a',
        color: '#fff',
        overflowX: 'hidden'
      }}>
        <AppBar position="static" sx={{ bgcolor: 'rgba(10, 10, 26, 0.8)', backdropFilter: 'blur(10px)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
          <Toolbar sx={{ justifyContent: 'space-between', flexWrap: 'wrap', gap: 2, py: { xs: 1, md: 0 } }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <RadarIcon sx={{ color: '#00d2ff', fontSize: 32 }} />
              <Typography variant="h6" sx={{ fontWeight: 800, letterSpacing: '-0.5px', fontSize: { xs: '1.2rem', md: '1.5rem' } }}>
                Operational Intelligence Hub
              </Typography>
            </Box>
            <Chip
              icon={
                <Box
                  sx={{
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    bgcolor: '#10b981',
                    ml: 1,
                    mr: -0.5,
                    boxShadow: '0 0 10px #10b981',
                    animation: 'pulse 2s infinite ease-in-out',
                    '@keyframes pulse': {
                      '0%': { transform: 'scale(0.95)', boxShadow: '0 0 0 0 rgba(16, 185, 129, 0.7)' },
                      '70%': { transform: 'scale(1)', boxShadow: '0 0 0 10px rgba(16, 185, 129, 0)' },
                      '100%': { transform: 'scale(0.95)', boxShadow: '0 0 0 0 rgba(16, 185, 129, 0)' }
                    }
                  }}
                />
              }
              label="Systems Operational"
              sx={{
                bgcolor: 'rgba(0,0,0,0.5)',
                color: '#fff',
                fontWeight: 900,
                fontSize: '0.85rem',
                border: '1px solid rgba(255,255,255,0.3)',
                backdropFilter: 'blur(8px)',
                px: 1.5,
                height: '32px',
                '& .MuiChip-label': { px: 1 }
              }}

            />

          </Toolbar>
        </AppBar>

        <Box sx={{ width: '100%', px: 2, py: 3, boxSizing: 'border-box' }}>
          <Box sx={{ mb: 4, px: 2 }}>
            <Typography variant="h4" sx={{ fontWeight: 900, mb: 0.5, letterSpacing: '-0.02em', fontSize: { xs: '1.75rem', md: '2.25rem' } }}>
              Operational Intelligence Hub
            </Typography>
            <Typography variant="body1" sx={{ color: 'text.secondary', fontWeight: 400 }}>
              Real-time monitoring and holistic system insights.
            </Typography>
          </Box>

          {/* Full-width Stats using Flex */}
          <Box sx={{ display: 'flex', gap: 3, mb: 4, width: '100%', flexWrap: 'wrap' }}>
            <Box sx={{ flex: 1, minWidth: '250px' }}>
              <StatCard
                title="Total Incidents"
                value={incidents.length}
                icon={<AssessmentIcon fontSize="large" />}
                color="#6366f1"
                gradient="linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)"
              />
            </Box>
            <Box sx={{ flex: 1, minWidth: '250px' }}>
              <StatCard
                title="Active Alerts"
                value={incidents.filter(i => i.status === 'active' || i.status === 'investigating').length}
                icon={<WarningAmberIcon fontSize="large" />}
                color="#ec4899"
                gradient="linear-gradient(135deg, #ec4899 0%, #be185d 100%)"
              />
            </Box>
            <Box sx={{ flex: 1, minWidth: '250px' }}>
              <StatCard
                title="Critical Issues"
                value={incidents.filter(i => i.severity === 'critical').length}
                icon={<ErrorOutlineIcon fontSize="large" />}
                color="#f59e0b"
                gradient="linear-gradient(135deg, #f59e0b 0%, #d97706 100%)"
              />
            </Box>
            <Box sx={{ flex: 1, minWidth: '250px' }}>
              <StatCard
                title="Resolved"
                value={incidents.filter(i => i.status === 'remediated' || i.status === 'closed').length}
                icon={<CheckCircleOutlineIcon fontSize="large" />}
                color="#10b981"
                gradient="linear-gradient(135deg, #10b981 0%, #059669 100%)"
              />
            </Box>
          </Box>


          <Typography variant="h6" sx={{ mb: 2, px: 2, fontWeight: 800, textTransform: 'uppercase', letterSpacing: 1, color: 'text.secondary' }}>
            Analytics Overview
          </Typography>

          {/* Full-width Charts using Flex */}
          <Box sx={{ display: 'flex', gap: 4, width: '100%', flexWrap: 'wrap' }}>
            <Box sx={{ flex: 1.4, minWidth: '400px' }}>
              <Paper sx={{ p: 3, height: 420, width: '100%', boxSizing: 'border-box', borderRadius: '24px', background: 'rgba(17, 24, 39, 0.6)', backdropFilter: 'blur(20px)' }}>
                <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 700 }}>Incidents by Severity</Typography>
                <Box sx={{ width: '100%', height: 320 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={severityData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                      <XAxis dataKey="name" stroke="#6b7280" axisLine={false} tickLine={false} />
                      <YAxis stroke="#6b7280" axisLine={false} tickLine={false} />
                      <Tooltip
                        contentStyle={{ backgroundColor: '#1f2937', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '12px', color: '#fff' }}
                        itemStyle={{ color: '#fff' }}
                      />
                      <Bar dataKey="count" fill="#6366f1" radius={[10, 10, 0, 0]} barSize={80} />
                    </BarChart>
                  </ResponsiveContainer>
                </Box>
              </Paper>
            </Box>

            <Box sx={{ flex: 1, minWidth: '400px' }}>
              <Paper sx={{ p: 3, height: 420, width: '100%', boxSizing: 'border-box', borderRadius: '24px', background: 'rgba(17, 24, 39, 0.6)', backdropFilter: 'blur(20px)' }}>
                <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 700 }}>Source Distribution</Typography>
                <Box sx={{ width: '100%', height: 320 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={sourceData}
                        cx="50%"
                        cy="50%"
                        innerRadius={80}
                        outerRadius={130}
                        paddingAngle={10}
                        dataKey="value"
                        stroke="none"
                      >
                        {sourceData.map((_, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                      </Pie>
                      <Tooltip
                        contentStyle={{ backgroundColor: '#1f2937', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '12px', color: '#fff' }}
                        itemStyle={{ color: '#fff' }}
                      />
                      <Legend
                        verticalAlign="bottom"
                        iconType="circle"
                        wrapperStyle={{ paddingTop: '20px' }}
                      />

                    </PieChart>
                  </ResponsiveContainer>
                </Box>
              </Paper>
            </Box>
          </Box>
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default App;
