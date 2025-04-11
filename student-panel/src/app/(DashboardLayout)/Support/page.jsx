'use client';
import Breadcrumb from '../layout/shared/breadcrumb/Breadcrumb';
import PageContainer from '../components/container/PageContainer';
import TicketListing from '../components/tickets/TicketListing';
import TicketFilter from '../components/tickets/TicketFilter';
import ChildCard from '../components/shared/ChildCard';

const BCrumb = [
  {
    to: '/',
    title: 'Home',
  },
  {
    title: 'Tickets',
  },
];

const TicketList = () => {
  return (
    <PageContainer title="Support" description="this is Support page">
      <Breadcrumb title="Tickets" items={BCrumb} />
      <ChildCard>
        <TicketFilter />
        <TicketListing />
      </ChildCard>
    </PageContainer>
  );
};

export default TicketList;
