import { Todo } from '../types';
import { QueryTodos } from '../model/queryTodos';

const filterMap: Record<QueryTodos, (todo: Todo) => boolean> = {
  [QueryTodos.Active]: todo => !todo.completed,
  [QueryTodos.Completed]: todo => todo.completed,
  [QueryTodos.All]: () => true,
};

export function filterTodos(todos: Todo[], query: QueryTodos): Todo[] {
  return todos.filter(filterMap[query]);
}
