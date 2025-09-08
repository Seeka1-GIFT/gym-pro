import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { listExpenses, createExpense, updateExpense, deleteExpense } from './expensesService';
import Loader from '../../components/Loader';
import ErrorMsg from '../../components/ErrorMsg';
import RequireRole from '../../components/RequireRole';
import { Plus, Edit, Trash2, Receipt } from 'lucide-react';

const createExpenseSchema = z.object({
  category: z.string().min(1, 'Category is required'),
  amount: z.number().min(0.01, 'Amount must be greater than 0'),
  note: z.string().optional(),
  spentAt: z.string().min(1, 'Date is required'),
});

const updateExpenseSchema = createExpenseSchema.partial();

type CreateExpenseForm = z.infer<typeof createExpenseSchema>;
type UpdateExpenseForm = z.infer<typeof updateExpenseSchema>;

export default function ExpensesList() {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [editingExpense, setEditingExpense] = useState<any>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [limit] = useState(10);

  const queryClient = useQueryClient();

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['expenses', { page: currentPage, limit }],
    queryFn: () => listExpenses({ page: currentPage, limit }),
    staleTime: 30000,
  });

  const createExpenseMutation = useMutation({
    mutationFn: createExpense,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['expenses'] });
      setShowCreateForm(false);
      resetCreate();
    },
  });

  const updateExpenseMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => updateExpense(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['expenses'] });
      setShowEditForm(false);
      setEditingExpense(null);
      resetEdit();
    },
  });

  const deleteExpenseMutation = useMutation({
    mutationFn: deleteExpense,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['expenses'] });
    },
  });

  const { register: registerCreate, handleSubmit: handleSubmitCreate, reset: resetCreate, formState: { errors: createErrors } } = useForm<CreateExpenseForm>({
    resolver: zodResolver(createExpenseSchema),
  });

  const { register: registerEdit, handleSubmit: handleSubmitEdit, reset: resetEdit, formState: { errors: editErrors } } = useForm<UpdateExpenseForm>({
    resolver: zodResolver(updateExpenseSchema),
  });

  const handleCreateExpense = (data: CreateExpenseForm) => {
    createExpenseMutation.mutate(data);
  };

  const handleEditExpense = (data: UpdateExpenseForm) => {
    if (editingExpense) {
      updateExpenseMutation.mutate({ id: editingExpense.id, data });
    }
  };

  const handleDeleteExpense = (id: string) => {
    if (window.confirm('Are you sure you want to delete this expense?')) {
      deleteExpenseMutation.mutate(id);
    }
  };

  const openEditForm = (expense: any) => {
    setEditingExpense(expense);
    resetEdit(expense);
    setShowEditForm(true);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader size="lg" text="Loading expenses..." />
      </div>
    );
  }

  if (error) {
    const msg = (error as any)?.response?.data?.message || (error as Error)?.message || "Unknown error";
    return (
      <div className="p-6">
        <ErrorMsg title="Expenses error" message={msg} onRetry={refetch} />
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Receipt className="h-8 w-8 text-blue-600" />
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Expenses</h1>
          </div>
          <RequireRole roles={['ADMIN']}>
            <button
              onClick={() => setShowCreateForm(true)}
              className="btn btn-primary flex items-center space-x-2"
            >
              <Plus className="h-4 w-4" />
              <span>Add Expense</span>
            </button>
          </RequireRole>
        </div>
      </div>

      {/* Create Expense Modal */}
      {showCreateForm && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white dark:bg-gray-800">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                Add New Expense
              </h3>
              <form onSubmit={handleSubmitCreate(handleCreateExpense)} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Category *
                  </label>
                  <input
                    {...registerCreate('category')}
                    className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 dark:bg-gray-700 dark:text-white"
                    placeholder="e.g., Equipment, Utilities, Maintenance"
                  />
                  {createErrors.category && (
                    <p className="mt-1 text-sm text-red-600">{createErrors.category.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Amount *
                  </label>
                  <input
                    {...registerCreate('amount', { valueAsNumber: true })}
                    type="number"
                    step="0.01"
                    min="0.01"
                    className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 dark:bg-gray-700 dark:text-white"
                    placeholder="0.00"
                  />
                  {createErrors.amount && (
                    <p className="mt-1 text-sm text-red-600">{createErrors.amount.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Note
                  </label>
                  <textarea
                    {...registerCreate('note')}
                    className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 dark:bg-gray-700 dark:text-white"
                    rows={3}
                    placeholder="Additional details..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Date *
                  </label>
                  <input
                    {...registerCreate('spentAt')}
                    type="date"
                    className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 dark:bg-gray-700 dark:text-white"
                  />
                  {createErrors.spentAt && (
                    <p className="mt-1 text-sm text-red-600">{createErrors.spentAt.message}</p>
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
                    disabled={createExpenseMutation.isPending}
                    className="btn btn-primary"
                  >
                    {createExpenseMutation.isPending ? 'Adding...' : 'Add Expense'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Edit Expense Modal */}
      {showEditForm && editingExpense && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white dark:bg-gray-800">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                Edit Expense
              </h3>
              <form onSubmit={handleSubmitEdit(handleEditExpense)} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Category *
                  </label>
                  <input
                    {...registerEdit('category')}
                    className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 dark:bg-gray-700 dark:text-white"
                    placeholder="e.g., Equipment, Utilities, Maintenance"
                  />
                  {editErrors.category && (
                    <p className="mt-1 text-sm text-red-600">{editErrors.category.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Amount *
                  </label>
                  <input
                    {...registerEdit('amount', { valueAsNumber: true })}
                    type="number"
                    step="0.01"
                    min="0.01"
                    className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 dark:bg-gray-700 dark:text-white"
                    placeholder="0.00"
                  />
                  {editErrors.amount && (
                    <p className="mt-1 text-sm text-red-600">{editErrors.amount.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Note
                  </label>
                  <textarea
                    {...registerEdit('note')}
                    className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 dark:bg-gray-700 dark:text-white"
                    rows={3}
                    placeholder="Additional details..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Date *
                  </label>
                  <input
                    {...registerEdit('spentAt')}
                    type="date"
                    className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 dark:bg-gray-700 dark:text-white"
                  />
                  {editErrors.spentAt && (
                    <p className="mt-1 text-sm text-red-600">{editErrors.spentAt.message}</p>
                  )}
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowEditForm(false)}
                    className="btn btn-secondary"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={updateExpenseMutation.isPending}
                    className="btn btn-primary"
                  >
                    {updateExpenseMutation.isPending ? 'Updating...' : 'Update Expense'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Expenses List */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Note
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {data?.items?.map((expense) => (
                <tr key={expense.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className="h-10 w-10 rounded-full bg-red-100 dark:bg-red-900 flex items-center justify-center">
                          <Receipt className="h-5 w-5 text-red-600 dark:text-red-300" />
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {expense.category}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    ${expense.amount.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {expense.note || 'No note'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {expense.spentAt ? new Date(expense.spentAt).toLocaleDateString() : 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <RequireRole roles={['ADMIN']}>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => openEditForm(expense)}
                          className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteExpense(expense.id)}
                          className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </RequireRole>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {data?.items?.length === 0 && (
        <div className="text-center py-12">
          <Receipt className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No expenses found</h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Add an expense to get started.
          </p>
        </div>
      )}
    </div>
  );
}
