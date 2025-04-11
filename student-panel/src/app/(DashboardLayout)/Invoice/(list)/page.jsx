'use client';

import React from 'react';
import Breadcrumb from '@/app/(DashboardLayout)/layout/shared/breadcrumb/Breadcrumb';
import PageContainer from '@/app/(DashboardLayout)/components/container/PageContainer';
import InvoiceList from '@/app/(DashboardLayout)/components/invoice/Invoice-list/index';
import { InvoiceProvider } from '@/app/context/InvoiceContext/index';
import BlankCard from '@/app/(DashboardLayout)/components/shared/BlankCard';
import { CardContent } from '@mui/material';

const BCrumb = [
  {
    to: '/',
    title: 'Home',
  },
  {
    title: 'Invoice',
  },
];

const InvoiceListing = () => {
  return (
    <InvoiceProvider>
      <PageContainer title="Invoice" description="this is Invoice List">
        <Breadcrumb title="Invoice" items={BCrumb} />
        <BlankCard>
          <CardContent>
            <InvoiceList />
          </CardContent>
        </BlankCard>
      </PageContainer>
    </InvoiceProvider>
  );
};
export default InvoiceListing;
