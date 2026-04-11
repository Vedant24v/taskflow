export const USERS = [
  {
    id: 'u1',
    name: 'Arjun Sharma',
    role: 'Frontend Dev',
    color: '#4f8ef7',
    initials: 'AS',
  },
  {
    id: 'u2',
    name: 'Priya Nair',
    role: 'Backend Dev',
    color: '#a78bfa',
    initials: 'PN',
  },
  {
    id: 'u3',
    name: 'Rahul Mehta',
    role: 'Designer',
    color: '#34d399',
    initials: 'RM',
  },
  {
    id: 'u4',
    name: 'Sneha Patel',
    role: 'QA Engineer',
    color: '#fbbf24',
    initials: 'SP',
  },
  {
    id: 'u5',
    name: 'Dev Kapoor',
    role: 'DevOps',
    color: '#f87171',
    initials: 'DK',
  },
]

export const COLUMNS = [
  { id: 'not_started', label: 'Not Started', color: '#64748b', accent: 'rgba(100,116,139,0.15)' },
  { id: 'in_progress', label: 'In Progress', color: '#4f8ef7', accent: 'rgba(79,142,247,0.15)' },
  { id: 'completed',   label: 'Completed',  color: '#34d399', accent: 'rgba(52,211,153,0.15)' },
]

export const PRIORITIES = [
  { id: 'low',    label: 'Low',    color: '#64748b' },
  { id: 'medium', label: 'Medium', color: '#fbbf24' },
  { id: 'high',   label: 'High',   color: '#f87171' },
]

// Generate a date relative to today
const d = (offsetDays) => {
  const date = new Date()
  date.setDate(date.getDate() + offsetDays)
  return date.toISOString().split('T')[0]
}

export const INITIAL_TASKS = [
  {
    id: 'task-1',
    title: 'Redesign landing page hero section',
    description: 'Update typography, hero imagery, and CTA button styles to match new brand guidelines.',
    assigneeId: 'u3',
    status: 'not_started',
    priority: 'high',
    deadline: d(3),
    createdAt: new Date().toISOString(),
    tag: 'Design',
  },
  {
    id: 'task-2',
    title: 'Integrate Razorpay payment gateway',
    description: 'Add payment flow for subscription plans including webhook handling and error states.',
    assigneeId: 'u2',
    status: 'not_started',
    priority: 'high',
    deadline: d(5),
    createdAt: new Date().toISOString(),
    tag: 'Backend',
  },
  {
    id: 'task-3',
    title: 'Build reusable component library',
    description: 'Create Button, Input, Modal, and Toast components with Storybook documentation.',
    assigneeId: 'u1',
    status: 'in_progress',
    priority: 'medium',
    deadline: d(7),
    createdAt: new Date().toISOString(),
    tag: 'Frontend',
  },
  {
    id: 'task-4',
    title: 'Set up CI/CD pipeline on GitHub Actions',
    description: 'Automate build, test, and deployment workflows for staging and production environments.',
    assigneeId: 'u5',
    status: 'in_progress',
    priority: 'high',
    deadline: d(2),
    createdAt: new Date().toISOString(),
    tag: 'DevOps',
  },
  {
    id: 'task-5',
    title: 'Write E2E tests for checkout flow',
    description: 'Cover happy path, payment failure, and edge cases using Playwright.',
    assigneeId: 'u4',
    status: 'in_progress',
    priority: 'medium',
    deadline: d(10),
    createdAt: new Date().toISOString(),
    tag: 'QA',
  },
  {
    id: 'task-6',
    title: 'Migrate database to PostgreSQL',
    description: 'Schema migration from MongoDB, data backfill, and connection pooling setup.',
    assigneeId: 'u2',
    status: 'completed',
    priority: 'high',
    deadline: d(-2),
    createdAt: new Date().toISOString(),
    tag: 'Backend',
  },
  {
    id: 'task-7',
    title: 'Set up Sentry error monitoring',
    description: 'Integrate Sentry SDK, configure alert rules and source maps for production.',
    assigneeId: 'u5',
    status: 'completed',
    priority: 'low',
    deadline: d(-5),
    createdAt: new Date().toISOString(),
    tag: 'DevOps',
  },
  {
    id: 'task-8',
    title: 'Audit accessibility (WCAG 2.1)',
    description: 'Run axe-core audit, fix color contrast issues and keyboard navigation gaps.',
    assigneeId: 'u4',
    status: 'not_started',
    priority: 'medium',
    deadline: d(14),
    createdAt: new Date().toISOString(),
    tag: 'QA',
  },
]
