import { useActivityTracker } from '@/hooks/useActivityTracker';
import { createContext, useContext } from 'react';

type TrackClickFn = (target: string, meta?: Record<string, unknown>) => void;

const ActivityContext = createContext<TrackClickFn>(() => {});

export const useTrackClick = () => useContext(ActivityContext);

export function ActivityTrackerProvider({ children }: { children: React.ReactNode }) {
  const { trackClick } = useActivityTracker();
  return (
    <ActivityContext.Provider value={trackClick}>
      {children}
    </ActivityContext.Provider>
  );
}
