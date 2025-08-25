export type Priority = 'High' | 'Medium' | 'Low' | null;
export type RepeatType = 'daily' | 'weekly' | 'monthly' | 'none';
export type TimeEstimate = '2-5 min' | '5-10 min' | '10+ min';
export type CategoryName = 'Read' | 'Write' | 'Speak' | 'Learn' | 'Pray' | 'Break' | 'Build';

export interface Task {
  id: string;
  title: string;
  category: CategoryName | null;
  tags: string[];
  priority: Priority;
  completed: boolean;
  repeat: RepeatType;
  time_estimate: TimeEstimate;
  created_at: string;
  due_date?: string;
  completed_at?: string;
  // Recurring task fields
  is_recurring?: boolean;
  is_template?: boolean;
  template_id?: string;
  start_date?: string;
  end_date?: string;
  frequency?: RepeatType;
}

export interface Category {
  name: CategoryName;
  icon: string;
  color: string;
}

export type FilterType = 'all' | 'uncategorized' | 'categorized' | 'planned' | 'unplanned';
export type ViewType = 'backlog' | 'planning' | 'today' | 'progress';