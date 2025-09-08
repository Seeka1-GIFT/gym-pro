import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { listMembers } from './membersService';
import PageHeader from '../../components/PageHeader';

/**
 * Displays simple member details.
 */
export default function MemberDetail() {
  const { id } = useParams();
  const members = useQuery({ queryKey: ['members'], queryFn: () => listMembers({ page: 1, limit: 1000 }) });
  const member = members.data?.items.find((m) => m.id === id);
  if (!member) return <div className="mt-10 text-center text-slate-500">Member not found.</div>;
  return (
    <div>
      <PageHeader title={member.name} />
      <div className="card">Email: {member.email} — Phone: {member.phone}</div>
    </div>
  );
}