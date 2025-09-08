import React from 'react';
import PageHeader from '../../components/PageHeader';

/**
 * Reports page placeholder - no network calls to avoid errors
 */
export default function Reports() {
  return (
    <div>
      <PageHeader title="Reports" />
      <div className="flex flex-col items-center justify-center gap-3 py-16">
        <div className="text-2xl font-semibold">Reports Coming Soon</div>
        <p className="text-slate-500">This feature is under development.</p>
      </div>
    </div>
  );
}