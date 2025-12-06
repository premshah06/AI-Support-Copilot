import { useState, useEffect, useCallback, lazy, Suspense } from 'react';
import { useSearchParams } from 'react-router-dom';
import TicketList from '../components/TicketList';
import { DashboardLayout, PageTransition } from '../components/layouts';
import { TicketMetrics } from '../components/organisms/TicketMetrics';
import { TicketFilters } from '../components/organisms/TicketFilters';
import { FilterState } from '../types';
import { Skeleton } from '../components/atoms/Skeleton';

// Lazy load chart components (they include heavy recharts library)
const PriorityBreakdownChart = lazy(() => import('../components/organisms/PriorityBreakdownChart').then(m => ({ default: m.PriorityBreakdownChart })));
const TicketVolumeTrendChart = lazy(() => import('../components/organisms/TicketVolumeTrendChart').then(m => ({ default: m.TicketVolumeTrendChart })));

const TicketsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  
  // Initialize filters from URL params
  const [filters, setFilters] = useState<FilterState>(() => {
    const statusParam = searchParams.get('status');
    const priorityParam = searchParams.get('priority');
    const categoryParam = searchParams.get('category');
    const searchParam = searchParams.get('search');

    return {
      status: statusParam ? statusParam.split(',') : [],
      priority: priorityParam ? priorityParam.split(',') : [],
      category: categoryParam ? categoryParam.split(',') : [],
      searchQuery: searchParam || '',
    };
  });

  // Update URL params when filters change
  useEffect(() => {
    const params = new URLSearchParams();
    
    if (filters.status.length > 0) {
      params.set('status', filters.status.join(','));
    }
    if (filters.priority.length > 0) {
      params.set('priority', filters.priority.join(','));
    }
    if (filters.category.length > 0) {
      params.set('category', filters.category.join(','));
    }
    if (filters.searchQuery) {
      params.set('search', filters.searchQuery);
    }

    // Only update if params actually changed
    const currentParams = searchParams.toString();
    const newParams = params.toString();
    
    if (currentParams !== newParams) {
      setSearchParams(params, { replace: true });
    }
  }, [filters.status, filters.priority, filters.category, filters.searchQuery, searchParams, setSearchParams]);

  const handleFilterChange = useCallback((newFilters: FilterState) => {
    setFilters(newFilters);
  }, []);

  const handleClearAll = useCallback(() => {
    setFilters({
      status: [],
      priority: [],
      category: [],
      searchQuery: '',
    });
  }, []);

  return (
    <DashboardLayout>
      <PageTransition>
        {/* Header Section */}
        <header className="mb-4 sm:mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Tickets</h1>
          <p className="mt-1 text-xs sm:text-sm text-muted-foreground">
            Monitor and manage support tickets with AI assistance
          </p>
        </header>

        {/* Metrics Section */}
        <section className="mb-4 sm:mb-6" aria-label="Ticket metrics">
          <TicketMetrics />
        </section>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-4 sm:gap-6 transition-layout">
          {/* Left Column - Filters */}
          <aside className="xl:col-span-3 stable-layout" aria-label="Ticket filters">
            <TicketFilters
              filters={filters}
              onFilterChange={handleFilterChange}
              onClearAll={handleClearAll}
            />
          </aside>

          {/* Right Column - Main Content */}
          <main className="xl:col-span-9 space-y-4 sm:space-y-6 stable-layout">
            {/* Charts Section */}
            <section className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 transition-layout" aria-label="Ticket analytics">
              <Suspense fallback={<Skeleton height={350} className="rounded-xl" />}>
                <PriorityBreakdownChart />
              </Suspense>
              <Suspense fallback={<Skeleton height={350} className="rounded-xl" />}>
                <TicketVolumeTrendChart />
              </Suspense>
            </section>

            {/* Tickets Section */}
            <section aria-label="Ticket list">
              <TicketList filters={filters} />
            </section>
          </main>
        </div>
      </PageTransition>
    </DashboardLayout>
  );
};

export default TicketsPage;
