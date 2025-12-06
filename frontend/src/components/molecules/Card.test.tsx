import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Card, CardHeader, CardBody, CardFooter } from './Card';

describe('Card', () => {
  it('renders with children', () => {
    render(<Card>Card content</Card>);
    expect(screen.getByText('Card content')).toBeInTheDocument();
  });

  it('applies default variant classes', () => {
    const { container } = render(<Card>Content</Card>);
    const card = container.firstChild as HTMLElement;
    expect(card).toHaveClass('bg-white', 'dark:bg-secondary');
  });

  it('applies elevated variant classes', () => {
    const { container } = render(<Card variant="elevated">Content</Card>);
    const card = container.firstChild as HTMLElement;
    expect(card).toHaveClass('shadow-md');
  });

  it('applies outlined variant classes', () => {
    const { container } = render(<Card variant="outlined">Content</Card>);
    const card = container.firstChild as HTMLElement;
    expect(card).toHaveClass('bg-transparent', 'border-2');
  });

  it('applies correct padding classes', () => {
    const { container: noneContainer } = render(<Card padding="none">Content</Card>);
    const { container: smContainer } = render(<Card padding="sm">Content</Card>);
    const { container: lgContainer } = render(<Card padding="lg">Content</Card>);
    
    expect(noneContainer.firstChild as HTMLElement).not.toHaveClass('p-3', 'p-4', 'p-6');
    expect(smContainer.firstChild as HTMLElement).toHaveClass('p-3');
    expect(lgContainer.firstChild as HTMLElement).toHaveClass('p-6');
  });

  it('applies hover classes when hoverable is true', () => {
    const { container } = render(<Card hoverable>Content</Card>);
    const card = container.firstChild as HTMLElement;
    expect(card).toHaveClass('hover:shadow-lg', 'cursor-pointer');
  });

  it('calls onClick when clicked', async () => {
    const handleClick = vi.fn();
    const user = userEvent.setup();
    
    render(<Card onClick={handleClick}>Clickable card</Card>);
    await user.click(screen.getByText('Clickable card'));
    
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('applies custom className', () => {
    const { container } = render(<Card className="custom-class">Content</Card>);
    expect(container.firstChild as HTMLElement).toHaveClass('custom-class');
  });
});

describe('CardHeader', () => {
  it('renders with children', () => {
    render(<CardHeader>Header content</CardHeader>);
    expect(screen.getByText('Header content')).toBeInTheDocument();
  });

  it('applies margin bottom class', () => {
    const { container } = render(<CardHeader>Header</CardHeader>);
    expect(container.firstChild as HTMLElement).toHaveClass('mb-4');
  });

  it('applies custom className', () => {
    const { container } = render(<CardHeader className="custom-header">Header</CardHeader>);
    expect(container.firstChild as HTMLElement).toHaveClass('custom-header');
  });
});

describe('CardBody', () => {
  it('renders with children', () => {
    render(<CardBody>Body content</CardBody>);
    expect(screen.getByText('Body content')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    const { container } = render(<CardBody className="custom-body">Body</CardBody>);
    expect(container.firstChild as HTMLElement).toHaveClass('custom-body');
  });
});

describe('CardFooter', () => {
  it('renders with children', () => {
    render(<CardFooter>Footer content</CardFooter>);
    expect(screen.getByText('Footer content')).toBeInTheDocument();
  });

  it('applies border top class', () => {
    const { container } = render(<CardFooter>Footer</CardFooter>);
    expect(container.firstChild as HTMLElement).toHaveClass('border-t');
  });

  it('applies custom className', () => {
    const { container } = render(<CardFooter className="custom-footer">Footer</CardFooter>);
    expect(container.firstChild as HTMLElement).toHaveClass('custom-footer');
  });
});

describe('Card composition', () => {
  it('renders complete card with all sections', () => {
    render(
      <Card>
        <CardHeader>Title</CardHeader>
        <CardBody>Content</CardBody>
        <CardFooter>Actions</CardFooter>
      </Card>
    );
    
    expect(screen.getByText('Title')).toBeInTheDocument();
    expect(screen.getByText('Content')).toBeInTheDocument();
    expect(screen.getByText('Actions')).toBeInTheDocument();
  });
});
