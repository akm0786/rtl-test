import { http, HttpResponse } from 'msw';
import { server } from './server';

describe('MSW Setup Verification', () => {
  test('MSW intercepts API calls', async () => {
    // Direct fetch call karo
    const response = await fetch(
      'https://api.freeapi.app/api/v1/public/randomusers'
    );
    const data = await response.json();

    // Check karo mock data aaya
    expect(data.data.data).toHaveLength(2);
    expect(data.data.data[0].name.first).toBe('Rahul');
    expect(data.data.data[1].email).toBe('neha@example.com');
  });

  test('MSW handles server error', async () => {
    // Override handler for this test
    server.use(
      http.get('https://api.freeapi.app/api/v1/public/randomusers', () => {
        return new HttpResponse(null, {
          status: 500,
          statusText: 'Internal Server Error',
        });
      })
    );

    const response = await fetch(
      'https://api.freeapi.app/api/v1/public/randomusers'
    );

    expect(response.status).toBe(500);
    expect(response.statusText).toBe('Internal Server Error');
  });
});
