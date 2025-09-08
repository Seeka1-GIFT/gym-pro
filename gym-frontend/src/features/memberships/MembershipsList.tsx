import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { createMembership, listMemberships } from './membershipsService';
import { listMembers } from '../members/membersService';
import { listPlans } from '../plans/plansService';
import Loader from '../../components/Loader';
import ErrorMsg from '../../components/ErrorMsg';
import RequireRole from '../../components/RequireRole';
import { Plus, CreditCard, Users, Package } from 'lucide-react';

const createMembershipSchema = z.object({
  memberId: z.string().min(1, 'Member is required'),
  planId: z.string().min(1, 'Plan is required'),
  startDate: z.string().min(1, 'Start date is required'),
});

type CreateMembershipForm = z.infer<typeof createMembershipSchema>;

export default function MembershipsList() {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [limit] = useState(10);

  const queryClient = useQueryClient();

  const { data: memberships, isLoading, error, refetch } = useQuery({
    queryKey: ['memberships', { page: currentPage, limit }],
    queryFn: () => listMemberships({ page: currentPage, limit }),
    staleTime: 30000,
  });

  const { data: members } = useQuery({
    queryKey: ['members'],
    queryFn: () => listMembers({ limit: 1000 }),
    staleTime: 300000,
  });

  const { data: plans } = useQuery({
    queryKey: ['plans'],
    queryFn: listPlans,
    staleTime: 300000,
  });

  const createMembershipMutation = useMutation({
    mutationFn: createMembership,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['memberships'] });
      setShowCreateForm(false);
      reset();
      alert('Membership created successfully!');
    },
  });

  const { register, handleSubmit, reset, formState: { errors } } = useForm<CreateMembershipForm>({
    resolver: zodResolver(createMembershipSchema),
  });

  const handleCreateMembership = (data: CreateMembershipForm) => {
    createMembershipMutation.mutate(data);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader size="lg" text="Loading memberships..." />
      </div>
    );
  }

  if (error) {
    const msg = (error as any)?.response?.data?.message || (error as Error)?.message || "Unknown error";
    return (
      <div className="p-6">
        <ErrorMsg title="Memberships error" message={msg} onRetry={refetch} />
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <CreditCard className="h-8 w-8 text-blue-600" />
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Memberships</h1>
          </div>
          <RequireRole roles={['ADMIN', 'RECEPTION']}>
            <button
              onClick={() => setShowCreateForm(true)}
              className="btn btn-primary flex items-center space-x-2"
            >
              <Plus className="h-4 w-4" />
              <span>Create Membership</span>
            </button>
          </RequireRole>
        </div>
      </div>

      {/* Create Membership Modal */}
      {showCreateForm && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white dark:bg-gray-800">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                Create New Membership
              </h3>
              <form onSubmit={handleSubmit(handleCreateMembership)} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Member *
                  </label>
                  <select
                    {...register('memberId')}
                    className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 dark:bg-gray-700 dark:text-white"
                  >
                    <option value="">Select a member</option>
                    {members?.items?.map((member) => (
                      <option key={member.id} value={member.id}>
                        {member.name || member.fullName} ({member.email || member.phone || 'No contact'})
                      </option>
                    ))}
                  </select>
                  {errors.memberId && (
                    <p className="mt-1 text-sm text-red-600">{errors.memberId.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Plan *
                  </label>
                  <select
                    {...register('planId')}
                    className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 dark:bg-gray-700 dark:text-white"
                  >
                    <option value="">Select a plan</option>
                    {plans?.items?.map((plan) => (
                      <option key={plan.id} value={plan.id}>
                        {plan.name} - ${plan.price} ({plan.durationDays} days)
                      </option>
                    ))}
                  </select>
                  {errors.planId && (
                    <p className="mt-1 text-sm text-red-600">{errors.planId.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Start Date *
                  </label>
                  <input
                    {...register('startDate')}
                    type="date"
                    className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 dark:bg-gray-700 dark:text-white"
                  />
                  {errors.startDate && (
                    <p className="mt-1 text-sm text-red-600">{errors.startDate.message}</p>
                  )}
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowCreateForm(false)}
                    className="btn btn-secondary"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={createMembershipMutation.isPending}
                    className="btn btn-primary"
                  >
                    {createMembershipMutation.isPending ? 'Creating...' : 'Create Membership'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Memberships List */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Member
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Plan
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Period
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {memberships?.items?.map((membership) => (
                <tr key={membership.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                          <Users className="h-5 w-5 text-blue-600 dark:text-blue-300" />
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {membership.member?.fullName || 'Unknown Member'}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          ID: {membership.memberId}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 dark:text-white">
                      {membership.plan?.name || 'Unknown Plan'}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      ${membership.plan?.price || 0}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    <div>{new Date(membership.startDate).toLocaleDateString()}</div>
                    <div className="text-gray-500 dark:text-gray-400">
                      to {membership.endDate ? new Date(membership.endDate).toLocaleDateString() : 'N/A'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      membership.status === 'ACTIVE' 
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                        : membership.status === 'EXPIRED'
                        ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
                        : 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300'
                    }`}>
                      {membership.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {memberships?.items?.length === 0 && (
        <div className="text-center py-12">
          <CreditCard className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No memberships found</h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Get started by creating a new membership.
          </p>
        </div>
      )}
    </div>
  );
}
