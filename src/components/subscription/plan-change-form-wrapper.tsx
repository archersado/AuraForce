'use client';

import { PlanChangeForm } from './plan-change-form';

export default function PlanChangeFormWrapper() {
  return (
    <PlanChangeForm
      onSuccess={() => {
        window.location.reload();
      }}
    />
  );
}
