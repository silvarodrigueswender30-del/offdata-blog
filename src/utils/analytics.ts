/**
 * src/utils/analytics.ts
 *
 * Copiado de SITE/src/utils/analytics.js.
 * Adaptação: tipagem TypeScript e declaração de window.gtag.
 * Lógica de tracking inalterada em relação ao original.
 */

// Declaração do gtag global injetado pelo snippet do GA4
declare global {
  interface Window {
    gtag?: (
      command: string,
      eventName: string,
      params?: Record<string, unknown>
    ) => void;
  }
}

/**
 * Helper para eventos do Google Analytics 4 (GA4).
 * Envia eventos via gtag.js caso disponível globalmente.
 */
export const trackEvent = (
  eventName: string,
  params: Record<string, unknown> = {}
): void => {
  if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
    window.gtag('event', eventName, params);
  } else if (import.meta.env.DEV) {
    // Em desenvolvimento, loga no console em vez de silenciar
    // (substitui process.env.NODE_ENV === 'development' do original CRA)
    console.log(`[GA4 Event] ${eventName}`, params);
  }
};
