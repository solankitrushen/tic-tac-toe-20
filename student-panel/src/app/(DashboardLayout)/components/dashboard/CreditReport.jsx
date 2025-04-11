import dynamic from 'next/dynamic';
import * as React from 'react';
import { useTheme } from '@mui/material/styles';
import dayjs from 'dayjs';
import 'dayjs/locale/en-in'; // Import Indian locale for dayjs

import { Box, MenuItem, Select, FormControl, InputLabel } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { MobileDatePicker } from '@mui/x-date-pickers/MobileDatePicker';
import CustomTextField from '../forms/theme-elements/CustomTextField';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFnsV3';
import isBetween from 'dayjs/plugin/isBetween'; // Import the plugin
import DashboardCard from '../shared/DashboardCard';
import utc from 'dayjs/plugin/utc'; // Required by the timezone plugin
import timezone from 'dayjs/plugin/timezone';
import axios from 'axios';
import Cookies from 'js-cookie';

dayjs.extend(utc); // Make sure to extend UTC
dayjs.extend(timezone);
dayjs.extend(isBetween); // Extend dayjs with the isBetween plugin
const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

const CreditReport = () => {
  const theme = useTheme();
  const primary = theme.palette.primary.main;
  const [filter, setFilter] = React.useState('today');
  const [period, setPeriod] = React.useState('year');
  const [startDate, setStartDate] = React.useState(dayjs().startOf('month').format('YYYY-MM-DD'));
  const [endDate, setEndDate] = React.useState(dayjs().endOf('month').format('YYYY-MM-DD'));
  const [chartData, setChartData] = React.useState({
    categories: [],
    seriesData: [],
  });

  const aggregateCredits = (data, period) => {
    const aggregatedData = {};

    data.forEach((item) => {
      const date = dayjs(item.created_at);
      let key;

      if (period === 'year') {
        key = date.format('YYYY'); // Use year as key
      } else if (period === 'month') {
        key = date.format('MM-YYYY'); // Use year-month as key
      } else if (period === 'today') {
        key = date.format('DD-MM-YYYY'); // Use year-month as key
      } else if (period === 'yesterday') {
        key = date.format('DD-MM-YYYY'); // Use year-month as key
      }

      if (!aggregatedData[key]) {
        aggregatedData[key] = 0;
      }

      aggregatedData[key] += item.used_credits; // Sum used credits
    });

    return aggregatedData;
  };

  // Fetch data from API based on filter
  const fetchData = async () => {
    try {
      const token = Cookies.get('access');
      const response = await axios.get(
        `/subscribe/credit-usage-logs?period=${period}&startDate=${startDate}&endDate=${endDate}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const data = response.data.searched_data;
      const aggregatedData = aggregateCredits(data, filter);

      const categories = Object.keys(aggregatedData);
      const seriesData = Object.values(aggregatedData);

      setChartData({ categories, seriesData });
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  // Fetch data whenever the filter or date range changes
  React.useEffect(() => {
    fetchData();
  }, [filter, startDate, endDate]);

  // Chart options
  const optionsgredientchart = {
    chart: {
      height: 350,
      type: 'line',
      fontFamily: "'Plus Jakarta Sans', sans-serif",
      foreColor: '#adb0bb',
      toolbar: { show: false },
    },
    stroke: { width: 7, curve: 'smooth' },
    xaxis: {
      type: 'category', // Use category for x-axis to match year/month
      categories: chartData.categories,
      labels: { rotate: -45, trim: true },
    },
    fill: {
      type: 'gradient',
      gradient: {
        shade: 'dark',
        gradientToColors: [primary],
        shadeIntensity: 1,
        type: 'horizontal',
        opacityFrom: 1,
        opacityTo: 0.9,
        stops: [0, 100],
      },
    },
    markers: { size: 4, opacity: 0.9, colors: [primary], strokeColor: '#fff', strokeWidth: 2 },
    yaxis: { min: 0, max: Math.max(...chartData.seriesData, 50) }, // Dynamically set max
    tooltip: { theme: 'dark' },
    grid: { show: false },
  };

  // Series data
  const seriesgredientchart = [
    {
      name: 'Credit Used',
      data: chartData.seriesData,
    },
  ];

  // Handle filter change
  const handleFilterChange = (event) => {
    const now = dayjs();
    setFilter(event.target.value);

    // Set start and end dates based on the selected filter
    if (event.target.value === 'today') {
      setStartDate(now.format('YYYY-MM-DD'));
      setEndDate(now.format('YYYY-MM-DD'));
    } else if (event.target.value === 'yesterday') {
      setStartDate(now.subtract(1, 'day').format('YYYY-MM-DD'));
      setEndDate(now.subtract(1, 'day').format('YYYY-MM-DD'));
    } else if (event.target.value === 'month') {
      setPeriod(event.target.value);
      setStartDate(now.startOf('month').format('YYYY-MM-DD'));
      setEndDate(now.endOf('month').format('YYYY-MM-DD'));
    } else if (event.target.value === 'year') {
      setPeriod(event.target.value);
      setStartDate(now.startOf('year').format('YYYY-MM-DD'));
      setEndDate(now.endOf('year').format('YYYY-MM-DD'));
    } else {
      // For 'custom', keep existing dates
    }
  };

  return (
    <DashboardCard
      title="Credit Usage Report"
      action={
        <FormControl sx={{ minWidth: 150 }}>
          <InputLabel id="filter-select-label">Filter</InputLabel>
          <Select
            labelId="filter-select-label"
            value={filter}
            onChange={handleFilterChange}
            label="Filter"
          >
            <MenuItem value="year">Yearly</MenuItem>
            <MenuItem value="month">Monthly</MenuItem>
            <MenuItem value="custom">Custom</MenuItem>
            <MenuItem value="today">Today</MenuItem>
            <MenuItem value="yesterday">Yesterday</MenuItem>
          </Select>

          {filter === 'custom' && (
            <Box sx={{ mt: 2, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <MobileDatePicker
                  label="Start Date"
                  views={['year', 'month', 'day']}
                  value={startDate}
                  onChange={(newValue) => setStartDate(dayjs(newValue).format('YYYY-MM-DD'))}
                  renderInput={(inputProps) => (
                    <CustomTextField fullWidth {...inputProps} variant="outlined" />
                  )}
                />
                <MobileDatePicker
                  label="End Date"
                  views={['year', 'month', 'day']}
                  value={endDate}
                  onChange={(newValue) => setEndDate(dayjs(newValue).format('YYYY-MM-DD'))}
                  renderInput={(inputProps) => (
                    <CustomTextField fullWidth {...inputProps} variant="outlined" />
                  )}
                />
              </LocalizationProvider>
            </Box>
          )}
        </FormControl>
      }
    >
      <Chart options={optionsgredientchart} series={seriesgredientchart} type="line" height={350} />
    </DashboardCard>
  );
};

export default CreditReport;
