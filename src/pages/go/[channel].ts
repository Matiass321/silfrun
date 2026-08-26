import type { APIRoute } from 'astro';
import { env } from '~/lib/admin-guard';
import { record, OUTBOUND_KINDS, type EventKind } from '~/lib/analytics';
import { SITE, whatsappUrl, messengerUrl, isPlaceholder } from '~/config/site';

export const prerender = false;

/**
 * Outbound click tracking, without a line of JavaScript.
 *
 * A contact link points here instead of straight at WhatsApp; this logs the
 * click and forwards. It is the only way to know how many people actually
 * press the button on a site that runs no scripts — and knowing that is the
 * difference between "the page gets traffic" and "the page produces enquiries".
 *
 * The destination is never taken from the query string. It is looked up from
 * site config by channel name, so this can never be turned into an open
 * redirect that lends the domain's reputation to someone else's link.
 */
export const GET: APIRoute = async (context) => {
  const { DB } = env(context);

  const channel = String(context.params.channel ?? '').toLowerCase();
  if (!OUTBOUND_KINDS.includes(channel as EventKind)) {
    return new Response('Unknown channel.', { status: 404 });
  }

  const from = context.url.searchParams.get('p');
  const path = from && from.startsWith('/') ? from.slice(0, 200) : null;
  const locale = path?.startsWith('/en') ? 'en' : 'is';
  const text = context.url.searchParams.get('t') ?? undefined;

  let destination: string | null = null;
  switch (channel) {
    case 'whatsapp':
      destination = whatsappUrl(text);
      break;
    case 'messenger':
      destination = messengerUrl();
      break;
    case 'call':
      destination = isPlaceholder(SITE.contact.phoneE164) ? null : `tel:${SITE.contact.phoneE164}`;
      break;
    case 'email':
      destination = isPlaceholder(SITE.contact.email) ? null : `mailto:${SITE.contact.email}`;
      break;
  }

  /* Nothing configured for this channel: send them somewhere useful rather
     than showing an error for a button that should not have rendered. */
  if (!destination) {
    return context.redirect(`/${locale}/`, 302);
  }

  await record(DB, context.request, { kind: channel as EventKind, path, locale });

  return new Response(null, {
    status: 302,
    headers: {
      Location: destination,
      'Cache-Control': 'no-store, max-age=0',
      /* The click is already counted; do not leak our path to WhatsApp. */
      'Referrer-Policy': 'no-referrer',
    },
  });
};
