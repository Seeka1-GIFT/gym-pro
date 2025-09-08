import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../lib/api';
import Loader from '../components/Loader';
import ErrorMsg from '../components/ErrorMsg';
import { useAuth } from '../features/auth/AuthContext';
import { Plus, Package, DollarSign, Calendar, Users } from 'lucide-react';

interface Plan {
  id: string;
  name: string;
  description?: string;
  price: number;
  duration: number; // in months
  features: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface CreatePlanRequest {
  name: string;
  description?: string;
  price: number;
  duration: number;
  features: string[];
}

const Plans: React.FC = () => {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newPlan, setNewPlan] = useState<CreatePlanRequest>({
    name: '',
    description: '',
    price: 0,
    duration: 1,
    features: [],
  });
  const [newFeature, setNewFeature] = useState('');

  const { hasPermission } = useAuth();
  const queryClient = useQueryClient();

  const { data: plans, isLoading, error } = useQuery<Plan[]>({
    queryKey: ['plans'],
    queryFn: async () => {
      const response = await api.get('/api/plans');
      return response.data;
    },
    staleTime: 30000,
  });

  const createPlanMutation = useMutation({
    mutationFn: async (planData: CreatePlanRequest) => {
      const response = await api.post('/api/plans', planData);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['plans'] });
      setShowCreateForm(false);
      setNewPlan({
        name: '',
        description: '',
        price: 0,
        duration: 1,
        features: [],
      });
    },
  });

  const handleCreatePlan = (e: React.FormEvent) => {
    e.preventDefault();
    createPlanMutation.mutate(newPlan);
  };

  const addFeature = () => {
    if (newFeature.trim()) {
      setNewPlan(prev => ({
        ...prev,
        features: [...prev.features, newFeature.trim()]
      }));
      setNewFeature('');
    }
  };

  const removeFeature = (index: number) => {
    setNewPlan(prev => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index)
    }));
  };

  const isAdmin = hasPermission('manage_plans');

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader size="lg" text="Loading plans..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <ErrorMsg message="Failed to load plans. Please try again." />
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Package className="h-8 w-8 text-blue-600" />
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Membership Plans</h1>
          </div>
          {isAdmin && (
            <button
              onClick={() => setShowCreateForm(true)}
              className="btn btn-primary flex items-center space-x-2"
            >
              <Plus className="h-4 w-4" />
              <span>Create Plan</span>
            </button>
          )}
        </div>
      </div>

      {/* Create Plan Modal */}
      {showCreateForm && isAdmin && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white dark:bg-gray-800">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                Create New Plan
              </h3>
              <form onSubmit={handleCreatePlan} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Plan Name
                  </label>
                  <input
                    type="text"
                    required
                    value={newPlan.name}
                    onChange={(e) => setNewPlan(prev => ({ ...prev, name: e.target.value }))}
                    className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 dark:bg-gray-700 dark:text-white"
                    placeholder="e.g., Basic Plan"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Description
                  </label>
                  <textarea
                    value={newPlan.description}
                    onChange={(e) => setNewPlan(prev => ({ ...prev, description: e.target.value }))}
                    className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 dark:bg-gray-700 dark:text-white"
                    rows={3}
                    placeholder="Plan description..."
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Price ($)
                    </label>
                    <input
                      type="number"
                      required
                      min="0"
                      step="0.01"
                      value={newPlan.price}
                      onChange={(e) => setNewPlan(prev => ({ ...prev, price: parseFloat(e.target.value) || 0 }))}
                      className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Duration (months)
                    </label>
                    <input
                      type="number"
                      required
                      min="1"
                      value={newPlan.duration}
                      onChange={(e) => setNewPlan(prev => ({ ...prev, duration: parseInt(e.target.value) || 1 }))}
                      className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Features
                  </label>
                  <div className="mt-1 flex space-x-2">
                    <input
                      type="text"
                      value={newFeature}
                      onChange={(e) => setNewFeature(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addFeature())}
                      className="flex-1 border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 dark:bg-gray-700 dark:text-white"
                      placeholder="Add a feature..."
                    />
                    <button
                      type="button"
                      onClick={addFeature}
                      className="btn btn-secondary"
                    >
                      Add
                    </button>
                  </div>
                  <div className="mt-2 space-y-1">
                    {newPlan.features.map((feature, index) => (
                      <div key={index} className="flex items-center justify-between bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded">
                        <span className="text-sm text-gray-700 dark:text-gray-300">{feature}</span>
                        <button
                          type="button"
                          onClick={() => removeFeature(index)}
                          className="text-red-500 hover:text-red-700"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
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
                    disabled={createPlanMutation.isPending}
                    className="btn btn-primary"
                  >
                    {createPlanMutation.isPending ? 'Creating...' : 'Create Plan'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Plans Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {plans?.map((plan) => (
          <div
            key={plan.id}
            className={`bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border-2 ${
              plan.isActive ? 'border-blue-200 dark:border-blue-700' : 'border-gray-200 dark:border-gray-700'
            }`}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                {plan.name}
              </h3>
              <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                plan.isActive 
                  ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                  : 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300'
              }`}>
                {plan.isActive ? 'Active' : 'Inactive'}
              </span>
            </div>

            {plan.description && (
              <p className="text-gray-600 dark:text-gray-400 mb-4 text-sm">
                {plan.description}
              </p>
            )}

            <div className="mb-4">
              <div className="flex items-center space-x-2 mb-2">
                <DollarSign className="h-4 w-4 text-green-600" />
                <span className="text-2xl font-bold text-gray-900 dark:text-white">
                  ${plan.price}
                </span>
                <span className="text-gray-500 dark:text-gray-400">/month</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                <Calendar className="h-4 w-4" />
                <span>{plan.duration} month{plan.duration > 1 ? 's' : ''}</span>
              </div>
            </div>

            <div className="mb-6">
              <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                Features:
              </h4>
              <ul className="space-y-1">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                    <span className="w-1.5 h-1.5 bg-blue-600 rounded-full mr-2"></span>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>

            <div className="text-xs text-gray-500 dark:text-gray-400">
              Created: {new Date(plan.createdAt).toLocaleDateString()}
            </div>
          </div>
        ))}
      </div>

      {plans?.length === 0 && (
        <div className="text-center py-12">
          <Package className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No plans found</h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Get started by creating a new membership plan.
          </p>
        </div>
      )}
    </div>
  );
};

export default Plans;
