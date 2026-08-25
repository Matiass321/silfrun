import type { APIRoute } from 'astro';
import { requireAdmin, env } from '~/lib/admin-guard';
import { upsertCustomer, createVisit, normalisePhone, type VisitWindow, VISIT_WINDOWS } from '~/lib/visits';

export const prerender = false;

/** Creates a customer (or reuses one by phone) and a visit against them. */
export const POST: APIRoute = async (context) => {
  const gate = await requireAdmin(context);
  if (gate) return gate;

  const { DB } = env(context);
  const fail = (code: string) => context.redirect(`/admin/new-visit/?e=${code}`, 303);

  if (!DB) return fail('nodb');

  const form = await context.request.formData();

  const name = String(form.get('name') ?? '').trim();
  const phone = normalisePhone(String(form.get('phone') ?? ''));
  const preferred_date = String(form.get('preferred_date') ?? '').trim();

  if (!name) return fail('name');
  if (!phone) return fail('phone');
  if (!/^\d{4}-\d{2}-\d{2}$/.test(preferred_date)) return fail('date');

  const windowRaw = String(form.get('window') ?? 'morning');
  const window: VisitWindow = VISIT_WINDOWS.includes(windowRaw as VisitWindow)
    ? (windowRaw as VisitWindow)
    : 'morning';

  const area = String(form.get('area') ?? '').trim() || null;

  const customer_id = await upsertCustomer(DB, {
    name,
    phone,
    email: String(form.get('email') ?? '').trim() || null,
    area,
  });

  const ref = await createVisit(DB, {
    customer_id,
    preferred_date,
    window,
    items: form.getAll('items').map(String),
    address: String(form.get('address') ?? '').trim() || null,
    area,
    notes: String(form.get('notes') ?? '').trim() || null,
    locale: 'is',
  });

  return context.redirect(`/admin/visits/?ref=${encodeURIComponent(ref)}&saved=1`, 303);
};
