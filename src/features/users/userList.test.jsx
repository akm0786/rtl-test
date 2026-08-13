import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { http, HttpResponse } from 'msw';
import usersReducer from '../users/usersSlice';
import UsersList from '../../components/UserList';
import { server } from '../../mocks/server';

const createStore = () => configureStore({ reducer: { users: usersReducer } });

const renderWithStore = (store = createStore()) =>
  render(
    <Provider store={store}>
      <UsersList />
    </Provider>
  );

describe('UsersList Integration', () => {
  test('shows loading state initially and then users', async () => {
    renderWithStore();

    expect(screen.getByText(/loading/i)).toBeInTheDocument();

    // Use regex to match partial text inside the <h3>
    await waitFor(() => {
      expect(screen.getByText(/Rahul Verma/)).toBeInTheDocument();
    });

    expect(screen.getByText(/Neha Patel/)).toBeInTheDocument();
    expect(screen.getByText(/rahul@example.com/)).toBeInTheDocument();
    expect(screen.getByText(/neha@example.com/)).toBeInTheDocument();
  });

  test('shows error message on API failure', async () => {
    server.use(
      http.get('https://api.freeapi.app/api/v1/public/randomusers', () => {
        return new HttpResponse(null, { status: 500 });
      })
    );

    renderWithStore();

    // Specifically wait for the error heading or the exact error message
    await waitFor(() => {
      expect(
        screen.getByRole('heading', { name: /error/i })
      ).toBeInTheDocument();
    });

    expect(screen.getByText(/Server error: 500/)).toBeInTheDocument();
  });

  test('retry button triggers new fetch on error', async () => {
    server.use(
      http.get('https://api.freeapi.app/api/v1/public/randomusers', () => {
        return new HttpResponse(null, { status: 500 });
      })
    );

    renderWithStore();

    const retryButton = await screen.findByRole('button', { name: /retry/i });

    // Override to success with valid picture URL
    server.use(
      http.get('https://api.freeapi.app/api/v1/public/randomusers', () => {
        return HttpResponse.json({
          data: {
            data: [
              {
                name: { title: 'Mr', first: 'Retry', last: 'Success' },
                email: 'retry@test.com',
                picture: { medium: 'https://via.placeholder.com/100' },
                phone: '1234567890',
                location: { city: 'Test', country: 'Test' },
                login: { uuid: '123' },
              },
            ],
          },
        });
      })
    );

    await userEvent.click(retryButton);

    await waitFor(() => {
      expect(screen.getByText(/Retry Success/)).toBeInTheDocument();
    });

    expect(screen.queryByText(/error/i)).not.toBeInTheDocument();
  });

  test('shows empty state when no users returned', async () => {
    server.use(
      http.get('https://api.freeapi.app/api/v1/public/randomusers', () => {
        return HttpResponse.json({ data: { data: [] } });
      })
    );

    renderWithStore();

    await waitFor(() => {
      expect(screen.getByText(/no users found/i)).toBeInTheDocument();
    });
  });

  test('renders user images with correct alt text', async () => {
    renderWithStore();

    await waitFor(() => {
      const img = screen.getByAltText('Rahul Verma');
      expect(img).toBeInTheDocument();
    });
  });
});
