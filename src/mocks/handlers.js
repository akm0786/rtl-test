import { http, HttpResponse } from 'msw';

// Tumhare API ka base URL
const API_URL = 'https://api.freeapi.app/api/v1/public/randomusers';

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
              medium: 'https://randomuser.me/api/portraits/men/1.jpg' 
            },
            location: { 
              city: 'Bangalore', 
              country: 'India' 
            },
            login: { uuid: 'rahul-123' }
          },
          {
            name: { title: 'Ms', first: 'Neha', last: 'Patel' },
            email: 'neha@example.com',
            phone: '8888888888',
            picture: { 
              medium: 'https://randomuser.me/api/portraits/women/2.jpg' 
            },
            location: { 
              city: 'Mumbai', 
              country: 'India' 
            },
            login: { uuid: 'neha-456' }
          }
        ]
      }
    });
  }),
];