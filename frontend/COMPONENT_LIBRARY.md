# Component Library Documentation

This document provides an overview of the design system components used in the AI Incident Support Copilot application.

## Table of Contents

- [Atomic Components](#atomic-components)
  - [Button](#button)
  - [Badge](#badge)
  - [Avatar](#avatar)
  - [Input](#input)
  - [Select](#select)
  - [Checkbox](#checkbox)
  - [Radio](#radio)
  - [Switch](#switch)
  - [Label](#label)
  - [Spinner](#spinner)
  - [Skeleton](#skeleton)
  - [Tooltip](#tooltip)
- [Molecular Components](#molecular-components)
  - [Card](#card)
  - [StatCard](#statcard)
  - [SearchBar](#searchbar)
  - [FilterChip](#filterchip)
  - [PriorityBadge](#prioritybadge)
  - [StatusBadge](#statusbadge)
  - [CategoryBadge](#categorybadge)
  - [Dialog](#dialog)
  - [Tabs](#tabs)
- [Organism Components](#organism-components)
  - [TicketCard](#ticketcard)
  - [TicketFilters](#ticketfilters)
  - [TicketMetrics](#ticketmetrics)
  - [AISuggestionPanel](#aisuggestionpanel)
  - [CustomerInfoCard](#customerinfocard)
  - [ActionTimeline](#actiontimeline)
  - [ReplyEditor](#replyeditor)
- [Layout Components](#layout-components)
  - [DashboardLayout](#dashboardlayout)
  - [DashboardHeader](#dashboardheader)

---

## Atomic Components

### Button

A versatile button component with multiple variants, sizes, and states.

**Props:**
- `variant`: 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive' (default: 'primary')
- `size`: 'sm' | 'md' | 'lg' (default: 'md')
- `loading`: boolean (default: false)
- `icon`: React.ReactNode
- `iconPosition`: 'left' | 'right' (default: 'left')
- `fullWidth`: boolean (default: false)

**Usage:**
```tsx
import { Button } from '@/components/atoms/Button';

// Primary button
<Button variant="primary">Save Changes</Button>

// Button with loading state
<Button loading={isLoading}>Submit</Button>

// Button with icon
<Button icon={<Plus />} iconPosition="left">
  Add Item
</Button>

// Destructive action
<Button variant="destructive" size="sm">Delete</Button>
```

**Features:**
- Smooth hover and press animations using Framer Motion
- Loading spinner with rotation animation
- Disabled state with reduced opacity
- Focus ring for accessibility

---

### Badge

A component for displaying status indicators, labels, and tags.

**Props:**
- `variant`: 'default' | 'success' | 'warning' | 'error' | 'info' (default: 'default')
- `size`: 'sm' | 'md' | 'lg' (default: 'md')
- `icon`: React.ReactNode

**Usage:**
```tsx
import { Badge } from '@/components/atoms/Badge';

// Success badge
<Badge variant="success">Resolved</Badge>

// Badge with icon
<Badge variant="error" icon={<AlertCircle />}>
  Critical
</Badge>

// Small badge
<Badge size="sm" variant="info">New</Badge>
```

**Features:**
- Color-coded variants for semantic meaning
- Optional icon support
- Rounded pill shape
- Responsive sizing

---

### Avatar

Displays user or customer avatars with automatic fallback to initials.

**Props:**
- `src`: string (image URL)
- `alt`: string
- `name`: string (used for initials)
- `size`: 'sm' | 'md' | 'lg' | 'xl' (default: 'md')

**Usage:**
```tsx
import { Avatar } from '@/components/atoms/Avatar';

// Avatar with image
<Avatar src="/user.jpg" alt="John Doe" name="John Doe" />

// Avatar with initials fallback
<Avatar name="Jane Smith" size="lg" />

// Small avatar
<Avatar name="Bob" size="sm" />
```

**Features:**
- Automatic initials generation from name
- Graceful image loading error handling
- Circular shape with consistent sizing
- Accessible alt text

---

### Input

A styled text input with validation state support.

**Props:**
- `validationState`: 'error' | 'success' | 'default' (default: 'default')
- `fullWidth`: boolean (default: false)
- All standard HTML input attributes

**Usage:**
```tsx
import { Input } from '@/components/atoms/Input';

// Basic input
<Input placeholder="Enter your name" />

// Input with error state
<Input 
  validationState="error" 
  value={email} 
  onChange={handleChange}
/>

// Full width input
<Input fullWidth placeholder="Search..." />
```

**Features:**
- Validation state styling (error, success)
- Focus ring for accessibility
- Smooth transitions
- Disabled state support

---

### Select

A styled dropdown select with validation state support.

**Props:**
- `validationState`: 'error' | 'success' | 'default' (default: 'default')
- `fullWidth`: boolean (default: false)
- All standard HTML select attributes

**Usage:**
```tsx
import { Select } from '@/components/atoms/Select';

// Basic select
<Select>
  <option value="1">Option 1</option>
  <option value="2">Option 2</option>
</Select>

// Select with error state
<Select validationState="error" value={priority}>
  <option value="low">Low</option>
  <option value="high">High</option>
</Select>
```

**Features:**
- Consistent styling with Input component
- Validation state support
- Focus states
- Accessible dropdown

---

## Molecular Components

### Card

A flexible container component for grouping related content.

**Props:**
- `variant`: 'default' | 'elevated' | 'outlined' (default: 'default')
- `padding`: 'none' | 'sm' | 'md' | 'lg' (default: 'md')
- `hoverable`: boolean (default: false)
- `onClick`: () => void

**Sub-components:**
- `CardHeader`: Header section with bottom margin
- `CardBody`: Main content area
- `CardFooter`: Footer section with top border

**Usage:**
```tsx
import { Card, CardHeader, CardBody, CardFooter } from '@/components/molecules/Card';

// Basic card
<Card>
  <CardHeader>
    <h3>Card Title</h3>
  </CardHeader>
  <CardBody>
    <p>Card content goes here</p>
  </CardBody>
</Card>

// Elevated card with hover effect
<Card variant="elevated" hoverable onClick={handleClick}>
  <CardBody>Clickable content</CardBody>
</Card>

// Card with footer
<Card padding="lg">
  <CardHeader>Header</CardHeader>
  <CardBody>Body content</CardBody>
  <CardFooter>
    <Button>Action</Button>
  </CardFooter>
</Card>
```

**Features:**
- Multiple visual variants
- Composable structure
- Hover effects with elevation
- Flexible padding options

---

### StatCard

Displays key metrics with optional trend indicators.

**Props:**
- `label`: string (metric name)
- `value`: number | string (metric value)
- `trend`: { value: number, direction: 'up' | 'down' }
- `icon`: React.ReactNode
- `color`: string (Tailwind color class)

**Usage:**
```tsx
import { StatCard } from '@/components/molecules/StatCard';

// Basic stat card
<StatCard label="Total Tickets" value={142} />

// Stat card with trend
<StatCard 
  label="Open Tickets" 
  value={23}
  trend={{ value: 12, direction: 'up' }}
/>

// Stat card with icon
<StatCard 
  label="Resolved" 
  value={89}
  icon={<CheckCircle />}
  color="text-success"
/>
```

**Features:**
- Large, prominent value display
- Trend indicators with arrows
- Optional icon support
- Hover effects

---

### SearchBar

A search input with debouncing and clear functionality.

**Props:**
- `placeholder`: string (default: 'Search...')
- `onChange`: (value: string) => void
- `debounceDelay`: number (default: 300ms)
- `value`: string (controlled mode)

**Usage:**
```tsx
import { SearchBar } from '@/components/molecules/SearchBar';

// Basic search bar
<SearchBar 
  placeholder="Search tickets..." 
  onChange={handleSearch}
/>

// Search bar with custom debounce
<SearchBar 
  placeholder="Search..." 
  onChange={handleSearch}
  debounceDelay={500}
/>

// Controlled search bar
<SearchBar 
  value={searchQuery}
  onChange={setSearchQuery}
/>
```

**Features:**
- Automatic debouncing to reduce API calls
- Search icon indicator
- Clear button when text is present
- Accessible with ARIA labels

---

### FilterChip

Displays active filters with remove functionality.

**Props:**
- `label`: string (filter name)
- `onRemove`: () => void

**Usage:**
```tsx
import { FilterChip } from '@/components/molecules/FilterChip';

// Single filter chip
<FilterChip 
  label="Status: Open" 
  onRemove={() => removeFilter('status')}
/>

// Multiple filter chips
<div className="flex gap-2">
  {activeFilters.map(filter => (
    <FilterChip 
      key={filter.id}
      label={filter.label}
      onRemove={() => removeFilter(filter.id)}
    />
  ))}
</div>
```

**Features:**
- Smooth entry and exit animations
- Hover scale effect
- Remove button with icon
- Accessible with ARIA labels

---

### PriorityBadge

Displays ticket priority with color coding and icons.

**Props:**
- `priority`: 'low' | 'medium' | 'high' | 'critical'
- `size`: 'sm' | 'md' | 'lg'

**Usage:**
```tsx
import { PriorityBadge } from '@/components/molecules/PriorityBadge';

<PriorityBadge priority="critical" />
<PriorityBadge priority="high" size="sm" />
```

**Features:**
- Color-coded by priority level
- Priority-specific icons
- Consistent with Badge component

---

### StatusBadge

Displays ticket status with appropriate styling.

**Props:**
- `status`: 'open' | 'in_progress' | 'resolved' | 'closed'
- `size`: 'sm' | 'md' | 'lg'

**Usage:**
```tsx
import { StatusBadge } from '@/components/molecules/StatusBadge';

<StatusBadge status="open" />
<StatusBadge status="resolved" size="sm" />
```

**Features:**
- Status-specific colors
- Clear visual distinction
- Consistent sizing

---

## Organism Components

### TicketCard

A comprehensive card displaying ticket information.

**Props:**
- `ticket`: Ticket object
- `onClick`: (ticketId: number) => void
- `showCustomer`: boolean (default: true)
- `compact`: boolean (default: false)

**Usage:**
```tsx
import { TicketCard } from '@/components/organisms/TicketCard';

<TicketCard 
  ticket={ticket}
  onClick={handleTicketClick}
  showCustomer={true}
/>
```

**Features:**
- Displays title, description, status, priority
- Customer information
- Timestamp with relative formatting
- Hover effects
- Click handling for navigation

---

### TicketFilters

A comprehensive filtering panel for tickets.

**Props:**
- `filters`: FilterState object
- `onFilterChange`: (filters: FilterState) => void
- `onClearAll`: () => void

**Usage:**
```tsx
import { TicketFilters } from '@/components/organisms/TicketFilters';

<TicketFilters 
  filters={currentFilters}
  onFilterChange={setFilters}
  onClearAll={clearAllFilters}
/>
```

**Features:**
- Status, priority, and category filters
- Search input with debouncing
- Active filter chips
- Clear all button
- Responsive layout

---

### TicketMetrics

Dashboard metrics display with stat cards.

**Props:**
- None (fetches data internally)

**Usage:**
```tsx
import { TicketMetrics } from '@/components/organisms/TicketMetrics';

<TicketMetrics />
```

**Features:**
- Total, open, in progress, resolved counts
- Average response time
- Trend indicators
- Loading states
- Error handling

---

### AISuggestionPanel

Displays AI-generated suggestions for ticket handling.

**Props:**
- `ticketId`: number
- `suggestion`: AISuggestion | null
- `loading`: boolean
- `onApply`: (editedReply: string, actions: string[]) => Promise<void>
- `onRegenerate`: () => Promise<void>

**Usage:**
```tsx
import { AISuggestionPanel } from '@/components/organisms/AISuggestionPanel';

<AISuggestionPanel 
  ticketId={ticketId}
  suggestion={aiSuggestion}
  loading={isLoading}
  onApply={handleApply}
  onRegenerate={handleRegenerate}
/>
```

**Features:**
- Summary, category, and priority suggestions
- Editable suggested reply
- Interactive action checklist
- Apply and regenerate buttons
- Loading and error states
- AI branding and visual distinction

---

### CustomerInfoCard

Displays customer information in a collapsible card.

**Props:**
- `customer`: Customer object
- `defaultExpanded`: boolean (default: true)

**Usage:**
```tsx
import { CustomerInfoCard } from '@/components/organisms/CustomerInfoCard';

<CustomerInfoCard 
  customer={customer}
  defaultExpanded={true}
/>
```

**Features:**
- Avatar with initials fallback
- Name, email, company, tier
- Collapsible content
- Tier badge
- Responsive layout

---

### ActionTimeline

Displays a chronological timeline of ticket actions.

**Props:**
- `actions`: TicketAction[]
- `loading`: boolean

**Usage:**
```tsx
import { ActionTimeline } from '@/components/organisms/ActionTimeline';

<ActionTimeline 
  actions={ticketActions}
  loading={isLoading}
/>
```

**Features:**
- Vertical timeline with connecting lines
- Distinct icons for action types
- AI vs human action differentiation
- Relative timestamps with tooltips
- Expandable details
- Entry animations

---

### ReplyEditor

A rich text editor for composing ticket replies.

**Props:**
- `onSubmit`: (reply: string) => Promise<void>
- `loading`: boolean
- `initialValue`: string

**Usage:**
```tsx
import { ReplyEditor } from '@/components/organisms/ReplyEditor';

<ReplyEditor 
  onSubmit={handleReplySubmit}
  loading={isSubmitting}
  initialValue=""
/>
```

**Features:**
- Textarea with character count
- Send button with loading state
- Keyboard shortcuts (Ctrl+Enter to submit)
- Validation
- Accessible labels

---

## Layout Components

### DashboardLayout

Main application layout with header and content area.

**Props:**
- `children`: React.ReactNode

**Usage:**
```tsx
import { DashboardLayout } from '@/components/layouts/DashboardLayout';

<DashboardLayout>
  <YourPageContent />
</DashboardLayout>
```

**Features:**
- Responsive header
- Mobile hamburger menu
- Theme toggle
- Content area with proper spacing
- Smooth transitions

---

### DashboardHeader

Application header with navigation and controls.

**Props:**
- None (uses context for theme)

**Usage:**
```tsx
import { DashboardHeader } from '@/components/layouts/DashboardHeader';

<DashboardHeader />
```

**Features:**
- App logo/title
- Theme toggle button
- Responsive design
- Mobile menu support
- Keyboard shortcuts help

---

## Design Tokens

### Colors

The application uses a semantic color system:

- **Primary**: Deep navy (#1e293b)
- **Accent**: Vibrant blue (#3b82f6)
- **Success**: Green (#10b981)
- **Warning**: Amber (#f59e0b)
- **Error**: Red (#ef4444)
- **Info**: Cyan (#06b6d4)

### Typography

- **Font Family**: Inter (system fallback)
- **Font Sizes**: xs (12px) to 4xl (36px)
- **Font Weights**: normal (400), medium (500), semibold (600), bold (700)

### Spacing

Based on 4px increments (1 = 4px, 2 = 8px, 3 = 12px, 4 = 16px, etc.)

### Border Radius

- **sm**: 4px
- **md**: 8px
- **lg**: 12px
- **xl**: 16px
- **full**: 9999px (fully rounded)

### Shadows

- **sm**: Subtle shadow for slight elevation
- **md**: Medium shadow for cards
- **lg**: Large shadow for modals
- **xl**: Extra large shadow for prominent elements

---

## Accessibility

All components follow accessibility best practices:

- Semantic HTML elements
- ARIA labels and roles
- Keyboard navigation support
- Focus indicators
- Screen reader compatibility
- Color contrast compliance (WCAG AA)

---

## Animation

Components use Framer Motion for smooth animations:

- Hover effects with scale transforms
- Press animations for tactile feedback
- Entry/exit animations for modals and lists
- Stagger effects for list items
- Loading spinners with rotation
- Theme transitions

---

## Responsive Design

Components are responsive by default:

- Mobile-first approach
- Breakpoints: sm (640px), md (768px), lg (1024px), xl (1280px)
- Flexible layouts with CSS Grid and Flexbox
- Touch-friendly tap targets
- Adaptive typography

---

## Best Practices

1. **Import from index files**: Use barrel exports for cleaner imports
2. **Use TypeScript**: All components are fully typed
3. **Compose components**: Build complex UIs from simple components
4. **Follow naming conventions**: Use PascalCase for components
5. **Add ARIA labels**: Ensure accessibility for all interactive elements
6. **Test responsiveness**: Check components at different screen sizes
7. **Use design tokens**: Reference theme values instead of hardcoding
8. **Handle loading states**: Show skeletons or spinners during data fetching
9. **Handle errors gracefully**: Display user-friendly error messages
10. **Optimize performance**: Use React.memo for expensive components

---

## Contributing

When adding new components:

1. Follow the atomic design methodology
2. Add comprehensive JSDoc comments
3. Include usage examples
4. Write property-based tests
5. Ensure accessibility compliance
6. Document in this file
7. Export from appropriate index file

---

## Resources

- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Framer Motion Documentation](https://www.framer.com/motion/)
- [Radix UI Documentation](https://www.radix-ui.com/)
- [React TypeScript Cheatsheet](https://react-typescript-cheatsheet.netlify.app/)
- [WCAG Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
