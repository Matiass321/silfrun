import type { APIRoute } from 'astro';
import { requireAdmin, env } from '~/lib/admin-guard';
import { updateVisit, deleteVisit, type VisitStatus, VISIT_STATUSES } from '~/lib/visits';
import { at } from '~/lib/time';

export const prerender = false;

/**
 * Updates one visit from the detail form.
 *
 * The scheduled time is only written when the status is 'scheduled'. Storing a
 * time against a cancelled or merely quoted visit would put it on the calendar
 * and in the day view, which is how a household gets a van it did not agree to.
 */
export const POST: APIRoute = async (context) => {
  const gate = await requireAdmin(context);
  if (gate) return gate;

  const { DB } = env(context);
  if (!DB) return new Response('No database binding.', { status: 503 });

  const form = await context.request.formData();
  const ref = String(form.get('ref') ?? '').trim();
  if (!ref) return context.redirect('/admin/visits/', 303);

  /**
   * Deletion is a POST with its own action, never a link.
   *
   * A GET that destroys a row is one prefetch, one crawler, or one browser
   * restoring tabs away from wiping a customer. The admin's confirm screen is
   * a GET; the thing it confirms is this.
   */
  if (String(form.get('action')) === 'delete') {
    const gone = await deleteVisit(DB, ref);
    return context.redirect(gone ? '/admin/visits/?deleted=1' : '/admin/visits/?missing=1', 303);
  }

  const statusRaw = String(form.get('status') ?? '');
  const status = VISIT_STATUSES.includes(statusRaw as VisitStatus)
    ? (statusRaw as VisitStatus)
    : undefined;

  const date = String(form.get('date') ?? '').trim();
  const time = String(form.get('time') ?? '').trim();

  let scheduled_at: number | null | undefined;
  if (status === 'scheduled' && date && time) {
    scheduled_at = at(date, time);
  } else if (status && status !== 'scheduled' && status !== 'done') {
    // Leaving 'done' alone keeps the record of when the work actually happened.
    scheduled_at = null;
  }

  const quoteRaw = String(form.get('quote_isk') ?? '').trim();
  const quote_isk = quoteRaw === '' ? null : Math.max(0, Math.round(Number(quoteRaw) || 0));

  await updateVisit(DB, ref, {
    ...(status ? { status } : {}),
    ...(scheduled_at !== undefined ? { scheduled_at } : {}),
    quote_isk,
    notes: String(form.get('notes') ?? '').trim() || null,
    address: String(form.get('address') ?? '').trim() || null,
  });

  return context.redirect(`/admin/visits/?ref=${encodeURIComponent(ref)}&saved=1`, 303);
};
