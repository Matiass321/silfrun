import type { APIRoute } from 'astro';
import { requireAdmin, env, resolvePasswordHash, PASSWORD_KEY } from '~/lib/admin-guard';
import { hashPassword, verifyPassword, setSetting } from '~/lib/auth';

export const prerender = false;

const MIN_LENGTH = 12;

/**
 * Change the admin password.
 *
 * Behind the session AND behind the current password. The session alone is not
 * enough: an unlocked phone left on a table should not be able to lock the
 * owner out of their own tool.
 */
export const POST: APIRoute = async (context) => {
  const gate = await requireAdmin(context);
  if (gate) return gate;

  const { DB, ADMIN_PASSWORD_HASH } = env(context);
  const fail = (code: string) => context.redirect(`/admin/settings/?e=${code}`, 303);

  if (!DB) return fail('nodb');

  const form = await context.request.formData();
  const current = String(form.get('current') ?? '');
  const password = String(form.get('password') ?? '');
  const confirm = String(form.get('confirm') ?? '');

  const existing = await resolvePasswordHash(DB, ADMIN_PASSWORD_HASH);
  if (!existing || !(await verifyPassword(current, existing))) return fail('wrong');

  if (password.length < MIN_LENGTH) return fail('short');
  if (password !== confirm) return fail('mismatch');

  await setSetting(DB, PASSWORD_KEY, await hashPassword(password));

  return context.redirect('/admin/settings/?saved=1', 303);
};
