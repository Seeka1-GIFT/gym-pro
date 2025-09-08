import { addDays, subDays } from 'date-fns';

// Data models used by the mock server
export type Plan = {
  id: string;
  name: 'Monthly' | 'Quarterly' | 'Yearly' | string;
  price: number;
  benefits: string[];
};
export type Member = {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: 'active' | 'inactive';
  planId: string;
  startDate: string;
  endDate?: string;
  avatarUrl?: string;
};
export type Payment = {
  id: string;
  memberId: string;
  amount: number;
  date: string;
  method: 'cash' | 'card' | 'mobile';
  status: 'paid' | 'unpaid';
};
export type Attendance = {
  id: string;
  memberId: string;
  date: string;
  type: 'check-in' | 'check-out';
};
export type GymClass = {
  id: string;
  name: string;
  coach: string;
  room: string;
  capacity: number;
  start: string;
  end: string;
  members: string[];
};
export type Asset = {
  id: string;
  name: string;
  category: string;
  condition: 'new' | 'good' | 'maintenance' | 'broken';
  purchaseDate: string;
  warrantyMonths?: number;
};

// simple id generator
const id = () => crypto.randomUUID();

export const db = {
  plans: [] as Plan[],
  members: [] as Member[],
  payments: [] as Payment[],
  attendance: [] as Attendance[],
  classes: [] as GymClass[],
  assets: [] as Asset[]
};

// seed plans
db.plans.push(
  { id: id(), name: 'Monthly', price: 25, benefits: ['Gym access', '1 class/week'] },
  { id: id(), name: 'Quarterly', price: 65, benefits: ['Gym access', '2 classes/week'] },
  { id: id(), name: 'Yearly', price: 240, benefits: ['All access', 'Unlimited classes'] },
  { id: id(), name: 'Student Monthly', price: 15, benefits: ['Gym access', 'Student discount'] }
);

// seed members, payments, attendance
const names = ['Ali Ahmed', 'Hodan Yusuf', 'Khalid Noor', 'Amina Farah', 'Yahye Osman', 'Fadumo Mohamed', 'Abdiwali Jama', 'Maryan Abdullahi', 'Sagal Barre', 'Ahmed Warsame'];
for (let i = 0; i < names.length; i++) {
  const plan = db.plans[i % db.plans.length];
  const start = subDays(new Date(), 30 + i * 5);
  const m: Member = {
    id: id(),
    name: names[i],
    email: `${names[i].split(' ')[0].toLowerCase()}@example.com`,
    phone: '+25261' + String(1000000 + i),
    status: i % 4 === 0 ? 'inactive' : 'active',
    planId: plan.id,
    startDate: start.toISOString()
  };
  db.members.push(m);
  // one payment
  db.payments.push({
    id: id(),
    memberId: m.id,
    amount: plan.price,
    date: subDays(new Date(), 5 + i).toISOString(),
    method: 'mobile',
    status: 'paid'
  });
  // attendance record
  db.attendance.push({
    id: id(),
    memberId: m.id,
    date: addDays(new Date(), -i).toISOString(),
    type: 'check-in'
  });
}

// seed classes
const base = new Date();
for (let d = 0; d < 5; d++) {
  db.classes.push({
    id: id(),
    name: `HIIT ${d + 1}`,
    coach: ['Ahmed', 'Leyla', 'Mo'][d % 3],
    room: ['A', 'B', 'C'][d % 3],
    capacity: 20,
    start: addDays(base, d).toISOString(),
    end: addDays(base, d).toISOString(),
    members: db.members.slice(d, d + 5).map((m) => m.id)
  });
}

// seed assets
['Treadmill', 'Bike', 'Rowing Machine', 'Bench Press', 'Kettlebell Set'].forEach((name, i) => {
  db.assets.push({
    id: id(),
    name,
    category: i % 2 ? 'Cardio' : 'Strength',
    condition: 'good',
    purchaseDate: subDays(new Date(), 200 + i * 15).toISOString(),
    warrantyMonths: 24
  });
});