import type { APIRoute } from 'astro';
import { requireAdmin, env } from '~/lib/admin-guard';

export const prerender = false;

/**
 * Clears recorded events.
 *
 * Every site accumulates a period of its own making: the build, the preview
 * deployments, the person testing the contact button forty times. Those rows
 * are indistinguishable from enquiries in a bar chart, and a business reading
 * that chart is deciding where to spend money.
 *
 * So the operator gets a reset rather than a support request. It clears the
 * events table only — visits, customers and media are real records and are
 * never touched from here.
 */
export const POST: APIRoute = async (context) => {
  const gate = await requireAdmin(context);
  if (gate) return gate;

  const { DB } = env(context);
  if (!DB) return new Response('No database binding.', { status: 503 });

  const form = await context.request.formData();
  if (String(form.get('action')) !== 'reset') {
    return context.redirect('/admin/stats/', 303);
  }

  const res = await DB.prepare('DELETE FROM events').run();
  const n = res.meta.changes ?? 0;

  return context.redirect('/admin/stats/?cleared=' + n, 303);
};
