import {
  GraphQLBoolean,
  GraphQLInt,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString,
} from 'graphql';

import {
  connectionArgs,
  connectionDefinitions,
  connectionFromArray,
  fromGlobalId,
  globalIdField,
  nodeDefinitions,
} from 'graphql-relay';

import {
  Todo,
  User,
  getTodoOrThrow,
  getTodos,
  getUserOrThrow,
} from '../database';

const {nodeInterface, nodeField} = nodeDefinitions(
  (globalId: string): {} | undefined => {
    const {type, id}: {id: string; type: string} = fromGlobalId(globalId);

    if (type === 'Todo') {
      return getTodoOrThrow(id);
    } else if (type === 'User') {
      return getUserOrThrow(id);
    }
    return undefined;
  },
  (obj: {}): GraphQLObjectType | null => {
    if (obj instanceof Todo) {
      return GraphQLTodo;
    } else if (obj instanceof User) {
      return GraphQLUser;
    }
    return null;
  },
);

const GraphQLTodo = new GraphQLObjectType({
  name: 'Todo',
  fields: {
    id: globalIdField('Todo'),
    text: {
      type: new GraphQLNonNull(GraphQLString),
      resolve: (todo: Todo): string => todo.text,
    },
    complete: {
      type: new GraphQLNonNull(GraphQLBoolean),
      resolve: (todo: Todo): boolean => todo.complete,
    },
  },
  interfaces: [nodeInterface],
});

const {
  connectionType: TodosConnection,
  edgeType: GraphQLTodoEdge,
} = connectionDefinitions({
  name: 'Todo',
  nodeType: GraphQLTodo,
});

const GraphQLUser = new GraphQLObjectType({
  name: 'User',
  fields: {
    id: globalIdField('User'),
    userId: {
      type: new GraphQLNonNull(GraphQLString),
      resolve: ({id}): string => id,
    },
    todos: {
      type: TodosConnection,
      args: {
        status: {
          type: GraphQLString,
          defaultValue: 'any',
        },
        ...connectionArgs,
      },
      // eslint-disable-next-line flowtype/require-parameter-type
      resolve: ({id}, {status, after, before, first, last}) =>
        connectionFromArray([...getTodos(id, status)], {
          after,
          before,
          first,
          last,
        }),
    },
    totalCount: {
      type: new GraphQLNonNull(GraphQLInt),
      resolve: ({id}): number => getTodos(id).length,
    },
    completedCount: {
      type: new GraphQLNonNull(GraphQLInt),
      resolve: ({id}): number => getTodos(id, 'completed').length,
    },
  },
  interfaces: [nodeInterface],
});

export {nodeField, GraphQLTodo, GraphQLTodoEdge, GraphQLUser};
