import type { APIRoute } from 'astro';
import { env } from '~/lib/admin-guard';
import { record } from '~/lib/analytics';

export const prerender = false;

/**
 * The holding page's email signup.
 *
 * Deliberately forgiving about what it accepts and deliberately vague about
 * what it reports. Somebody who has already signed up gets the same thank-you
 * as somebody new: the alternative is a page that tells any passer-by whether
 * a given address is on the list, which is a disclosure nobody asked for and
 * gains the business nothing.
 *
 * No confirmation email is sent yet — nothing is wired to a mail provider. The
 * row is stored unconfirmed, which is the correct state for an address that
 * has been typed but not verified, and means the double opt-in the schema was
 * built for can be switched on later without a migration or a data fix.
 */
export const POST: APIRoute = async (context) => {
  const { DB } = env(context) as { DB?: D1Database };

  const form = await context.request.formData();
  const email = String(form.get('email') ?? '').trim().toLowerCase();
  const locale = String(form.get('locale') ?? 'is') === 'en' ? 'en' : 'is';

  const back = (q: string) => context.redirect('/' + q, 303);

  /**
   * One check, and a loose one.
   *
   * Something before an @, something after it, a dot in the domain. Every
   * stricter rule invented for this either rejects a valid address — plus
   * addressing, new TLDs, apostrophes — or fails to catch a typo it was
   * supposed to. The address is verified by sending to it, not by a regex.
   */
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email) || email.length > 254) {
    return back('?s=bad#join');
  }

  if (!DB) return back('?s=err#join');

  try {
    const token = crypto.randomUUID();
    await DB.prepare(
      `INSERT INTO subscribers (email, locale, token, source)
       VALUES (?, ?, ?, 'coming-soon')
       ON CONFLICT(email) DO UPDATE SET
         unsubscribed_at = NULL,
         locale = excluded.locale`
    ).bind(email, locale, token).run();

    await record(DB, context.request, { kind: 'subscribe', path: '/', locale });
  } catch {
    return back('?s=err#join');
  }

  return back('?s=ok#join');
};
