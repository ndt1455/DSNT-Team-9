import { useCallback, useEffect, useRef, useState } from 'react';

/** `back` after a header back button, the browser back button or a rewind; `forward` otherwise. */
export type NavigationDirection = 'forward' | 'back';

export type NavigateOptions = {
  /** Swap the current history entry instead of adding one, e.g. when a scan step turns into its review step. */
  replace?: boolean;
};

/** Saved in `history.state`: every screen from the first entry up to this one, so back targets survive a reload. */
type HistoryState<T extends string> = { trail: T[] };

type ScreenHistoryOptions<T extends string> = {
  /** Screen shown when the URL hash is not a known screen. */
  initial: T;
  /** Where each header back button goes. Screens without an entry have no back button. */
  backTargets: Partial<Record<T, T>>;
};

function screenFromHash<T extends string>(screens: readonly T[]): T | null {
  const id = window.location.hash.slice(1);
  return (screens as readonly string[]).includes(id) ? (id as T) : null;
}

function readTrail<T extends string>(screens: readonly T[]): T[] | null {
  const state: unknown = window.history.state;
  if (!state || typeof state !== 'object' || !('trail' in state) || !Array.isArray(state.trail)) return null;
  const trail: unknown[] = state.trail;
  const known = trail.length > 0 && trail.every((id) => (screens as readonly unknown[]).includes(id));
  return known ? (trail as T[]) : null;
}

function writeTrail<T extends string>(trail: T[], mode: 'push' | 'replace') {
  const state: HistoryState<T> = { trail };
  const url = `#${trail[trail.length - 1]}`;
  if (mode === 'push') {
    window.history.pushState(state, '', url);
  } else {
    window.history.replaceState(state, '', url);
  }
}

/**
 * Keeps the current screen in the URL hash and browser history, so the browser back button,
 * reloads and `#screen` links work across the whole journey.
 */
export function useScreenHistory<T extends string>(
  screens: readonly T[],
  { initial, backTargets }: ScreenHistoryOptions<T>,
) {
  const [current, setCurrent] = useState<{ screen: T; direction: NavigationDirection }>(() => ({
    screen: screenFromHash(screens) ?? initial,
    direction: 'forward',
  }));
  // The current entry's trail, read by the callbacks below so they can stay stable.
  const trailRef = useRef<T[]>([current.screen]);

  const show = useCallback((trail: T[], direction: NavigationDirection) => {
    trailRef.current = trail;
    setCurrent({ screen: trail[trail.length - 1], direction });
  }, []);

  useEffect(() => {
    const shown = trailRef.current[trailRef.current.length - 1];
    const saved = readTrail(screens);
    const trail = saved && saved[saved.length - 1] === shown ? saved : [shown];
    writeTrail(trail, 'replace');
    trailRef.current = trail;

    const handlePopState = () => {
      const next = readTrail(screens);
      if (next) {
        show(next, next.length > trailRef.current.length ? 'forward' : 'back');
        return;
      }
      // A hash typed into the address bar: treat it as a step forward.
      const typed = [...trailRef.current, screenFromHash(screens) ?? initial];
      writeTrail(typed, 'replace');
      show(typed, 'forward');
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [initial, screens, show]);

  const navigate = useCallback(
    (next: T, { replace = false }: NavigateOptions = {}) => {
      const base = trailRef.current;
      const trail = replace ? [...base.slice(0, -1), next] : [...base, next];
      writeTrail(trail, replace ? 'replace' : 'push');
      show(trail, 'forward');
    },
    [show],
  );

  /** Goes back through history to the latest earlier entry for `target`, or swaps the current entry when there is none. */
  const rewindTo = useCallback(
    (target: T) => {
      const trail = trailRef.current;
      const last = trail.length - 1;
      if (trail[last] === target) return;

      for (let index = last - 1; index >= 0; index -= 1) {
        if (trail[index] === target) {
          window.history.go(index - last);
          return;
        }
      }

      const swapped = [...trail.slice(0, -1), target];
      writeTrail(swapped, 'replace');
      show(swapped, 'back');
    },
    [show],
  );

  const goBack = useCallback(() => {
    const target = backTargets[trailRef.current[trailRef.current.length - 1]];
    if (target) rewindTo(target);
  }, [backTargets, rewindTo]);

  return { screen: current.screen, direction: current.direction, navigate, goBack, rewindTo };
}
