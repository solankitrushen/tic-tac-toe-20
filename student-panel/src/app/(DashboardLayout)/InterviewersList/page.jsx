'use client';
import React, { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import {
  Typography,
  TextField,
  Button,
  Slider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Rating,
  Box,
  Skeleton,
  Alert,
  Card,
  CardContent,
  useMediaQuery,
  IconButton,
  Stack,
  InputAdornment,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search as SearchIcon,
  Clear as ClearIcon,
  ArrowForward as ArrowForwardIcon,
  FilterList as FilterListIcon,
  CalendarMonth as CalendarIcon,
  StarRate as StarIcon,
  AttachMoney as MoneyIcon,
} from '@mui/icons-material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import { format } from 'date-fns';

// Mock data for interviewers
const MOCK_INTERVIEWERS = [
  {
    id: 'INT-001',
    name: 'Alex Johnson',
    expertise: ['Frontend', 'React', 'UI Design'],
    availability: [
      { date: '2025-04-15', startTime: '10:00', endTime: '12:00' },
      { date: '2025-04-16', startTime: '14:00', endTime: '16:00' },
    ],
    dateRange: { start: '2025-04-15', end: '2025-05-15' },
    status: 'Available',
    rating: 4.8,
    price: 75,
  },
  {
    id: 'INT-002',
    name: 'Sarah Williams',
    expertise: ['Backend', 'Node.js', 'Database Design'],
    availability: [
      { date: '2025-04-13', startTime: '13:00', endTime: '15:00' },
      { date: '2025-04-14', startTime: '09:00', endTime: '11:00' },
    ],
    dateRange: { start: '2025-04-13', end: '2025-04-30' },
    status: 'Busy',
    rating: 4.5,
    price: 85,
  },
  {
    id: 'INT-003',
    name: 'Michael Chen',
    expertise: ['System Design', 'Architecture', 'Scalability'],
    availability: [
      { date: '2025-04-15', startTime: '16:00', endTime: '18:00' },
      { date: '2025-04-17', startTime: '13:00', endTime: '15:00' },
    ],
    dateRange: { start: '2025-04-15', end: '2025-05-10' },
    status: 'Available',
    rating: 4.9,
    price: 95,
  },
  {
    id: 'INT-004',
    name: 'Jessica Roberts',
    expertise: ['Data Science', 'Machine Learning', 'Python'],
    availability: [
      { date: '2025-04-14', startTime: '11:00', endTime: '13:00' },
      { date: '2025-04-16', startTime: '15:00', endTime: '17:00' },
    ],
    dateRange: { start: '2025-04-14', end: '2025-05-20' },
    status: 'Ongoing',
    rating: 4.7,
    price: 90,
  },
  {
    id: 'INT-005',
    name: 'David Kim',
    expertise: ['DevOps', 'Cloud Infrastructure', 'AWS'],
    availability: [
      { date: '2025-04-13', startTime: '09:00', endTime: '11:00' },
      { date: '2025-04-15', startTime: '14:00', endTime: '16:00' },
    ],
    dateRange: { start: '2025-04-13', end: '2025-05-05' },
    status: 'Pending',
    rating: 4.6,
    price: 80,
  },
  {
    id: 'INT-006',
    name: 'Emily Patel',
    expertise: ['Mobile Development', 'React Native', 'Flutter'],
    availability: [
      { date: '2025-04-14', startTime: '13:00', endTime: '15:00' },
      { date: '2025-04-16', startTime: '10:00', endTime: '12:00' },
    ],
    dateRange: { start: '2025-04-14', end: '2025-05-15' },
    status: 'Available',
    rating: 4.4,
    price: 70,
  },
  {
    id: 'INT-007',
    name: 'Sam Wilson',
    expertise: ['Security', 'Penetration Testing', 'Cryptography'],
    availability: [
      { date: '2025-04-15', startTime: '11:00', endTime: '13:00' },
      { date: '2025-04-17', startTime: '15:00', endTime: '17:00' },
    ],
    dateRange: { start: '2025-04-15', end: '2025-05-10' },
    status: 'Busy',
    rating: 4.9,
    price: 100,
  },
  {
    id: 'INT-008',
    name: 'Lisa Garcia',
    expertise: ['Algorithms', 'Data Structures', 'Problem Solving'],
    availability: [
      { date: '2025-04-13', startTime: '14:00', endTime: '16:00' },
      { date: '2025-04-15', startTime: '09:00', endTime: '11:00' },
    ],
    dateRange: { start: '2025-04-13', end: '2025-04-30' },
    status: 'Available',
    rating: 5.0,
    price: 95,
  },
];

// All available expertise areas from the mock data
const ALL_EXPERTISE = [
  'Frontend',
  'React',
  'UI Design',
  'Backend',
  'Node.js',
  'Database Design',
  'System Design',
  'Architecture',
  'Scalability',
  'Data Science',
  'Machine Learning',
  'Python',
  'DevOps',
  'Cloud Infrastructure',
  'AWS',
  'Mobile Development',
  'React Native',
  'Flutter',
  'Security',
  'Penetration Testing',
  'Cryptography',
  'Algorithms',
  'Data Structures',
  'Problem Solving',
];

// Helper function to get today's date in string format
const getTodayDate = () => {
  return format(new Date(), 'MMMM d, yyyy');
};

// Status color mapping
const getStatusColor = (status) => {
  switch (status) {
    case 'Available':
      return '#4ade80';
    case 'Busy':
      return '#f87171';
    case 'Ongoing':
      return '#a78bfa';
    case 'Pending':
      return '#fcd34d';
    default:
      return '#9ca3af';
  }
};

const InterviewersListPage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const router = useRouter();

  // State variables
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedExpertise, setSelectedExpertise] = useState([]);
  const [priceRange, setPriceRange] = useState([50, 150]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [interviewers, setInterviewers] = useState([]);
  const [statusFilter, setStatusFilter] = useState('All');

  // Fetch interviewers data (simulated)
  useEffect(() => {
    const fetchData = async () => {
      try {
        await new Promise((resolve) => setTimeout(resolve, 1200));
        setInterviewers(MOCK_INTERVIEWERS);
        setLoading(false);
      } catch (err) {
        setError('Failed to load interviewers. Please try again later.');
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filter interviewers based on search, expertise, and price range
  const filteredInterviewers = useMemo(() => {
    return interviewers.filter((interviewer) => {
      const matchesSearch =
        searchQuery === '' ||
        interviewer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        interviewer.expertise.some((exp) => exp.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesExpertise =
        selectedExpertise.length === 0 ||
        interviewer.expertise.some((exp) => selectedExpertise.includes(exp));

      const matchesPrice = interviewer.price >= priceRange[0] && interviewer.price <= priceRange[1];

      const matchesStatus = statusFilter === 'All' || interviewer.status === statusFilter;

      return matchesSearch && matchesExpertise && matchesPrice && matchesStatus;
    });
  }, [interviewers, searchQuery, selectedExpertise, priceRange, statusFilter]);

  const paginatedInterviewers = filteredInterviewers.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage,
  );

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleExpertiseChange = (event) => {
    const { value } = event.target;
    setSelectedExpertise(typeof value === 'string' ? value.split(',') : value);
  };

  const handlePriceRangeChange = (event, newValue) => {
    setPriceRange(newValue);
  };

  const handleClearFilters = () => {
    setSearchQuery('');
    setSelectedExpertise([]);
    setPriceRange([50, 150]);
    setStatusFilter('All');
  };

  const renderSkeletonLoader = () => (
    <TableContainer component={Paper} elevation={2}>
      <Table className="rounded">
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Name</TableCell>
            <TableCell>Expertise</TableCell>
            <TableCell>Availability</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Rating</TableCell>
            <TableCell>Price</TableCell>
            <TableCell>Action</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {[...Array(5)].map((_, index) => (
            <TableRow key={index}>
              <TableCell>
                <Skeleton variant="text" width={60} />
              </TableCell>
              <TableCell>
                <Skeleton variant="text" width={120} />
              </TableCell>
              <TableCell>
                <Skeleton variant="text" width={150} />
              </TableCell>
              <TableCell>
                <Skeleton variant="text" width={120} />
              </TableCell>
              <TableCell>
                <Skeleton variant="text" width={80} />
              </TableCell>
              <TableCell>
                <Skeleton variant="text" width={100} />
              </TableCell>
              <TableCell>
                <Skeleton variant="text" width={60} />
              </TableCell>
              <TableCell>
                <Skeleton variant="rectangular" width={100} height={36} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );

  const renderCardSkeletonLoader = () => (
    <Stack spacing={2}>
      {[...Array(3)].map((_, index) => (
        <Card key={index} elevation={2}>
          <CardContent>
            <Skeleton variant="text" width={60} height={20} />
            <Skeleton variant="text" width={150} height={28} />
            <Skeleton variant="text" width="100%" />
            <Skeleton variant="text" width="80%" />
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
              <Skeleton variant="text" width={80} />
              <Skeleton variant="rectangular" width={100} height={36} />
            </Box>
          </CardContent>
        </Card>
      ))}
    </Stack>
  );

  const renderError = () => (
    <Alert
      severity="error"
      action={
        <Button color="inherit" size="small" onClick={() => window.location.reload()}>
          Retry
        </Button>
      }
    >
      {error}
    </Alert>
  );

  const renderEmptyState = () => (
    <Box sx={{ textAlign: 'center', py: 4 }}>
      <Typography variant="h6" color="text.secondary" gutterBottom>
        No interviewers found
      </Typography>
      <Typography variant="body2" color="text.secondary">
        Try adjusting your filters to see more results
      </Typography>
      <Button
        variant="outlined"
        startIcon={<ClearIcon />}
        onClick={handleClearFilters}
        sx={{ mt: 2 }}
      >
        Clear Filters
      </Button>
    </Box>
  );

  const renderTableView = () => (
    <AnimatePresence>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
        <TableContainer component={Paper} elevation={2}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Expertise</TableCell>
                <TableCell>Availability</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Rating</TableCell>
                <TableCell>Price</TableCell>
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedInterviewers.map((interviewer) => (
                <TableRow
                  key={interviewer.id}
                  component={motion.tr}
                  sx={{
                    '&:hover': {
                      backgroundColor: theme.palette.action.hover,
                    },
                  }}
                >
                  <TableCell
                    sx={{
                      color: theme.palette.text.secondary,
                      fontSize: '0.75rem',
                    }}
                  >
                    {interviewer.id}
                  </TableCell>
                  <TableCell sx={{ color: theme.palette.text.primary, fontWeight: 500 }}>
                    {interviewer.name}
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {interviewer.expertise.slice(0, 3).map((exp, index) => (
                        <Chip
                          key={index}
                          label={exp}
                          size="small"
                          sx={{ backgroundColor: '#4A5568', color: '#E2E8F0', fontSize: '0.75rem' }}
                        />
                      ))}
                      {interviewer.expertise.length > 3 && (
                        <Chip
                          label={`+${interviewer.expertise.length - 3}`}
                          size="small"
                          variant="outlined"
                          sx={{ color: '#E2E8F0', fontSize: '0.75rem', borderColor: '#4A5568' }}
                        />
                      )}
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ fontSize: '0.85rem', color: theme.palette.text.primary }}>
                      {interviewer.availability.slice(0, 2).map((slot, index) => (
                        <Box key={index} sx={{ mb: 0.5 }}>
                          {format(new Date(slot.date), 'MMM d')}: {slot.startTime}-{slot.endTime}
                        </Box>
                      ))}
                      {interviewer.availability.length > 2 && (
                        <Box sx={{ color: theme.palette.primary.main, fontSize: '0.75rem' }}>
                          +{interviewer.availability.length - 2} more slots
                        </Box>
                      )}
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={interviewer.status}
                      size="small"
                      sx={{
                        backgroundColor: `${getStatusColor(interviewer.status)}20`,
                        color: getStatusColor(interviewer.status),
                        fontWeight: 500,
                        '& .MuiChip-label': { px: 1 },
                        ...(interviewer.status === 'Ongoing' && {
                          animation: 'pulse 2s infinite',
                          '@keyframes pulse': {
                            '0%': { opacity: 0.7 },
                            '50%': { opacity: 1 },
                            '100%': { opacity: 0.7 },
                          },
                        }),
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Rating value={interviewer.rating} precision={0.1} readOnly size="small" />
                      <Typography variant="body2" sx={{ ml: 1, color: theme.palette.text.primary }}>
                        {interviewer.rating.toFixed(1)}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell sx={{ color: theme.palette.text.primary }}>
                    ${interviewer.price}/hr
                  </TableCell>
                  <TableCell>
                    <motion.div whileTap={{ scale: 0.95 }}>
                      <Button
                        variant="contained"
                        size="small"
                        endIcon={<ArrowForwardIcon />}
                        sx={{
                          textTransform: 'none',
                          boxShadow: 'none',
                          '&:hover': { boxShadow: 1 },
                        }}
                        disabled={interviewer.status !== 'Available'}
                        onClick={() => {
                          // Store the interviewers data in localStorage before navigating
                          localStorage.setItem('interviewers', JSON.stringify(interviewers));
                          router.push(`/InterviewersList/book/${interviewer.id}`);
                        }}
                      >
                        Book
                      </Button>
                    </motion.div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </motion.div>
    </AnimatePresence>
  );

  const renderCardView = () => (
    <AnimatePresence>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
        <Stack spacing={2}>
          {paginatedInterviewers.map((interviewer) => (
            <motion.div
              key={interviewer.id}
              whileHover={{ scale: 1.01 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              <Card elevation={2}>
                <CardContent>
                  <Typography color="text.secondary" variant="caption">
                    {interviewer.id}
                  </Typography>
                  <Box
                    sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                  >
                    <Typography
                      variant="h6"
                      component="div"
                      sx={{ fontWeight: 600, color: '#E2E8F0' }}
                    >
                      {interviewer.name}
                    </Typography>
                    <Chip
                      label={interviewer.status}
                      size="small"
                      sx={{
                        backgroundColor: `${getStatusColor(interviewer.status)}20`,
                        color: getStatusColor(interviewer.status),
                        fontWeight: 500,
                        '& .MuiChip-label': { px: 1 },
                        ...(interviewer.status === 'Ongoing' && {
                          animation: 'pulse 2s infinite',
                          '@keyframes pulse': {
                            '0%': { opacity: 0.7 },
                            '50%': { opacity: 1 },
                            '100%': { opacity: 0.7 },
                          },
                        }),
                      }}
                    />
                  </Box>

                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 1, mb: 2 }}>
                    {interviewer.expertise.slice(0, 3).map((exp, index) => (
                      <Chip key={index} label={exp} size="small" sx={{ fontSize: '0.75rem' }} />
                    ))}
                    {interviewer.expertise.length > 3 && (
                      <Chip
                        label={`+${interviewer.expertise.length - 3}`}
                        size="small"
                        variant="outlined"
                        sx={{ fontSize: '0.75rem' }}
                      />
                    )}
                  </Box>

                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      mb: 0.5,
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <CalendarIcon
                        fontSize="small"
                        sx={{ mr: 1, color: theme.palette.text.secondary }}
                      />
                      <Typography variant="body2" sx={{ color: theme.palette.text.primary }}>
                        {interviewer.availability.length > 0
                          ? `${format(new Date(interviewer.availability[0].date), 'MMM d')}: ${
                              interviewer.availability[0].startTime
                            }`
                          : 'No slots available'}
                      </Typography>
                    </Box>
                  </Box>

                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      mb: 0.5,
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <StarIcon
                        fontSize="small"
                        sx={{ mr: 1, color: theme.palette.warning.main }}
                      />
                      <Rating value={interviewer.rating} precision={0.1} readOnly size="small" />
                      <Typography variant="body2" sx={{ ml: 1, color: theme.palette.text.primary }}>
                        {interviewer.rating.toFixed(1)}
                      </Typography>
                    </Box>
                  </Box>

                  <Box
                    sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <MoneyIcon
                        fontSize="small"
                        sx={{ mr: 1, color: theme.palette.success.main }}
                      />
                      <Typography
                        variant="body2"
                        fontWeight={500}
                        sx={{ color: theme.palette.text.primary }}
                      >
                        ${interviewer.price}/hr
                      </Typography>
                    </Box>

                    <motion.div whileTap={{ scale: 0.95 }}>
                      <Button
                        variant="contained"
                        size="small"
                        endIcon={<ArrowForwardIcon />}
                        sx={{
                          textTransform: 'none',
                          boxShadow: 'none',
                          '&:hover': { boxShadow: 1 },
                        }}
                        disabled={interviewer.status !== 'Available'}
                      >
                        Book Now
                      </Button>
                    </motion.div>
                  </Box>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </Stack>
      </motion.div>
    </AnimatePresence>
  );

  // Define a dark theme
  const darkTheme = createTheme({
    palette: {
      mode: 'dark',
      background: {
        default: '#2b3447',
        paper: '#2D3748',
      },
      text: {
        primary: '#E2E8F0',
        secondary: '#A0AEC0',
      },
      action: {
        hover: '#4A5568',
      },
      primary: {
        main: '#60A5FA',
      },
      success: {
        main: '#34D399',
      },
      warning: {
        main: '#FBBF24',
      },
    },
  });

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Box sx={{ p: { xs: 2, sm: 4 }, maxWidth: 1200, mx: 'auto', backgroundColor: '#2b3447' }}>
        <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box>
            <Typography variant="h4" component="h1" fontWeight={700} color="#E2E8F0" gutterBottom>
              Interviewers List
            </Typography>
            <Typography variant="body2" color="#A0AEC0">
              {getTodayDate()} • Find qualified interviewers for your mock interview
            </Typography>
          </Box>
        </Box>

        <Paper
          elevation={2}
          sx={{
            p: 2,
            mb: 3,
            borderRadius: 2,
            backgroundColor: '#2D3748',
          }}
          component={motion.div}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <Box sx={{ mb: 2 }}>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Search by name or expertise..."
              value={searchQuery}
              onChange={handleSearchChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
                endAdornment: searchQuery && (
                  <InputAdornment position="end">
                    <IconButton size="small" onClick={() => setSearchQuery('')}>
                      <ClearIcon fontSize="small" />
                    </IconButton>
                  </InputAdornment>
                ),
                sx: { borderRadius: 2, backgroundColor: '#4A5568', color: '#E2E8F0' },
              }}
              size="small"
            />
          </Box>

          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', md: 'row' },
              gap: 2,
              alignItems: { xs: 'stretch', md: 'center' },
            }}
          >
            <FormControl size="small" sx={{ flex: 2, minWidth: { xs: '100%', md: 200 } }}>
              <InputLabel id="expertise-label" sx={{ color: '#A0AEC0' }}>
                Expertise
              </InputLabel>
              <Select
                labelId="expertise-label"
                multiple
                value={selectedExpertise}
                onChange={handleExpertiseChange}
                renderValue={(selected) => (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {selected.length === 0 ? (
                      <Typography variant="body2" color="#A0AEC0">
                        All
                      </Typography>
                    ) : (
                      selected.map((value) => (
                        <Chip
                          key={value}
                          label={value}
                          size="small"
                          sx={{ backgroundColor: '#4A5568', color: '#E2E8F0' }}
                        />
                      ))
                    )}
                  </Box>
                )}
                label="Expertise"
                sx={{ color: '#E2E8F0', '.MuiSelect-icon': { color: '#A0AEC0' } }}
              >
                {ALL_EXPERTISE.map((expertise) => (
                  <MenuItem key={expertise} value={expertise} sx={{ color: '#E2E8F0' }}>
                    {expertise}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl size="small" sx={{ flex: 1, minWidth: { xs: '100%', md: 150 } }}>
              <InputLabel id="status-label" sx={{ color: '#A0AEC0' }}>
                Status
              </InputLabel>
              <Select
                labelId="status-label"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                label="Status"
                sx={{ color: '#E2E8F0', '.MuiSelect-icon': { color: '#A0AEC0' } }}
              >
                <MenuItem value="All" sx={{ color: '#E2E8F0' }}>
                  All
                </MenuItem>
                <MenuItem value="Available" sx={{ color: '#E2E8F0' }}>
                  Available
                </MenuItem>
                <MenuItem value="Busy" sx={{ color: '#E2E8F0' }}>
                  Busy
                </MenuItem>
                <MenuItem value="Ongoing" sx={{ color: '#E2E8F0' }}>
                  Ongoing
                </MenuItem>
                <MenuItem value="Pending" sx={{ color: '#E2E8F0' }}>
                  Pending
                </MenuItem>
              </Select>
            </FormControl>

            <Box sx={{ flex: 2, px: 2 }}>
              <Typography variant="body2" color="#A0AEC0" id="price-range-slider" gutterBottom>
                Price Range: ${priceRange[0]} - ${priceRange[1]}/hr
              </Typography>
              <Slider
                value={priceRange}
                onChange={handlePriceRangeChange}
                valueLabelDisplay="auto"
                min={50}
                max={150}
                aria-labelledby="price-range-slider"
                sx={{ color: '#60A5FA' }}
              />
            </Box>

            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: { xs: 'flex-end', md: 'center' },
              }}
            >
              <Button
                variant="outlined"
                startIcon={<ClearIcon />}
                onClick={handleClearFilters}
                size="small"
                sx={{ height: 40, color: '#E2E8F0', borderColor: '#4A5568' }}
              >
                Clear Filters
              </Button>
            </Box>
          </Box>
        </Paper>

        <Box sx={{ mb: 3 }}>
          {loading
            ? isMobile
              ? renderCardSkeletonLoader()
              : renderSkeletonLoader()
            : error
            ? renderError()
            : filteredInterviewers.length === 0
            ? renderEmptyState()
            : isMobile
            ? renderCardView()
            : renderTableView()}
        </Box>

        {!loading && !error && filteredInterviewers.length > 0 && (
          <Box
            sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}
          >
            <Typography variant="body2" color="#A0AEC0">
              Showing {page * rowsPerPage + 1}-
              {Math.min((page + 1) * rowsPerPage, filteredInterviewers.length)} of{' '}
              {filteredInterviewers.length} interviewers
            </Typography>
            <TablePagination
              component="div"
              count={filteredInterviewers.length}
              page={page}
              onPageChange={handleChangePage}
              rowsPerPage={rowsPerPage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              rowsPerPageOptions={[5, 10, 25]}
              labelRowsPerPage={isMobile ? 'Rows:' : 'Rows per page:'}
              sx={{
                color: '#E2E8F0',
                '.MuiTablePagination-selectLabel': { color: '#A0AEC0' },
                '.MuiTablePagination-displayedRows': { color: '#A0AEC0' },
              }}
            />
          </Box>
        )}
      </Box>
    </ThemeProvider>
  );
};

export default InterviewersListPage;
