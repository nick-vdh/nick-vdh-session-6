import React from 'react';
import { render, screen } from '@testing-library/react';
import TodoList from '../TodoList';

describe('TodoList Component', () => {
  const mockHandlers = {
    onToggle: jest.fn(),
    onEdit: jest.fn(),
    onDelete: jest.fn()
  };

  const mockTodos = [
    {
      id: 1,
      title: 'Todo 1',
      dueDate: '2025-12-25',
      completed: 0,
      createdAt: '2025-11-01T00:00:00Z'
    },
    {
      id: 2,
      title: 'Todo 2',
      dueDate: null,
      completed: 1,
      createdAt: '2025-11-02T00:00:00Z'
    }
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render empty state when todos array is empty', () => {
    render(<TodoList todos={[]} {...mockHandlers} isLoading={false} />);
    
    expect(screen.getByText(/No todos yet. Add one to get started!/)).toBeInTheDocument();
  });

  it('should render all todos when provided', () => {
    render(<TodoList todos={mockTodos} {...mockHandlers} isLoading={false} />);
    
    expect(screen.getByText('Todo 1')).toBeInTheDocument();
    expect(screen.getByText('Todo 2')).toBeInTheDocument();
  });

  it('should render correct number of todo cards', () => {
    render(<TodoList todos={mockTodos} {...mockHandlers} isLoading={false} />);
    
    expect(screen.getAllByTestId('todo-card')).toHaveLength(2);
  });

  it('should pass handlers to TodoCard components', () => {
    render(<TodoList todos={mockTodos} {...mockHandlers} isLoading={false} />);
    
    // Verify that edit buttons exist for each todo
    expect(screen.getAllByLabelText(/Edit/)).toHaveLength(2);
    expect(screen.getAllByLabelText(/Delete/)).toHaveLength(2);
  });

  it('should forward today to each card and keep the given order', () => {
    const todos = [
      { id: 3, title: 'Past due', dueDate: '2025-06-14', completed: 0, createdAt: '' },
      { id: 2, title: 'Due today', dueDate: '2025-06-15', completed: 0, createdAt: '' },
      { id: 1, title: 'Done', dueDate: '2025-06-01', completed: 1, createdAt: '' }
    ];
    render(<TodoList todos={todos} today="2025-06-15" {...mockHandlers} isLoading={false} />);

    expect(screen.getAllByText('Overdue')).toHaveLength(1);
    const cards = screen.getAllByTestId('todo-card');
    expect(cards[0]).toHaveClass('overdue');
    expect(cards[0]).toHaveTextContent('Past due');
    expect(cards[1]).not.toHaveClass('overdue');
    expect(cards[2]).not.toHaveClass('overdue');
  });
});
