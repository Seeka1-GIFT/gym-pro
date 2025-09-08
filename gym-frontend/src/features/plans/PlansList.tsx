import { useQuery } from '@tanstack/react-query';
import PageHeader from '../../components/PageHeader';
import DataTable, { Column } from '../../components/DataTable';
import ErrorMsg from '../../components/ErrorMsg';
import { listPlans, Plan } from './plansService';

/**
 * Plans listing page.
 */
export default function PlansList() {
  const { data, isLoading, error, refetch } = useQuery({ 
    queryKey: ['plans'], 
    queryFn: listPlans 
  });
  
  if (error) {
    const msg = (error as any)?.response?.data?.message || (error as Error)?.message || "Unknown error";
    return (
      <div className="p-6">
        <ErrorMsg title="Plans error" message={msg} onRetry={refetch} />
      </div>
    );
  }

  const columns: Column<Plan>[] = [
    { key: 'name', header: 'Name', sortable: true },
    {
      key: 'price',
      header: 'Price',
      sortable: true,
      render: (r) => `$${r.price}`
    },
    {
      key: 'durationDays',
      header: 'Duration (Days)',
      sortable: true,
      render: (r) => r.durationDays.toString()
    }
  ];
  
  return (
    <div>
      <PageHeader title="Plans" />
      {isLoading ? <div className="skeleton h-24 w-full" /> : <DataTable data={data?.items ?? []} columns={columns} />}
    </div>
  );
}