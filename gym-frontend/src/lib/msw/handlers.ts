import { http, HttpResponse } from 'msw';
import { db } from './seed';

// helper to wrap JSON responses
const ok = <T extends Record<string, unknown> | unknown[]>(data: T, init?: number | ResponseInit) =>
  HttpResponse.json(data as any, typeof init === 'number' ? { status: init } : init);

export const handlers = [
  // Members
  http.get('/api/members', () => ok(db.members)),
  http.post('/api/members', async ({ request }) => {
    const body = await request.json();
    const m = { id: crypto.randomUUID(), name: 'Member', email: '', phone: '', planId: '', startDate: new Date().toISOString(), status: 'active', ...(body as Record<string, unknown>) } as any;
    db.members.push(m);
    return ok(m, 201);
  }),
  http.put('/api/members/:id', async ({ params, request }) => {
    const body = await request.json();
    const i = db.members.findIndex((m) => m.id === params.id);
    if (i === -1) return ok({ message: 'Not found' }, 404);
    db.members[i] = { ...db.members[i], ...(body as Record<string, unknown>) } as any;
    return ok(db.members[i]);
  }),
  http.delete('/api/members/:id', ({ params }) => {
    const i = db.members.findIndex((m) => m.id === params.id);
    if (i === -1) return ok({ message: 'Not found' }, 404);
    const removed = db.members.splice(i, 1)[0];
    return ok(removed);
  }),

  // Plans
  http.get('/api/plans', () => ok(db.plans)),

  // Payments
  http.get('/api/payments', () => ok(db.payments)),
  http.post('/api/payments', async ({ request }) => {
    const p = { id: crypto.randomUUID(), ...(await request.json() as Record<string, unknown>) } as any;
    db.payments.push(p);
    return ok(p, 201);
  }),

  // Attendance
  http.get('/api/attendance', () => ok(db.attendance)),
  http.post('/api/attendance/check-in', async ({ request }) => {
    const body = await request.json();
    const a = { id: crypto.randomUUID(), ...(body as Record<string, unknown>), type: 'check-in' as const } as any;
    db.attendance.push(a);
    return ok(a, 201);
  }),

  // Classes
  http.get('/api/classes', () => ok(db.classes)),

  // Assets
  http.get('/api/assets', () => ok(db.assets))
];