import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import TodoCard from '../TodoCard';

describe('TodoCard Component', () => {
  const mockTodo = {
    id: 1,
    title: 'Test Todo',
    dueDate: '2025-12-25',
    completed: 0,
    createdAt: '2025-11-01T00:00:00Z'
  };

  const mockHandlers = {
    onToggle: jest.fn(),
    onEdit: jest.fn(),
    onDelete: jest.fn()
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render todo title and due date', () => {
    render(<TodoCard todo={mockTodo} {...mockHandlers} isLoading={false} />);
    
    expect(screen.getByText('Test Todo')).toBeInTheDocument();
    expect(screen.getByText(/December 25, 2025/)).toBeInTheDocument();
  });

  it('should render unchecked checkbox when todo is incomplete', () => {
    render(<TodoCard todo={mockTodo} {...mockHandlers} isLoading={false} />);
    
    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).not.toBeChecked();
  });

  it('should render checked checkbox when todo is complete', () => {
    const completedTodo = { ...mockTodo, completed: 1 };
    render(<TodoCard todo={completedTodo} {...mockHandlers} isLoading={false} />);
    
    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toBeChecked();
  });

  it('should call onToggle when checkbox is clicked', () => {
    render(<TodoCard todo={mockTodo} {...mockHandlers} isLoading={false} />);
    
    const checkbox = screen.getByRole('checkbox');
    fireEvent.click(checkbox);
    
    expect(mockHandlers.onToggle).toHaveBeenCalledWith(mockTodo.id);
  });

  it('should show edit button', () => {
    render(<TodoCard todo={mockTodo} {...mockHandlers} isLoading={false} />);
    
    const editButton = screen.getByLabelText(/Edit/);
    expect(editButton).toBeInTheDocument();
  });

  it('should show delete button', () => {
    render(<TodoCard todo={mockTodo} {...mockHandlers} isLoading={false} />);
    
    const deleteButton = screen.getByLabelText(/Delete/);
    expect(deleteButton).toBeInTheDocument();
  });

  it('should call onDelete when delete button is clicked and confirmed', () => {
    window.confirm = jest.fn(() => true);
    render(<TodoCard todo={mockTodo} {...mockHandlers} isLoading={false} />);
    
    const deleteButton = screen.getByLabelText(/Delete/);
    fireEvent.click(deleteButton);
    
    expect(mockHandlers.onDelete).toHaveBeenCalledWith(mockTodo.id);
  });

  it('should enter edit mode when edit button is clicked', () => {
    render(<TodoCard todo={mockTodo} {...mockHandlers} isLoading={false} />);
    
    const editButton = screen.getByLabelText(/Edit/);
    fireEvent.click(editButton);
    
    expect(screen.getByDisplayValue('Test Todo')).toBeInTheDocument();
  });

  it('should apply completed class when todo is completed', () => {
    const completedTodo = { ...mockTodo, completed: 1 };
    render(<TodoCard todo={completedTodo} {...mockHandlers} isLoading={false} />);
    
    expect(screen.getByTestId('todo-card')).toHaveClass('completed');
  });

  it('should not render due date when dueDate is null', () => {
    const todoNoDate = { ...mockTodo, dueDate: null };
    render(<TodoCard todo={todoNoDate} {...mockHandlers} isLoading={false} />);
    
    expect(screen.queryByText(/Due:/)).not.toBeInTheDocument();
  });

  describe('overdue display', () => {
    const today = '2025-06-15';

    const renderCard = (todoOverrides, props = {}) =>
      render(
        <TodoCard
          todo={{ ...mockTodo, ...todoOverrides }}
          today={today}
          {...mockHandlers}
          isLoading={false}
          {...props}
        />
      );

    afterEach(() => {
      jest.useRealTimers();
    });

    it('should mark an incomplete todo due before today as overdue', () => {
      renderCard({ dueDate: '2025-06-14' });

      expect(screen.getByTestId('todo-card')).toHaveClass('overdue');
      expect(screen.getByText('Overdue')).toHaveClass('overdue-label');
    });

    it.each([
      ['due today', { dueDate: '2025-06-15' }],
      ['due in the future', { dueDate: '2025-06-16' }],
      ['without a due date', { dueDate: null }],
      ['with an invalid due date', { dueDate: '2025-02-30' }],
      ['completed with a past due date', { dueDate: '2025-06-01', completed: 1 }]
    ])('should not mark a todo %s as overdue', (_description, todoOverrides) => {
      renderCard(todoOverrides);

      expect(screen.getByTestId('todo-card')).not.toHaveClass('overdue');
      expect(screen.queryByText('Overdue')).not.toBeInTheDocument();
    });

    it('should default today to the current local date when the prop is omitted', () => {
      jest.useFakeTimers();
      jest.setSystemTime(new Date(2025, 5, 15, 12, 0));

      render(
        <TodoCard
          todo={{ ...mockTodo, dueDate: '2025-06-14' }}
          {...mockHandlers}
          isLoading={false}
        />
      );

      expect(screen.getByText('Overdue')).toBeInTheDocument();
    });

    it('should not show the overdue label in edit mode', () => {
      renderCard({ dueDate: '2025-06-14' });

      fireEvent.click(screen.getByLabelText(/Edit/));

      expect(screen.getByDisplayValue('Test Todo')).toBeInTheDocument();
      expect(screen.queryByText('Overdue')).not.toBeInTheDocument();
    });

    // The test script runs Jest in a negative-offset timezone, where UTC parsing shifts the day.
    it('should display the due date as the same calendar day as the overdue comparison', () => {
      renderCard({ dueDate: '2025-06-15' });

      expect(screen.getByText(/June 15, 2025/)).toBeInTheDocument();
    });

    it('should expose the overdue status as visible text, not only color', () => {
      renderCard({ dueDate: '2025-06-14' });

      const label = screen.getByText('Overdue');
      expect(label).toBeVisible();
      expect(label).not.toHaveAttribute('aria-hidden');
    });
  });
});
