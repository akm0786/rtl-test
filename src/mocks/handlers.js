import { http, HttpResponse } from 'msw';

// Tumhare API ka base URL
const API_URL = 'https://api.freeapi.app/api/v1/public/randomusers';
const TODO_API = 'https://api.freeapi.app/api/v1/todos';

export const handlers = [
  // GET /randomusers - Success case
  http.get(API_URL, () => {
    return HttpResponse.json({
      data: {
        data: [
          {
            name: { title: 'Mr', first: 'Rahul', last: 'Verma' },
            email: 'rahul@example.com',
            phone: '9999999999',
            picture: {
              medium: 'https://randomuser.me/api/portraits/men/1.jpg',
            },
            location: {
              city: 'Bangalore',
              country: 'India',
            },
            login: { uuid: 'rahul-123' },
          },
          {
            name: { title: 'Ms', first: 'Neha', last: 'Patel' },
            email: 'neha@example.com',
            phone: '8888888888',
            picture: {
              medium: 'https://randomuser.me/api/portraits/women/2.jpg',
            },
            location: {
              city: 'Mumbai',
              country: 'India',
            },
            login: { uuid: 'neha-456' },
          },
        ],
      },
    });
  }),

  // ---- Todo handlers ----
  http.get(TODO_API, () => {
    return HttpResponse.json({
      data: [
        { _id: '1', title: 'Learn testing', isComplete: false },
        { _id: '2', title: 'Write integration tests', isComplete: true },
      ],
    });
  }),

  http.post(TODO_API, async ({ request }) => {
    const body = await request.json();
    return HttpResponse.json({ data: { _id: '3', ...body } }, { status: 201 });
  }),

  http.delete(`${TODO_API}/:id`, ({ params }) => {
    return HttpResponse.json({ data: { _id: params.id } });
  }),

  http.patch(`${TODO_API}/:id`, async ({ params, request }) => {
    const body = await request.json();
    return HttpResponse.json({
      data: { _id: params.id, ...body },
    });
  }),

  http.patch(`${TODO_API}/toggle/status/:id`, ({ params }) => {
    // Simple toggle logic for test
    return HttpResponse.json({
      data: { _id: params.id, isComplete: true },
    });
  }),
];
