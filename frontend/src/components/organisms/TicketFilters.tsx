import React from 'react';
import { Card } from '../molecules/Card';
import { SearchBar } from '../molecules/SearchBar';
import { FilterChip } from '../molecules/FilterChip';
import { Select } from '../atoms/Select';
import { Button } from '../atoms/Button';
import { FilterX } from 'lucide-react';
import { FilterState } from '@/types';
import { cn } from '@/lib/utils';

interface TicketFiltersProps {
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
  onClearAll: () => void;
  className?: string;
}

const STATUS_OPTIONS = [
  { value: 'open', label: 'Open' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'resolved', label: 'Resolved' },
  { value: 'closed', label: 'Closed' },
];

const PRIORITY_OPTIONS = [
  { value: 'P1', label: 'P1 - Critical' },
  { value: 'P2', label: 'P2 - High' },
  { value: 'P3', label: 'P3 - Medium' },
  { value: 'P4', label: 'P4 - Low' },
];

const CATEGORY_OPTIONS = [
  { value: 'billing', label: 'Billing' },
  { value: 'outage', label: 'Outage' },
  { value: 'bug', label: 'Bug' },
  { value: 'config', label: 'Config' },
  { value: 'performance', label: 'Performance' },
];

export const TicketFilters: React.FC<TicketFiltersProps> = ({
  filters,
  onFilterChange,
  onClearAll,
  className,
}) => {
  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    if (value && !filters.status.includes(value)) {
      onFilterChange({
        ...filters,
        status: [...filters.status, value],
      });
    }
    // Reset select to placeholder
    e.target.value = '';
  };

  const handlePriorityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    if (value && !filters.priority.includes(value)) {
      onFilterChange({
        ...filters,
        priority: [...filters.priority, value],
      });
    }
    // Reset select to placeholder
    e.target.value = '';
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    if (value && !filters.category.includes(value)) {
      onFilterChange({
        ...filters,
        category: [...filters.category, value],
      });
    }
    // Reset select to placeholder
    e.target.value = '';
  };

  const handleSearchChange = (value: string) => {
    onFilterChange({
      ...filters,
      searchQuery: value,
    });
  };

  const removeStatusFilter = (status: string) => {
    onFilterChange({
      ...filters,
      status: filters.status.filter(s => s !== status),
    });
  };

  const removePriorityFilter = (priority: string) => {
    onFilterChange({
      ...filters,
      priority: filters.priority.filter(p => p !== priority),
    });
  };

  const removeCategoryFilter = (category: string) => {
    onFilterChange({
      ...filters,
      category: filters.category.filter(c => c !== category),
    });
  };

  const hasActiveFilters =
    filters.status.length > 0 ||
    filters.priority.length > 0 ||
    filters.category.length > 0 ||
    filters.searchQuery.length > 0;

  const activeFilterCount =
    filters.status.length +
    filters.priority.length +
    filters.category.length +
    (filters.searchQuery ? 1 : 0);

  return (
    <div className={cn('p-5 rounded-xl border border-border bg-card space-y-6', className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-foreground">Filters</h2>
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearAll}
            className="text-xs"
          >
            Clear all
          </Button>
        )}
      </div>

      {/* Search Bar */}
      <div>
        <SearchBar
          placeholder="Search tickets..."
          onChange={handleSearchChange}
          value={filters.searchQuery}
        />
      </div>

      {/* Filter Sections */}
      <div className="space-y-6">
        {/* Status Filter */}
        <div className="space-y-3">
          <label className="block text-sm font-medium text-foreground">
            Status
          </label>
          <Select fullWidth onChange={handleStatusChange} defaultValue="" className="text-sm">
            <option value="" disabled>
              Select status...
            </option>
            {STATUS_OPTIONS.filter(opt => !filters.status.includes(opt.value)).map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Select>
          {filters.status.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {filters.status.map(status => (
                <FilterChip
                  key={`status-${status}`}
                  label={STATUS_OPTIONS.find(o => o.value === status)?.label || status}
                  onRemove={() => removeStatusFilter(status)}
                />
              ))}
            </div>
          )}
        </div>

        {/* Priority Filter */}
        <div className="space-y-3">
          <label className="block text-sm font-medium text-foreground">
            Priority
          </label>
          <Select fullWidth onChange={handlePriorityChange} defaultValue="" className="text-sm">
            <option value="" disabled>
              Select priority...
            </option>
            {PRIORITY_OPTIONS.filter(opt => !filters.priority.includes(opt.value)).map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Select>
          {filters.priority.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {filters.priority.map(priority => (
                <FilterChip
                  key={`priority-${priority}`}
                  label={PRIORITY_OPTIONS.find(o => o.value === priority)?.label || priority}
                  onRemove={() => removePriorityFilter(priority)}
                />
              ))}
            </div>
          )}
        </div>

        {/* Category Filter */}
        <div className="space-y-3">
          <label className="block text-sm font-medium text-foreground">
            Category
          </label>
          <Select fullWidth onChange={handleCategoryChange} defaultValue="" className="text-sm">
            <option value="" disabled>
              Select category...
            </option>
            {CATEGORY_OPTIONS.filter(opt => !filters.category.includes(opt.value)).map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Select>
          {filters.category.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {filters.category.map(category => (
                <FilterChip
                  key={`category-${category}`}
                  label={CATEGORY_OPTIONS.find(o => o.value === category)?.label || category}
                  onRemove={() => removeCategoryFilter(category)}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Active Filter Count */}
      {hasActiveFilters && (
        <div className="pt-4 border-t border-border">
          <p className="text-sm text-muted-foreground">
            {activeFilterCount} {activeFilterCount === 1 ? 'filter' : 'filters'} active
          </p>
        </div>
      )}
    </div>
  );
};
