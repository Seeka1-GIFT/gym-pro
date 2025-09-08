import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { listAssets, createAsset, updateAsset, deleteAsset } from './assetsService';
import Loader from '../../components/Loader';
import ErrorMsg from '../../components/ErrorMsg';
import RequireRole from '../../components/RequireRole';
import { Plus, Edit, Trash2, Package } from 'lucide-react';

const createAssetSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  category: z.string().min(1, 'Category is required'),
  serialNo: z.string().optional(),
  cost: z.number().min(0, 'Cost must be 0 or greater'),
  condition: z.enum(['EXCELLENT', 'GOOD', 'FAIR', 'POOR', 'BROKEN']),
  location: z.string().optional(),
  purchaseDate: z.string().optional(),
});

const updateAssetSchema = createAssetSchema.partial();

type CreateAssetForm = z.infer<typeof createAssetSchema>;
type UpdateAssetForm = z.infer<typeof updateAssetSchema>;

export default function AssetsList() {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [editingAsset, setEditingAsset] = useState<any>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [limit] = useState(10);

  const queryClient = useQueryClient();

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['assets', { page: currentPage, limit }],
    queryFn: () => listAssets({ page: currentPage, limit }),
    staleTime: 30000,
  });

  const createAssetMutation = useMutation({
    mutationFn: createAsset,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['assets'] });
      setShowCreateForm(false);
      resetCreate();
    },
  });

  const updateAssetMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => updateAsset(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['assets'] });
      setShowEditForm(false);
      setEditingAsset(null);
      resetEdit();
    },
  });

  const deleteAssetMutation = useMutation({
    mutationFn: deleteAsset,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['assets'] });
    },
  });

  const { register: registerCreate, handleSubmit: handleSubmitCreate, reset: resetCreate, formState: { errors: createErrors } } = useForm<CreateAssetForm>({
    resolver: zodResolver(createAssetSchema),
  });

  const { register: registerEdit, handleSubmit: handleSubmitEdit, reset: resetEdit, formState: { errors: editErrors } } = useForm<UpdateAssetForm>({
    resolver: zodResolver(updateAssetSchema),
  });

  const handleCreateAsset = (data: CreateAssetForm) => {
    createAssetMutation.mutate(data);
  };

  const handleEditAsset = (data: UpdateAssetForm) => {
    if (editingAsset) {
      updateAssetMutation.mutate({ id: editingAsset.id, data });
    }
  };

  const handleDeleteAsset = (id: string) => {
    if (window.confirm('Are you sure you want to delete this asset?')) {
      deleteAssetMutation.mutate(id);
    }
  };

  const openEditForm = (asset: any) => {
    setEditingAsset(asset);
    resetEdit(asset);
    setShowEditForm(true);
  };

  const getConditionColor = (condition: string) => {
    switch (condition) {
      case 'EXCELLENT':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'GOOD':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'FAIR':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'POOR':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300';
      case 'BROKEN':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader size="lg" text="Loading assets..." />
      </div>
    );
  }

  if (error) {
    const msg = (error as any)?.response?.data?.message || (error as Error)?.message || "Unknown error";
    return (
      <div className="p-6">
        <ErrorMsg title="Assets error" message={msg} onRetry={refetch} />
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Package className="h-8 w-8 text-blue-600" />
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Assets</h1>
          </div>
          <RequireRole roles={['ADMIN']}>
            <button
              onClick={() => setShowCreateForm(true)}
              className="btn btn-primary flex items-center space-x-2"
            >
              <Plus className="h-4 w-4" />
              <span>Add Asset</span>
            </button>
          </RequireRole>
        </div>
      </div>

      {/* Create Asset Modal */}
      {showCreateForm && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white dark:bg-gray-800">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                Add New Asset
              </h3>
              <form onSubmit={handleSubmitCreate(handleCreateAsset)} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Name *
                  </label>
                  <input
                    {...registerCreate('name')}
                    className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 dark:bg-gray-700 dark:text-white"
                    placeholder="e.g., Treadmill Model X"
                  />
                  {createErrors.name && (
                    <p className="mt-1 text-sm text-red-600">{createErrors.name.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Category *
                  </label>
                  <input
                    {...registerCreate('category')}
                    className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 dark:bg-gray-700 dark:text-white"
                    placeholder="e.g., Cardio Equipment, Weights"
                  />
                  {createErrors.category && (
                    <p className="mt-1 text-sm text-red-600">{createErrors.category.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Serial Number
                  </label>
                  <input
                    {...registerCreate('serialNo')}
                    className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 dark:bg-gray-700 dark:text-white"
                    placeholder="Serial number"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Cost *
                  </label>
                  <input
                    {...registerCreate('cost', { valueAsNumber: true })}
                    type="number"
                    step="0.01"
                    min="0"
                    className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 dark:bg-gray-700 dark:text-white"
                    placeholder="0.00"
                  />
                  {createErrors.cost && (
                    <p className="mt-1 text-sm text-red-600">{createErrors.cost.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Condition *
                  </label>
                  <select
                    {...registerCreate('condition')}
                    className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 dark:bg-gray-700 dark:text-white"
                  >
                    <option value="">Select condition</option>
                    <option value="EXCELLENT">Excellent</option>
                    <option value="GOOD">Good</option>
                    <option value="FAIR">Fair</option>
                    <option value="POOR">Poor</option>
                    <option value="BROKEN">Broken</option>
                  </select>
                  {createErrors.condition && (
                    <p className="mt-1 text-sm text-red-600">{createErrors.condition.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Location
                  </label>
                  <input
                    {...registerCreate('location')}
                    className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 dark:bg-gray-700 dark:text-white"
                    placeholder="e.g., Main Floor, Room 101"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Purchase Date
                  </label>
                  <input
                    {...registerCreate('purchaseDate')}
                    type="date"
                    className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 dark:bg-gray-700 dark:text-white"
                  />
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
                    disabled={createAssetMutation.isPending}
                    className="btn btn-primary"
                  >
                    {createAssetMutation.isPending ? 'Adding...' : 'Add Asset'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Edit Asset Modal */}
      {showEditForm && editingAsset && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white dark:bg-gray-800">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                Edit Asset
              </h3>
              <form onSubmit={handleSubmitEdit(handleEditAsset)} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Name *
                  </label>
                  <input
                    {...registerEdit('name')}
                    className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 dark:bg-gray-700 dark:text-white"
                    placeholder="e.g., Treadmill Model X"
                  />
                  {editErrors.name && (
                    <p className="mt-1 text-sm text-red-600">{editErrors.name.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Category *
                  </label>
                  <input
                    {...registerEdit('category')}
                    className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 dark:bg-gray-700 dark:text-white"
                    placeholder="e.g., Cardio Equipment, Weights"
                  />
                  {editErrors.category && (
                    <p className="mt-1 text-sm text-red-600">{editErrors.category.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Serial Number
                  </label>
                  <input
                    {...registerEdit('serialNo')}
                    className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 dark:bg-gray-700 dark:text-white"
                    placeholder="Serial number"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Cost *
                  </label>
                  <input
                    {...registerEdit('cost', { valueAsNumber: true })}
                    type="number"
                    step="0.01"
                    min="0"
                    className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 dark:bg-gray-700 dark:text-white"
                    placeholder="0.00"
                  />
                  {editErrors.cost && (
                    <p className="mt-1 text-sm text-red-600">{editErrors.cost.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Condition *
                  </label>
                  <select
                    {...registerEdit('condition')}
                    className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 dark:bg-gray-700 dark:text-white"
                  >
                    <option value="">Select condition</option>
                    <option value="EXCELLENT">Excellent</option>
                    <option value="GOOD">Good</option>
                    <option value="FAIR">Fair</option>
                    <option value="POOR">Poor</option>
                    <option value="BROKEN">Broken</option>
                  </select>
                  {editErrors.condition && (
                    <p className="mt-1 text-sm text-red-600">{editErrors.condition.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Location
                  </label>
                  <input
                    {...registerEdit('location')}
                    className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 dark:bg-gray-700 dark:text-white"
                    placeholder="e.g., Main Floor, Room 101"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Purchase Date
                  </label>
                  <input
                    {...registerEdit('purchaseDate')}
                    type="date"
                    className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 dark:bg-gray-700 dark:text-white"
                  />
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
                    disabled={updateAssetMutation.isPending}
                    className="btn btn-primary"
                  >
                    {updateAssetMutation.isPending ? 'Updating...' : 'Update Asset'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Assets List */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Asset
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Cost
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Condition
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Location
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {data?.items?.map((asset) => (
                <tr key={asset.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                          <Package className="h-5 w-5 text-blue-600 dark:text-blue-300" />
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {asset.name}
                        </div>
                        {asset.serialNo && (
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            SN: {asset.serialNo}
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {asset.category}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    ${asset.cost ? asset.cost.toFixed(2) : '0.00'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getConditionColor(asset.condition ?? 'GOOD')}`}>
                      {asset.condition}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {asset.location || 'Not specified'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <RequireRole roles={['ADMIN']}>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => openEditForm(asset)}
                          className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteAsset(asset.id)}
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
          <Package className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No assets found</h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Add an asset to get started.
          </p>
        </div>
      )}
    </div>
  );
}