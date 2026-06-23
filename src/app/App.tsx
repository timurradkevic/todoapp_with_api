import React from 'react';
import { UserWarning } from '../UserWarning';
import { USER_ID } from '../features/todos/api';
import { useTodos } from '../features/todos/model';
import {
  TodoList,
  TodoHeader,
  TodoFooter,
  ErrorNotification,
} from '../features/todos/ui';

export const App: React.FC = () => {
  const {
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
  } = useTodos();

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    addTodo(newTodoTitle);
  };

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <TodoHeader
          todos={todos}
          titleTodo={newTodoTitle}
          toggleAllTodos={toggleAllTodos}
          setTitleTodo={setNewTodoTitle}
          handleSubmit={handleSubmit}
          todoInputIsActive={isInputActive}
          inputRef={inputRef}
          isLoading={isLoading}
        />

        {!isLoading ? (
          <TodoList
            preparedTodos={preparedTodos}
            deleteTodo={deleteTodo}
            updateTodoTitle={updateTodoTitle}
            toggleTodoStatus={toggleTodoStatus}
            updatingTodos={updatingTodoIds}
            tempTodo={tempTodo}
            selectedTodo={selectedTodo}
            setSelectedTodo={setSelectedTodo}
          />
        ) : (
          <div className="todoapp__loader">
            <div className="loader"></div>
          </div>
        )}

        {!isLoading && todos.length !== 0 && (
          <TodoFooter
            activeTodosCount={activeTodosCount}
            completedTodos={completedTodos}
            clearCompletedTodos={clearCompletedTodos}
            query={query}
            setQuery={setQuery}
          />
        )}
      </div>

      <ErrorNotification
        errorMessage={errorMessage}
        setErrorMessage={setErrorMessage}
      />
    </div>
  );
};
