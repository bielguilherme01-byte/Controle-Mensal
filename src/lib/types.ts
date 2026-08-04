export type PriorityKey = 'essential' | 'important' | 'optional';

export type RecurrenceKey =
  | 'none'
  | 'monthly'
  | 'bimonthly'
  | 'quarterly'
  | 'semiannual'
  | 'annual';

export type StatusKey = 'pending' | 'paid';

export type CategoryKey =
  | 'moradia'
  | 'veiculo'
  | 'alimentacao'
  | 'saude'
  | 'academia'
  | 'streaming'
  | 'assinaturas'
  | 'trabalho'
  | 'lazer'
  | 'outros';

export type Expense = {
  id: string;
  name: string;
  amount: number;
  category: CategoryKey;
  priority: PriorityKey;
  dueDay: number;
  recurrence: RecurrenceKey;
  note?: string;
  status: StatusKey;
  createdAt: number;
};

export type ExpenseDraft = {
  name: string;
  amount: number;
  category: CategoryKey;
  priority: PriorityKey;
  dueDay: number;
  recurrence: RecurrenceKey;
  note?: string;
};
