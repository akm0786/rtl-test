import usersReducer, { fetchUsers } from './usersSlice';

describe('usersSlice', () => {
  const initialState = { users: [], status: 'idle', error: null };

  test('should return the initial state', () => {
    expect(usersReducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  test('should handle fetchUsers.pending', () => {
    const action = { type: fetchUsers.pending.type };
    const state = usersReducer(initialState, action);
    expect(state.status).toBe('pending');
  });

  test('should handle fetchUsers.fulfilled', () => {
    const mockUsers = [
      { name: { first: 'John', last: 'Doe' }, email: 'john@test.com' },
    ];
    const action = {
      type: fetchUsers.fulfilled.type,
      payload: { data: { data: mockUsers } },
    };
    const state = usersReducer(initialState, action);
    expect(state.status).toBe('succeeded');
    expect(state.users).toEqual(mockUsers);
  });

  test('should handle fetchUsers.rejected', () => {
    const action = {
      type: fetchUsers.rejected.type,
      error: { message: 'Network Error' },
    };
    const state = usersReducer(initialState, action);
    expect(state.status).toBe('failed');
    expect(state.error).toBe('Network Error');
  });
}); 