import type { APIRoute } from 'astro';
import { clearCookie } from '~/lib/auth';

export const prerender = false;

/** POST only: a GET logout can be triggered by any image tag on any page. */
export const POST: APIRoute = () =>
  new Response(null, {
    status: 303,
    headers: {
      Location: '/admin/login/',
      'Set-Cookie': clearCookie(),
      'Cache-Control': 'no-store',
    },
  });
