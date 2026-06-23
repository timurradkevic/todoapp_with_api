import { useCallback, useEffect, useRef, useState } from 'react';
import { Todo } from '../types/Todo';
import { USER_ID } from '../api/todos';
import { getTodos, createTodo, removeTodo, updateTodo } from '../api/todos';
import { filterTodos } from '../lib/filterTodos';
import { QueryTodos } from '../model';

const ERROR_TIMEOUT_MS = 3000;

export function useTodos() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [updatingTodoIds, setUpdatingTodoIds] = useState<number[]>([]);
  const [selectedTodo, setSelectedTodo] = useState<Todo | null>(null);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [newTodoTitle, setNewTodoTitle] = useState('');
  const [isInputActive, setIsInputActive] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [query, setQuery] = useState<QueryTodos>(QueryTodos.All);

  const inputRef = useRef<HTMLInputElement>(null);

  const activeTodosCount = filterTodos(todos, QueryTodos.Active).length;
  const completedTodos = filterTodos(todos, QueryTodos.Completed);
  const preparedTodos = filterTodos(todos, query);

  const showError = useCallback((message: string) => {
    setErrorMessage(message);
  }, []);

  const addUpdatingId = useCallback((id: number) => {
    setUpdatingTodoIds(prev => [...prev, id]);
  }, []);

  const removeUpdatingId = useCallback((id: number) => {
    setUpdatingTodoIds(prev => prev.filter(prevId => prevId !== id));
  }, []);

  useEffect(() => {
    if (!errorMessage) {
      return;
    }

    const id = window.setTimeout(() => setErrorMessage(''), ERROR_TIMEOUT_MS);

    return () => clearTimeout(id);
  }, [errorMessage]);

  useEffect(() => {
    if (isInputActive) {
      inputRef.current?.focus();
    }
  }, [isInputActive]);

  useEffect(() => {
    setIsLoading(true);
    getTodos()
      .then(setTodos)
      .catch(() => showError('Unable to load todos'))
      .finally(() => setIsLoading(false));
  }, [showError]);

  const addTodo = useCallback(
    async (title: string) => {
      const trimmed = title.trim();

      if (!trimmed) {
        showError('Title should not be empty');

        return;
      }

      setErrorMessage('');
      setIsInputActive(false);
      setTempTodo({ id: 0, title: trimmed, userId: USER_ID, completed: false });

      try {
        const newTodo = await createTodo({
          title: trimmed,
          userId: USER_ID,
          completed: false,
        });

        setTodos(prev => [...prev, newTodo]);
        setNewTodoTitle('');
      } catch {
        showError('Unable to add a todo');
        throw new Error('Unable to add a todo');
      } finally {
        setTempTodo(null);
        setIsInputActive(true);
      }
    },
    [showError],
  );

  const deleteTodo = useCallback(
    async (todoId: number) => {
      addUpdatingId(todoId);
      try {
        await removeTodo(todoId);
        setTodos(prev => prev.filter(t => t.id !== todoId));
        inputRef.current?.focus();
      } catch {
        showError('Unable to delete a todo');
        throw new Error('Unable to delete a todo');
      } finally {
        removeUpdatingId(todoId);
      }
    },
    [addUpdatingId, removeUpdatingId, showError],
  );

  const updateTodoTitle = useCallback(
    async (todoId: number, newTitle: string) => {
      const trimmed = newTitle.trim();
      const current = todos.find(t => t.id === todoId);

      if (current?.title === trimmed) {
        setSelectedTodo(null);

        return;
      }

      if (!trimmed && current) {
        await deleteTodo(current.id);

        return;
      }

      setErrorMessage('');
      addUpdatingId(todoId);

      try {
        const updated = await updateTodo(todoId, { title: trimmed });

        setSelectedTodo(null);
        setTodos(prev => prev.map(t => (t.id === updated.id ? updated : t)));
      } catch {
        showError('Unable to update a todo');
        throw new Error('Unable to update a todo');
      } finally {
        removeUpdatingId(todoId);
      }
    },
    [todos, addUpdatingId, removeUpdatingId, showError, deleteTodo],
  );

  const toggleTodoStatus = useCallback(
    async (todoId: number, completed: boolean) => {
      addUpdatingId(todoId);
      try {
        const updated = await updateTodo(todoId, { completed: !completed });

        setSelectedTodo(null);
        setTodos(prev => prev.map(t => (t.id === updated.id ? updated : t)));
      } catch {
        showError('Unable to update a todo');
        throw new Error('Unable to update a todo');
      } finally {
        removeUpdatingId(todoId);
      }
    },
    [addUpdatingId, removeUpdatingId, showError],
  );

  const toggleAllTodos = useCallback(async () => {
    const allCompleted = todos.every(t => t.completed);
    const toToggle = todos.filter(t => t.completed === allCompleted);
    const ids = toToggle.map(t => t.id);

    setUpdatingTodoIds(prev => [...prev, ...ids]);

    try {
      await Promise.all(
        toToggle.map(t => updateTodo(t.id, { completed: !allCompleted })),
      );
      setTodos(prev =>
        prev.map(t =>
          t.completed === allCompleted ? { ...t, completed: !allCompleted } : t,
        ),
      );
    } catch {
      showError('Unable to update a todo');
    } finally {
      setUpdatingTodoIds(prev => prev.filter(id => !ids.includes(id)));
    }
  }, [todos, showError]);

  const clearCompletedTodos = useCallback(async () => {
    await Promise.all(completedTodos.map(t => deleteTodo(t.id)));
    inputRef.current?.focus();
  }, [completedTodos, deleteTodo]);

  return {
    todos,
    preparedTodos,
    updatingTodoIds,
    selectedTodo,
    setSelectedTodo,
    tempTodo,
    newTodoTitle,
    setNewTodoTitle,
    isInputActive,
    errorMessage,
    setErrorMessage,
    isLoading,
    query,
    setQuery,
    activeTodosCount,
    completedTodos,
    inputRef,
    addTodo,
    deleteTodo,
    updateTodoTitle,
    toggleTodoStatus,
    toggleAllTodos,
    clearCompletedTodos,
  };
}
