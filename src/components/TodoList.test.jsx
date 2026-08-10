import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { http, HttpResponse } from 'msw';
import todosReducer from '../features/todos/todosSlice';
import TodoList from './TodoList';
import { server } from '../mocks/server';

const TODO_API = 'https://api.freeapi.app/api/v1/todos';

const createStore = () =>
    configureStore({ reducer: { todos: todosReducer } });

const renderComponent = (store = createStore()) =>
    render(
        <Provider store={store}>
            <TodoList />
        </Provider>
    );

describe('TodoList Component', () => {
    test('loading dikhta hai phir todos render hote hain', async () => {
        renderComponent();

        // Pehle loading state
        expect(screen.getByText(/loading/i)).toBeInTheDocument();

        // Data aane ka wait karo (default MSW handler se)
        await waitFor(() => {
            expect(screen.getByText('Learn testing')).toBeInTheDocument();
        });
        expect(screen.getByText('Write integration tests')).toBeInTheDocument();
    });

    test('naya todo add kar sakte hain', async () => {
        renderComponent();
        // Loading complete hone do
        await waitFor(() => screen.getByText('Learn testing'));

        const input = screen.getByPlaceholderText(/add a new todo/i);
        const addButton = screen.getByRole('button', { name: /add/i });

        await userEvent.type(input, 'Buy milk');
        await userEvent.click(addButton);

        // Naya todo list me aana chahiye
        await waitFor(() => {
            expect(screen.getByText('Buy milk')).toBeInTheDocument();
        });
    });

    test('todo ko toggle kar sakte hain (complete/incomplete)', async () => {
        // Override toggle handler sirf is test ke liye
        server.use(
            http.patch(`${TODO_API}/toggle/status/:id`, ({ params }) => {
                // Realistic response with full todo object
                if (params.id === '1') {
                    return HttpResponse.json({
                        data: {
                            _id: '1',
                            title: 'Learn testing',
                            isComplete: true,
                        },
                    });
                }
                return new HttpResponse(null, { status: 404 });
            })
        );

        renderComponent();
        await waitFor(() => screen.getByText('Learn testing'));

        // 'Done' button click karo (kyunki abhi complete false hai)
        const doneButton = screen.getAllByRole('button', { name: /done/i })[0];
        await userEvent.click(doneButton);

        // Ab text strikethrough ho jana chahiye
        await waitFor(() => {
            const todoText = screen.getByText('Learn testing');
            expect(todoText).toHaveStyle('text-decoration: line-through');
        });
    });

    test('todo delete kar sakte hain', async () => {
        renderComponent();
        await waitFor(() => screen.getByText('Learn testing'));

        const deleteButton = screen.getAllByRole('button', { name: /delete/i })[0];
        await userEvent.click(deleteButton);

        // Element gayab ho jana chahiye
        await waitFor(() => {
            expect(screen.queryByText('Learn testing')).not.toBeInTheDocument();
        });
    });

    test('API fail hone par error message dikhta hai', async () => {
        // Sirf is test ke liye GET /todos fail karo
        server.use(
            http.get(TODO_API, () => new HttpResponse(null, { status: 500 }))
        );

        renderComponent();
        await waitFor(() => {
            expect(screen.getByText(/error/i)).toBeInTheDocument();
        });
    });
});