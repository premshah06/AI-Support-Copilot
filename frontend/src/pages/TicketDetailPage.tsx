import { useParams } from 'react-router-dom';
import TicketDetail from '../components/TicketDetail';
import { DashboardLayout, PageTransition } from '../components/layouts';

const TicketDetailPage = () => {
  const { ticketId } = useParams<{ ticketId: string }>();

  if (!ticketId) {
    return (
      <DashboardLayout>
        <PageTransition>
          <div className="text-center">
            <p className="text-error">Ticket ID is missing.</p>
          </div>
        </PageTransition>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <PageTransition>
        <TicketDetail ticketId={Number(ticketId)} />
      </PageTransition>
    </DashboardLayout>
  );
};

export default TicketDetailPage;
