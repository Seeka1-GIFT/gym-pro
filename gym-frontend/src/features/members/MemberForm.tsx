import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createMember } from './membersService';
import { listPlans } from '../plans/plansService';

const schema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(7),
  planId: z.string().min(1)
});

type Values = z.infer<typeof schema>;

/**
 * Form for creating a new member. On success invalidates list and closes via onDone.
 */
export default function MemberForm({ onDone }: { onDone: () => void }) {
  const plans = useQuery({ queryKey: ['plans'], queryFn: async () => (await listPlans()).items });
  const qc = useQueryClient();
  const create = useMutation({
    mutationFn: (v: Values) =>
      createMember({ ...v }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['members'] });
      onDone();
    }
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<Values>({ resolver: zodResolver(schema) });

  return (
    <form onSubmit={handleSubmit((v) => create.mutate(v))} className="space-y-3">
      <div>
        <label className="mb-1 block text-sm">Name</label>
        <input className="input" {...register('name')} />
        {errors.name && <p className="mt-1 text-xs text-red-600">{errors.name.message}</p>}
      </div>
      <div>
        <label className="mb-1 block text-sm">Email</label>
        <input className="input" type="email" {...register('email')} />
        {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email.message}</p>}
      </div>
      <div>
        <label className="mb-1 block text-sm">Phone</label>
        <input className="input" {...register('phone')} />
        {errors.phone && <p className="mt-1 text-xs text-red-600">{errors.phone.message}</p>}
      </div>
      <div>
        <label className="mb-1 block text-sm">Plan</label>
        <select className="input" {...register('planId')}>
          <option value="">Select a plan…</option>
          {plans.data?.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name} — ${p.price}
            </option>
          ))}
        </select>
        {errors.planId && <p className="mt-1 text-xs text-red-600">{errors.planId.message}</p>}
      </div>
      <div className="pt-2">
        <button className="btn" disabled={isSubmitting}>
          Save
        </button>
      </div>
    </form>
  );
}