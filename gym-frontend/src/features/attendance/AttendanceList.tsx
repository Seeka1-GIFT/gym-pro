import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { listAttendance, checkIn, checkOut } from './attendanceService';
import { listMembers } from '../members/membersService';
import Loader from '../../components/Loader';
import ErrorMsg from '../../components/ErrorMsg';
import { Clock, LogIn, LogOut, Users } from 'lucide-react';

const checkInSchema = z.object({
  memberId: z.string().min(1, 'Member is required'),
});

const checkOutSchema = z.object({
  attendanceId: z.string().min(1, 'Attendance ID is required'),
});

type CheckInForm = z.infer<typeof checkInSchema>;
type CheckOutForm = z.infer<typeof checkOutSchema>;

export default function AttendanceList() {
  const [showCheckInForm, setShowCheckInForm] = useState(false);
  const [showCheckOutForm, setShowCheckOutForm] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [limit] = useState(10);

  const queryClient = useQueryClient();

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['attendance', { page: currentPage, limit }],
    queryFn: () => listAttendance({ page: currentPage, limit }),
    staleTime: 30000,
  });

  const { data: members } = useQuery({
    queryKey: ['members'],
    queryFn: () => listMembers({ limit: 1000 }),
    staleTime: 300000,
  });

  const checkInMutation = useMutation({
    mutationFn: checkIn,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['attendance'] });
      setShowCheckInForm(false);
      resetCheckIn();
      alert('Check-in successful!');
    },
  });

  const checkOutMutation = useMutation({
    mutationFn: checkOut,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['attendance'] });
      setShowCheckOutForm(false);
      resetCheckOut();
      alert('Check-out successful!');
    },
  });

  const { register: registerCheckIn, handleSubmit: handleSubmitCheckIn, reset: resetCheckIn, formState: { errors: checkInErrors } } = useForm<CheckInForm>({
    resolver: zodResolver(checkInSchema),
  });

  const { register: registerCheckOut, handleSubmit: handleSubmitCheckOut, reset: resetCheckOut, formState: { errors: checkOutErrors } } = useForm<CheckOutForm>({
    resolver: zodResolver(checkOutSchema),
  });

  const handleCheckIn = (data: CheckInForm) => {
    checkInMutation.mutate(data.memberId);
  };

  const handleCheckOut = (data: CheckOutForm) => {
    checkOutMutation.mutate(data.attendanceId);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader size="lg" text="Loading attendance..." />
      </div>
    );
  }

  if (error) {
    const msg = (error as any)?.response?.data?.message || (error as Error)?.message || "Unknown error";
    return (
      <div className="p-6">
        <ErrorMsg title="Attendance error" message={msg} onRetry={refetch} />
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Clock className="h-8 w-8 text-blue-600" />
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Attendance</h1>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => setShowCheckInForm(true)}
              className="btn btn-primary flex items-center space-x-2"
            >
              <LogIn className="h-4 w-4" />
              <span>Check In</span>
            </button>
            <button
              onClick={() => setShowCheckOutForm(true)}
              className="btn btn-secondary flex items-center space-x-2"
            >
              <LogOut className="h-4 w-4" />
              <span>Check Out</span>
            </button>
          </div>
        </div>
      </div>

      {/* Check In Modal */}
      {showCheckInForm && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white dark:bg-gray-800">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                Check In Member
              </h3>
              <form onSubmit={handleSubmitCheckIn(handleCheckIn)} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Member *
                  </label>
                  <select
                    {...registerCheckIn('memberId')}
                    className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 dark:bg-gray-700 dark:text-white"
                  >
                    <option value="">Select a member</option>
                    {members?.items?.map((member) => (
                      <option key={member.id} value={member.id}>
                        {member.name || member.fullName} ({member.email || member.phone || 'No contact'})
                      </option>
                    ))}
                  </select>
                  {checkInErrors.memberId && (
                    <p className="mt-1 text-sm text-red-600">{checkInErrors.memberId.message}</p>
                  )}
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowCheckInForm(false)}
                    className="btn btn-secondary"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={checkInMutation.isPending}
                    className="btn btn-primary"
                  >
                    {checkInMutation.isPending ? 'Checking In...' : 'Check In'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Check Out Modal */}
      {showCheckOutForm && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white dark:bg-gray-800">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                Check Out Member
              </h3>
              <form onSubmit={handleSubmitCheckOut(handleCheckOut)} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Attendance ID *
                  </label>
                  <input
                    {...registerCheckOut('attendanceId')}
                    className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 dark:bg-gray-700 dark:text-white"
                    placeholder="Enter attendance ID"
                  />
                  {checkOutErrors.attendanceId && (
                    <p className="mt-1 text-sm text-red-600">{checkOutErrors.attendanceId.message}</p>
                  )}
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowCheckOutForm(false)}
                    className="btn btn-secondary"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={checkOutMutation.isPending}
                    className="btn btn-primary"
                  >
                    {checkOutMutation.isPending ? 'Checking Out...' : 'Check Out'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Attendance List */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Member
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Check In
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Check Out
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Source
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {data?.items?.map((attendance) => (
                <tr key={attendance.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                          <Users className="h-5 w-5 text-blue-600 dark:text-blue-300" />
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {attendance.member?.fullName || 'Unknown Member'}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          ID: {attendance.memberId}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {new Date(attendance.checkInTime).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {attendance.checkOutTime ? new Date(attendance.checkOutTime).toLocaleString() : 'Still in'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      attendance.source === 'MANUAL' 
                        ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
                        : attendance.source === 'QR_CODE'
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                        : 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300'
                    }`}>
                      {attendance.source}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {data?.items?.length === 0 && (
        <div className="text-center py-12">
          <Clock className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No attendance records found</h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Check in members to see attendance records.
          </p>
        </div>
      )}
    </div>
  );
}