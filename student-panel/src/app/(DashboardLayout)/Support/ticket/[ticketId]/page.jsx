'use client';
import Breadcrumb from '@/app/(DashboardLayout)/layout/shared/breadcrumb/Breadcrumb';
import PageContainer from '@/app/(DashboardLayout)/components/container/PageContainer';
import AppCard from '@/app/(DashboardLayout)/components/shared/AppCard';
import ChatsApp from '@/app/(DashboardLayout)/components/chats/index';

import { useParams } from 'next/navigation';
const Ticket = () => {
  const { ticketId } = useParams();
  console.log(ticketId);
  return (
    <PageContainer title="Ticket" description="this is Ticket">
      {/* <Breadcrumb title="Chat app" subtitle="Messenger" /> */}
      <AppCard>
        <ChatsApp ticketId={ticketId} />
      </AppCard>
    </PageContainer>
  );
};

export default Ticket;
