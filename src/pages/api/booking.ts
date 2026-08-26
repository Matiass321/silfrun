import type { APIRoute } from 'astro';
import { env } from '~/lib/admin-guard';
import { checkThrottle } from '~/lib/auth';
import { record } from '~/lib/analytics';
import { upsertCustomer, createVisit, normalisePhone, VISIT_WINDOWS, type VisitWindow } from '~/lib/visits';
import { SITE } from '~/config/site';

export const prerender = false;

const SERVICE_KEYS = ['sofa', 'rug', 'carpet', 'stains'];

/**
 * Public booking.
 *
 * Writes straight into the same `visits` table the admin reads, so an enquiry
 * sent at midnight is on the dashboard before anyone opens it — no inbox to
 * transcribe from, and nothing to lose.
 *
 * A plain form post rather than fetch(): the marketing pages ship no
 * JavaScript, and an enquiry form that only works with JS enabled is an
 * enquiry form that silently fails for some people.
 */
export const POST: APIRoute = async (context) => {
  const { DB } = env(context);

  const form = await context.request.formData();
  const locale = String(form.get('locale') ?? 'is') === 'en' ? 'en' : 'is';

  /**
   * Both outcomes land on /booking-received/, which is rendered on demand.
   *
   * The quote page is prerendered, so a banner keyed off its query string
   * could never appear there — the HTML was fixed at build time.
   */
  const back = (code: string) =>
    context.redirect(`/booking-received/?lang=${locale}&e=${code}`, 303);

  if (!DB) return back('down');

  /**
   * Honeypot. A field no human sees, and every naive bot fills in.
   *
   * Answered with the same success redirect a real submission gets rather than
   * an error — telling a bot it was detected is how it learns to stop filling
   * the field.
   */
  if (String(form.get('company') ?? '').trim() !== '') {
    return context.redirect(`/booking-received/?lang=${locale}&ref=S-0000`, 303);
  }

  const ip =
    context.request.headers.get('CF-Connecting-IP') ??
    context.request.headers.get('x-forwarded-for') ??
    'unknown';

  /**
   * Five enquiries an hour from one address is far above genuine use.
   *
   * Wrapped, because checkThrottle issues a CREATE TABLE and two statements of
   * its own. It sat outside the try below, so a D1 hiccup here returned a bare
   * 500 instead of the page that tells the visitor to use WhatsApp. Losing an
   * enquiry is worse than serving one extra bot, so a throttle that cannot be
   * read lets the request through.
   */
  try {
    const { allowed } = await checkThrottle(DB, `booking:${ip}`, 5, 3600);
    if (!allowed) return back('rate');
  } catch {
    /* fall through */
  }

  const name = String(form.get('name') ?? '').trim();
  const phone = normalisePhone(String(form.get('phone') ?? ''));
  const preferred_date = String(form.get('preferred_date') ?? '').trim();

  if (name.length < 2) return back('name');
  if (phone.length < 7) return back('phone');
  if (!/^\d{4}-\d{2}-\d{2}$/.test(preferred_date)) return back('date');

  /* A date in the past is a typo, not a request. */
  const todayIso = new Date().toISOString().slice(0, 10);
  if (preferred_date < todayIso) return back('past');

  const windowRaw = String(form.get('window') ?? 'either');
  const win: VisitWindow = VISIT_WINDOWS.includes(windowRaw as VisitWindow)
    ? (windowRaw as VisitWindow)
    : 'either';

  /* Only accept area names the site actually publishes. */
  const areaRaw = String(form.get('area') ?? '').trim();
  const area = SITE.areas.some((a) => a.name === areaRaw) ? areaRaw : null;

  const items = form.getAll('items').map(String).filter((k) => SERVICE_KEYS.includes(k));

  const email = String(form.get('email') ?? '').trim();
  const notes = String(form.get('notes') ?? '').trim().slice(0, 2000);

  try {
    const customer_id = await upsertCustomer(DB, {
      name: name.slice(0, 120),
      phone,
      email: email && email.includes('@') ? email.slice(0, 160) : null,
      area,
    });

    const ref = await createVisit(DB, {
      customer_id,
      preferred_date,
      window: win,
      items,
      address: String(form.get('address') ?? '').trim().slice(0, 240) || null,
      area,
      notes: notes || null,
      locale,
    });

    /* The funnel's final step. Without this the stats page reports zero
       bookings for ever, because nothing else ever records this kind. */
    await record(DB, context.request, { kind: 'booking', path: `/${locale}/`, locale });

    return context.redirect(`/booking-received/?lang=${locale}&ref=${encodeURIComponent(ref)}`, 303);
  } catch {
    return back('down');
  }
};
