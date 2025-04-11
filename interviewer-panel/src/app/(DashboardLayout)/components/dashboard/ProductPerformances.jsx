'use client';
import React from 'react';
import dynamic from 'next/dynamic';
const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });
import { useTheme } from '@mui/material/styles';
import DashboardCard from '../shared/DashboardCard';
import {
  Typography,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Chip,
  TableContainer,
  Box,
} from '@mui/material';

const ProductPerformances = ({ creditUsageLog }) => {
  // chart color
  const getStatusColors = (status, theme) => {
    switch (status) {
      case 'failed':
        return { bgcolor: theme.palette.error.light, color: theme.palette.error.main };
      case 'deliverable & excellent':
        return { bgcolor: theme.palette.success.light, color: theme.palette.success.main };
      case 'undeliverable':
        return { bgcolor: theme.palette.warning.light, color: theme.palette.warning.main };
      case 'unknown':
        return { bgcolor: theme.palette.primary.light, color: theme.palette.primary.main };
      default:
        return { bgcolor: theme.palette.grey[400], color: theme.palette.common.black };
    }
  };

  const ProductChip = ({ status }) => {
    const theme = useTheme();
    const { bgcolor, color } = getStatusColors(status, theme);

    return (
      <Chip
        sx={{
          bgcolor: bgcolor,
          color: color,
          borderRadius: '6px',
          width: 150,
        }}
        size="medium"
        label={status}
      />
    );
  };

  // Map over the creditUsageLog.searched_data array
  const products =
    creditUsageLog?.searched_data?.map((data) => ({
      id: data.id,
      email: data.result.result.inbound,
      date: new Date(data.created_at).toLocaleDateString(),
      status: data.result.result.validations.safe_to_send,
    })) || [];

  return (
    <DashboardCard title="Past Entries">
      <TableContainer>
        {products.length > 0 ? (
          <Table
            aria-label="Past Entries"
            sx={{
              whiteSpace: 'nowrap',
            }}
          >
            <TableHead>
              <TableRow>
                <TableCell sx={{ pl: 0 }}>
                  <Typography variant="subtitle2" fontWeight={600}>
                    Email
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="subtitle2" fontWeight={600}>
                    Date
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="subtitle2" fontWeight={600}>
                    Status
                  </Typography>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {products.map((product) => (
                <TableRow key={product.id}>
                  <TableCell sx={{ pl: 0 }}>
                    <Typography variant="subtitle2" fontWeight={600}>
                      {product.email}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="subtitle2" fontWeight={600}>
                      {product.date}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <ProductChip key={product.id} status={product.status} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <Table
            aria-label="Past Entries"
            sx={{
              whiteSpace: 'nowrap',
            }}
          >
            <TableHead>
              <TableRow>
                <TableCell sx={{ pl: 0 }}>
                  <Typography variant="subtitle2" fontWeight={600}>
                    Email
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="subtitle2" fontWeight={600}>
                    Date
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="subtitle2" fontWeight={600}>
                    Status
                  </Typography>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell colSpan={3}>
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      height: '100px', // Adjust height as needed
                    }}
                  >
                    <Typography variant="h5" color="textSecondary" align="center">
                      No entries available
                    </Typography>
                  </Box>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        )}
      </TableContainer>
    </DashboardCard>
  );
};

export default ProductPerformances;
