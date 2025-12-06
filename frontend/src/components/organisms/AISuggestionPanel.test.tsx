import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AISuggestionPanel } from './AISuggestionPanel';
import { AISuggestion } from '@/types';

const mockSuggestion: AISuggestion = {
  summary: 'Customer is experiencing login issues due to expired credentials',
  category: 'authentication',
  priority: 'high',
  suggested_reply: 'Thank you for contacting us. I can help you resolve this login issue.',
  suggested_actions: [
    'Reset customer password',
    'Verify account status',
    'Check for security alerts',
  ],
};

describe('AISuggestionPanel', () => {
  it('renders initial state with "Ask AI to Help" button', () => {
    const handleGenerate = vi.fn();
    const handleApply = vi.fn();
    
    render(
      <AISuggestionPanel
        suggestion={null}
        loading={false}
        error={null}
        onGenerate={handleGenerate}
        onApply={handleApply}
      />
    );
    
    expect(screen.getByText('Get AI-powered suggestions for this ticket')).toBeInTheDocument();
    expect(screen.getByText('Ask AI to Help')).toBeInTheDocument();
  });

  it('calls onGenerate when "Ask AI to Help" button is clicked', async () => {
    const handleGenerate = vi.fn();
    const handleApply = vi.fn();
    const user = userEvent.setup();
    
    render(
      <AISuggestionPanel
        suggestion={null}
        loading={false}
        error={null}
        onGenerate={handleGenerate}
        onApply={handleApply}
      />
    );
    
    await user.click(screen.getByText('Ask AI to Help'));
    expect(handleGenerate).toHaveBeenCalledTimes(1);
  });

  it('renders loading state', () => {
    const handleGenerate = vi.fn();
    const handleApply = vi.fn();
    
    render(
      <AISuggestionPanel
        suggestion={null}
        loading={true}
        error={null}
        onGenerate={handleGenerate}
        onApply={handleApply}
      />
    );
    
    expect(screen.getByText('AI is analyzing the ticket...')).toBeInTheDocument();
  });

  it('renders error state with error message', () => {
    const handleGenerate = vi.fn();
    const handleApply = vi.fn();
    const errorMessage = 'AI service is temporarily unavailable';
    
    render(
      <AISuggestionPanel
        suggestion={null}
        loading={false}
        error={errorMessage}
        onGenerate={handleGenerate}
        onApply={handleApply}
      />
    );
    
    expect(screen.getByText('Unable to generate suggestions')).toBeInTheDocument();
    expect(screen.getByText(errorMessage)).toBeInTheDocument();
    expect(screen.getByText('Try Again')).toBeInTheDocument();
  });

  it('calls onGenerate when "Try Again" button is clicked in error state', async () => {
    const handleGenerate = vi.fn();
    const handleApply = vi.fn();
    const user = userEvent.setup();
    
    render(
      <AISuggestionPanel
        suggestion={null}
        loading={false}
        error="Error occurred"
        onGenerate={handleGenerate}
        onApply={handleApply}
      />
    );
    
    await user.click(screen.getByText('Try Again'));
    expect(handleGenerate).toHaveBeenCalledTimes(1);
  });

  it('renders suggestion summary', () => {
    const handleGenerate = vi.fn();
    const handleApply = vi.fn();
    
    render(
      <AISuggestionPanel
        suggestion={mockSuggestion}
        loading={false}
        error={null}
        onGenerate={handleGenerate}
        onApply={handleApply}
      />
    );
    
    expect(screen.getByText('Summary')).toBeInTheDocument();
    expect(screen.getByText(mockSuggestion.summary)).toBeInTheDocument();
  });

  it('renders suggested category', () => {
    const handleGenerate = vi.fn();
    const handleApply = vi.fn();
    
    render(
      <AISuggestionPanel
        suggestion={mockSuggestion}
        loading={false}
        error={null}
        onGenerate={handleGenerate}
        onApply={handleApply}
      />
    );
    
    expect(screen.getByText('Suggested Category')).toBeInTheDocument();
    expect(screen.getByText('authentication')).toBeInTheDocument();
  });

  it('renders suggested priority', () => {
    const handleGenerate = vi.fn();
    const handleApply = vi.fn();
    
    render(
      <AISuggestionPanel
        suggestion={mockSuggestion}
        loading={false}
        error={null}
        onGenerate={handleGenerate}
        onApply={handleApply}
      />
    );
    
    expect(screen.getByText('Suggested Priority')).toBeInTheDocument();
    expect(screen.getByText('high')).toBeInTheDocument();
  });

  it('renders all suggested actions as checkboxes', () => {
    const handleGenerate = vi.fn();
    const handleApply = vi.fn();
    
    render(
      <AISuggestionPanel
        suggestion={mockSuggestion}
        loading={false}
        error={null}
        onGenerate={handleGenerate}
        onApply={handleApply}
      />
    );
    
    expect(screen.getByText('Suggested Actions')).toBeInTheDocument();
    expect(screen.getByText('Reset customer password')).toBeInTheDocument();
    expect(screen.getByText('Verify account status')).toBeInTheDocument();
    expect(screen.getByText('Check for security alerts')).toBeInTheDocument();
  });

  it('renders suggested reply in editable textarea', () => {
    const handleGenerate = vi.fn();
    const handleApply = vi.fn();
    
    render(
      <AISuggestionPanel
        suggestion={mockSuggestion}
        loading={false}
        error={null}
        onGenerate={handleGenerate}
        onApply={handleApply}
      />
    );
    
    expect(screen.getByText('Suggested Reply')).toBeInTheDocument();
    const textarea = screen.getByDisplayValue(mockSuggestion.suggested_reply);
    expect(textarea).toBeInTheDocument();
  });

  it('allows editing the suggested reply', async () => {
    const handleGenerate = vi.fn();
    const handleApply = vi.fn();
    const user = userEvent.setup();
    
    render(
      <AISuggestionPanel
        suggestion={mockSuggestion}
        loading={false}
        error={null}
        onGenerate={handleGenerate}
        onApply={handleApply}
      />
    );
    
    const textarea = screen.getByDisplayValue(mockSuggestion.suggested_reply);
    await user.clear(textarea);
    await user.type(textarea, 'Edited reply text');
    
    expect(textarea).toHaveValue('Edited reply text');
  });

  it('displays character count for reply', () => {
    const handleGenerate = vi.fn();
    const handleApply = vi.fn();
    
    render(
      <AISuggestionPanel
        suggestion={mockSuggestion}
        loading={false}
        error={null}
        onGenerate={handleGenerate}
        onApply={handleApply}
      />
    );
    
    const charCount = mockSuggestion.suggested_reply.length;
    expect(screen.getByText(`${charCount} characters`)).toBeInTheDocument();
  });

  it('toggles action checkbox when clicked', async () => {
    const handleGenerate = vi.fn();
    const handleApply = vi.fn();
    const user = userEvent.setup();
    
    render(
      <AISuggestionPanel
        suggestion={mockSuggestion}
        loading={false}
        error={null}
        onGenerate={handleGenerate}
        onApply={handleApply}
      />
    );
    
    const checkboxes = screen.getAllByRole('checkbox');
    const firstCheckbox = checkboxes[0];
    
    // Initially checked
    expect(firstCheckbox).toBeChecked();
    
    // Click to uncheck
    await user.click(firstCheckbox);
    expect(firstCheckbox).not.toBeChecked();
    
    // Click to check again
    await user.click(firstCheckbox);
    expect(firstCheckbox).toBeChecked();
  });

  it('renders "Apply & Send" button', () => {
    const handleGenerate = vi.fn();
    const handleApply = vi.fn();
    
    render(
      <AISuggestionPanel
        suggestion={mockSuggestion}
        loading={false}
        error={null}
        onGenerate={handleGenerate}
        onApply={handleApply}
      />
    );
    
    expect(screen.getByText('Apply & Send')).toBeInTheDocument();
  });

  it('renders "Regenerate" button', () => {
    const handleGenerate = vi.fn();
    const handleApply = vi.fn();
    
    render(
      <AISuggestionPanel
        suggestion={mockSuggestion}
        loading={false}
        error={null}
        onGenerate={handleGenerate}
        onApply={handleApply}
      />
    );
    
    expect(screen.getByText('Regenerate')).toBeInTheDocument();
  });

  it('calls onApply with edited reply and selected actions when "Apply & Send" is clicked', async () => {
    const handleGenerate = vi.fn();
    const handleApply = vi.fn();
    const user = userEvent.setup();
    
    render(
      <AISuggestionPanel
        suggestion={mockSuggestion}
        loading={false}
        error={null}
        onGenerate={handleGenerate}
        onApply={handleApply}
      />
    );
    
    // Edit the reply
    const textarea = screen.getByDisplayValue(mockSuggestion.suggested_reply);
    await user.clear(textarea);
    await user.type(textarea, 'Custom reply');
    
    // Uncheck one action
    const checkboxes = screen.getAllByRole('checkbox');
    await user.click(checkboxes[0]);
    
    // Click Apply & Send
    await user.click(screen.getByText('Apply & Send'));
    
    expect(handleApply).toHaveBeenCalledTimes(1);
    expect(handleApply).toHaveBeenCalledWith(
      'Custom reply',
      expect.arrayContaining([
        'Verify account status',
        'Check for security alerts',
      ])
    );
  });

  it('calls onGenerate when "Regenerate" button is clicked', async () => {
    const handleGenerate = vi.fn();
    const handleApply = vi.fn();
    const user = userEvent.setup();
    
    render(
      <AISuggestionPanel
        suggestion={mockSuggestion}
        loading={false}
        error={null}
        onGenerate={handleGenerate}
        onApply={handleApply}
      />
    );
    
    await user.click(screen.getByText('Regenerate'));
    expect(handleGenerate).toHaveBeenCalledTimes(1);
  });

  it('disables "Apply & Send" button when reply is empty', async () => {
    const handleGenerate = vi.fn();
    const handleApply = vi.fn();
    const user = userEvent.setup();
    
    render(
      <AISuggestionPanel
        suggestion={mockSuggestion}
        loading={false}
        error={null}
        onGenerate={handleGenerate}
        onApply={handleApply}
      />
    );
    
    const textarea = screen.getByDisplayValue(mockSuggestion.suggested_reply);
    await user.clear(textarea);
    
    const applyButton = screen.getByText('Apply & Send');
    expect(applyButton).toBeDisabled();
  });

  it('renders AI Assistant header', () => {
    const handleGenerate = vi.fn();
    const handleApply = vi.fn();
    
    render(
      <AISuggestionPanel
        suggestion={mockSuggestion}
        loading={false}
        error={null}
        onGenerate={handleGenerate}
        onApply={handleApply}
      />
    );
    
    expect(screen.getByText('AI Assistant')).toBeInTheDocument();
    expect(screen.getByText('Intelligent suggestions powered by AI')).toBeInTheDocument();
  });
});
