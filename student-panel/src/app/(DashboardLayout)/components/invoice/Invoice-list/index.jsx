'use client';
import React, { useContext, useEffect, useState } from 'react';
import { InvoiceContext } from '@/app/context/InvoiceContext/index';
import {
  Table,
  TextField,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Badge,
  Tooltip,
  IconButton,
  Tabs,
  Tab,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Box,
  Typography,
  Grid,
  Stack,
  InputAdornment,
  Chip,
} from '@mui/material';
import Link from 'next/link';
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';
import DeleteIcon from '@mui/icons-material/Delete';
import moment from 'moment-timezone';

import {
  IconEdit,
  IconEye,
  IconListDetails,
  IconSearch,
  IconShoppingBag,
  IconSortAscending,
  IconTrash,
  IconTruck,
} from '@tabler/icons-react';
import CustomCheckbox from '@/app/(DashboardLayout)/components/forms/theme-elements/CustomCheckbox';
import axios from 'axios';

function InvoiceList() {
  const { invoices, deleteInvoice } = useContext(InvoiceContext);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('All');
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

  const tabItem = ['All', 'Succeed', 'Canceled', 'Pending'];
  const [currentIndex, setCurrentIndex] = useState(0);

  // Handle status filter change
  const handleClick = (status) => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % tabItem.length);
    setActiveTab(status);
  };

  // Filter invoices based on search term
  const filteredInvoices = invoices.filter((invoice) => {
    // return (
    //   (invoice.Subscription.toLowerCase().includes(searchTerm.toLowerCase()) ||
    //     invoice.Subscription.toLowerCase().includes(searchTerm.toLowerCase())) &&
    //   (activeTab === 'All' || invoice.status === activeTab)
    // );
    return invoice;
  });

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  // Calculate the counts for different statuses
  const Succeed = invoices.filter((t) => t.payment_status === 'paid').length;

  const Expired = invoices.filter((t) => {
    const currentTime = Math.floor(Date.now() / 1000); // Get current timestamp in seconds
    return t.subscriptionEndDate < currentTime;
  }).length;

  // Toggle all checkboxes
  const toggleSelectAll = () => {
    const selectAllValue = !selectAll;
    setSelectAll(selectAllValue);
    if (selectAllValue) {
      setSelectedProducts(invoices.map((invoice) => invoice.id));
    } else {
      setSelectedProducts([]);
    }
  };

  // Toggle individual product selection
  const toggleSelectProduct = (productId) => {
    const index = selectedProducts.indexOf(productId);
    if (index === -1) {
      setSelectedProducts([...selectedProducts, productId]);
    } else {
      setSelectedProducts(selectedProducts.filter((id) => id !== productId));
    }
  };

  // Handle opening delete confirmation dialog
  const handleDelete = () => {
    setOpenDeleteDialog(true);
  };

  // Handle confirming deletion of selected products
  const handleConfirmDelete = async () => {
    for (const productId of selectedProducts) {
      await deleteInvoice(productId);
    }
    setSelectedProducts([]);
    setSelectAll(false);
    setOpenDeleteDialog(false);
  };

  // Handle closing delete confirmation dialog
  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
  };

  return (
    <Box>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} lg={4}>
          <Box
            backgroundColor="primary.light"
            p={3}
            onClick={() => handleClick('All')}
            sx={{ cursor: 'pointer' }}
          >
            <Stack direction="row" gap={2} alignItems="center">
              <Box
                width={38}
                height={38}
                bgcolor="primary.main"
                display="flex"
                alignItems="center"
                justifyContent="center"
              >
                <Typography
                  color="primary.contrastText"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                >
                  <IconListDetails width={22} />
                </Typography>
              </Box>
              <Box>
                <Typography>Total</Typography>
                <Typography fontWeight={500}>{invoices.length} Invoices</Typography>
              </Box>
            </Stack>
          </Box>
        </Grid>
        <Grid item xs={12} sm={6} lg={4}>
          <Box
            backgroundColor="secondary.light"
            p={3}
            onClick={() => handleClick('Succeed')}
            sx={{ cursor: 'pointer' }}
          >
            <Stack direction="row" gap={2} alignItems="center">
              <Box
                width={38}
                height={38}
                bgcolor="secondary.main"
                display="flex"
                alignItems="center"
                justifyContent="center"
              >
                <Typography
                  color="primary.contrastText"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                >
                  <IconShoppingBag width={22} />
                </Typography>
              </Box>
              <Box>
                <Typography>Paid</Typography>
                <Typography fontWeight={500}>{Succeed} Invoices</Typography>
              </Box>
            </Stack>
          </Box>
        </Grid>
        <Grid item xs={12} sm={6} lg={4}>
          <Box
            backgroundColor="success.light"
            p={3}
            onClick={() => handleClick('Canceled')}
            sx={{ cursor: 'pointer' }}
          >
            <Stack direction="row" gap={2} alignItems="center">
              <Box
                width={38}
                height={38}
                bgcolor="success.main"
                display="flex"
                alignItems="center"
                justifyContent="center"
              >
                <Typography
                  color="primary.contrastText"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                >
                  <IconTruck width={22} />
                </Typography>
              </Box>
              <Box>
                <Typography>Expired</Typography>
                <Typography fontWeight={500}>{Expired} Invoices</Typography>
              </Box>
            </Stack>
          </Box>
        </Grid>
      </Grid>

      <Stack
        mt={3}
        justifyContent="space-between"
        direction={{ xs: 'column', sm: 'row' }}
        spacing={{ xs: 1, sm: 2, md: 4 }}
      >
        <TextField
          id="search"
          type="text"
          size="small"
          variant="outlined"
          placeholder="Search"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconSearch size={'16'} />
              </InputAdornment>
            ),
          }}
        />
        {/* <Box display="flex" gap={1}>
          {selectAll && (
            <Button
              variant="outlined"
              color="error"
              onClick={handleDelete}
              startIcon={<IconTrash width={18} />}
            >
              Delete All
            </Button>
          )}
        </Box> */}
      </Stack>
      <Box sx={{ overflowX: 'auto' }}>
        <Table sx={{ whiteSpace: { xs: 'nowrap', md: 'unset' } }}>
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox">
                <CustomCheckbox checked={selectAll} onChange={toggleSelectAll} />
              </TableCell>
              <TableCell>
                <Typography variant="h6" fontSize="14px">
                  Id
                </Typography>
              </TableCell>
              {/* <TableCell>
                <Typography variant="h6" fontSize="14px">
                  Subscription
                </Typography>
              </TableCell> */}

              <TableCell>
                <Typography variant="h6" fontSize="14px">
                  Total Cost
                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant="h6" fontSize="14px">
                  Start Date
                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant="h6" fontSize="14px">
                  End Date
                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant="h6" fontSize="14px">
                  Status
                </Typography>
              </TableCell>
              <TableCell align="center">
                <Typography variant="h6" fontSize="14px">
                  Action
                </Typography>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredInvoices.map((invoice) => (
              <TableRow key={invoice.id}>
                <TableCell padding="checkbox">
                  <CustomCheckbox
                    checked={selectedProducts.includes(invoice.id)}
                    onChange={() => toggleSelectProduct(invoice.id)}
                  />
                </TableCell>
                <TableCell>
                  <Typography variant="h6" fontSize="14px">
                    {invoice._id}
                  </Typography>
                </TableCell>
                {/* <TableCell>
                  <Typography variant="h6" fontSize="14px">
                    {invoice.Subscription}
                  </Typography>
                </TableCell> */}
                <TableCell>
                  <Typography fontSize="14px">
                    $ {invoice.price ? (invoice.price / 100).toFixed(2) : '0.00'}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography fontSize="14px">
                    {moment
                      .unix(invoice.subscriptionStartDate)
                      .tz('Asia/Kolkata')
                      .format('MMMM D, YYYY')}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography fontSize="14px">
                    {' '}
                    {moment
                      .unix(invoice.subscriptionEndDate)
                      .tz('Asia/Kolkata')
                      .format('MMMM D, YYYY')}
                  </Typography>
                </TableCell>
                <TableCell>
                  {invoice.payment_status === 'paid' ? (
                    <Chip color="primary" label={invoice.payment_status} size="small" />
                  ) : invoice.payment_status === 'expired' ||
                    invoice.subscriptionEndDate < Math.floor(Date.now() / 1000) ? (
                    <Chip color="error" label="expired" size="small" />
                  ) : (
                    ''
                  )}
                </TableCell>
                <TableCell align="center">
                  <Tooltip title="View Invoice">
                    <IconButton
                      color="primary"
                      component={Link}
                      target="_blank"
                      href={invoice.invoiceUrl}
                    >
                      <IconEye width={22} />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Box>
      <Dialog open={openDeleteDialog} onClose={handleCloseDeleteDialog}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>Are you sure you want to delete selected invoices?</DialogContent>
        <DialogActions>
          <Button variant="contained" onClick={handleCloseDeleteDialog}>
            Cancel
          </Button>
          <Button color="error" variant="outlined" onClick={handleConfirmDelete}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
export default InvoiceList;
