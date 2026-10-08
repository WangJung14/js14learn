const safeProtocol = /^(?:https?|ircs?|mailto|xmpp)$/i;

/**
 * Make a URL safe following GitHub and react-markdown security standards.
 * Blocks dangerous schemes (javascript:, data:text/html, etc.) while allowing http, https, mailto, and relative paths.
 */
export function defaultUrlTransform(value: string): string {
  if (!value) return '';

  const colon = value.indexOf(':');
  const questionMark = value.indexOf('?');
  const numberSign = value.indexOf('#');
  const slash = value.indexOf('/');

  if (
    // If there is no protocol, it's relative.
    colon === -1 ||
    // If the first colon is after a `?`, `#`, or `/`, it's not a protocol.
    (slash !== -1 && colon > slash) ||
    (questionMark !== -1 && colon > questionMark) ||
    (numberSign !== -1 && colon > numberSign) ||
    // It is an allowed protocol.
    safeProtocol.test(value.slice(0, colon))
  ) {
    return value;
  }

  return '';
}
