import { useEffect, useRef, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

/** Generate or retrieve a persistent session ID */
function getSessionId(): string {
  const key = 'zax_session_id';
  let id = sessionStorage.getItem(key);
  if (!id) {
    id = crypto.randomUUID?.() || `${Date.now()}-${Math.random().toString(36).slice(2)}`;
    sessionStorage.setItem(key, id);
  }
  return id;
}

/** Log an activity event to user_activity_logs */
async function logActivity(params: {
  action_type: string;
  page_path: string;
  click_target?: string;
  duration_seconds?: number;
  metadata?: Record<string, unknown>;
}) {
  try {
    await supabase.from('user_activity_logs' as any).insert({
      session_id: getSessionId(),
      action_type: params.action_type,
      page_path: params.page_path,
      click_target: params.click_target || null,
      duration_seconds: params.duration_seconds || null,
      metadata: params.metadata || {},
    });
  } catch {
    // Silent fail — tracking should never break UX
  }
}

/**
 * Hook: auto-tracks page views + dwell time.
 * Returns a `trackClick` function for manual click tracking.
 */
export function useActivityTracker() {
  const location = useLocation();
  const enterTime = useRef(Date.now());

  // Log page view on route change
  useEffect(() => {
    enterTime.current = Date.now();
    logActivity({ action_type: 'page_view', page_path: location.pathname });

    // Log dwell time on leave
    return () => {
      const seconds = Math.round((Date.now() - enterTime.current) / 1000);
      if (seconds > 1) {
        logActivity({
          action_type: 'page_leave',
          page_path: location.pathname,
          duration_seconds: seconds,
        });
      }
    };
  }, [location.pathname]);

  // Also log dwell on tab hide / page unload
  useEffect(() => {
    const handleVisibility = () => {
      if (document.visibilityState === 'hidden') {
        const seconds = Math.round((Date.now() - enterTime.current) / 1000);
        if (seconds > 1) {
          // Use sendBeacon via fetch keepalive for reliability
          const body = JSON.stringify({
            session_id: getSessionId(),
            action_type: 'page_leave',
            page_path: location.pathname,
            duration_seconds: seconds,
            metadata: {},
          });
          // Best-effort — navigator.sendBeacon or fetch keepalive
          try {
            const url = `${import.meta.env.VITE_SUPABASE_URL}/rest/v1/user_activity_logs`;
            const headers: Record<string, string> = {
              'Content-Type': 'application/json',
              apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
              Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
            };
            navigator.sendBeacon?.(
              url,
              new Blob([body], { type: 'application/json' })
            ) || fetch(url, { method: 'POST', headers, body, keepalive: true });
          } catch {
            // ignore
          }
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibility);
    return () => document.removeEventListener('visibilitychange', handleVisibility);
  }, [location.pathname]);

  const trackClick = useCallback(
    (target: string, meta?: Record<string, unknown>) => {
      logActivity({
        action_type: 'click',
        page_path: location.pathname,
        click_target: target,
        metadata: meta,
      });
    },
    [location.pathname]
  );

  return { trackClick };
}
