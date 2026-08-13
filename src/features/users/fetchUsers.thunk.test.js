import { configureStore } from '@reduxjs/toolkit';
import { http, HttpResponse } from 'msw';
import usersReducer, { fetchUsers } from './usersSlice';
import { server } from '../../mocks/server';

const createTestStore = () =>
  configureStore({ reducer: { users: usersReducer } });

describe('fetchUsers thunk', () => {
  // MSW ke saath, fetch mock ki zaroorat nahi
  // beforeEach clean bhi zaroori nahi - MSW handle karega

  test('successful API call dispatches fulfilled', async () => {
    // MSW already configured hai default success response ke saath
    const store = createTestStore();
    await store.dispatch(fetchUsers());

    const state = store.getState().users;
    expect(state.status).toBe('succeeded');
    expect(state.users).toHaveLength(2);
    expect(state.users[0].name.first).toBe('Rahul');
    expect(state.users[1].email).toBe('neha@example.com');
    expect(state.error).toBeNull();
  });

  test('failed API call dispatches rejected', async () => {
    // Override handler for error case
    server.use(
      http.get('https://api.freeapi.app/api/v1/public/randomusers', () => {
        return HttpResponse.json({ message: 'Server error' }, { status: 500 });
      })
    );

    const store = createTestStore();
    await store.dispatch(fetchUsers());

    const state = store.getState().users;
    expect(state.status).toBe('failed');
    expect(state.error).toBeDefined();
    expect(state.users).toEqual([]);
  });

  test('dispatches pending then fulfilled states', async () => {
    const store = createTestStore();

    // Dispatch karo
    const dispatchPromise = store.dispatch(fetchUsers());

    // Immediately pending state check karo
    const pendingState = store.getState().users;
    expect(pendingState.status).toBe('pending');

    // Wait for completion
    await dispatchPromise;

    // Final state check
    const finalState = store.getState().users;
    expect(finalState.status).toBe('succeeded');
    expect(finalState.users).toHaveLength(2);
  });

  test('failed API call dispatches rejected', async () => {
    // HTTP error response ke liye - structure with data field
    server.use(
      http.get('https://api.freeapi.app/api/v1/public/randomusers', () => {
        // Option 1: Return proper error structure
        return HttpResponse.json(
          {
            success: false,
            message: 'Server error',
            data: null, // Ya data empty object
          },
          { status: 500 }
        );
      })
    );

    const store = createTestStore();
    await store.dispatch(fetchUsers());

    const state = store.getState().users;
    expect(state.status).toBe('failed');
    expect(state.error).toBeDefined();
    expect(state.users).toEqual([]);
  });
});
