import { useEffect, useId, useRef, useState } from 'react';
import type { MouseEvent, PointerEvent } from 'react';
import arrowRight from '../assets/icon-arrow-right.svg';
import checkSuccess from '../assets/icon-check-success.svg';
import './SwipeSlider.css';

const HANDLE_SIZE = 60;
/** Share of the track the handle must pass before release confirms. */
const CONFIRM_THRESHOLD = 0.85;
/** Time the Success state stays on screen before `onConfirm` runs. */
const CONFIRM_DELAY_MS = 450;

type SwipeSliderProps = {
  label: string;
  disabled?: boolean;
  onConfirm: () => void;
};

type Drag = {
  pointerId: number;
  startX: number;
  startOffset: number;
  maxOffset: number;
};

/**
 * Figma "SwipeSlider" (Default, Anim, Success, Disable).
 * Drag the handle to the end, or focus it and press Enter or Space.
 */
export function SwipeSlider({ label, disabled = false, onConfirm }: SwipeSliderProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<Drag | null>(null);
  const offsetRef = useRef(0);
  const timerRef = useRef<number | undefined>(undefined);
  const [offset, setOffsetState] = useState(0);
  const [progress, setProgress] = useState(0);
  const [dragging, setDragging] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const hintId = useId();

  useEffect(() => () => window.clearTimeout(timerRef.current), []);

  const getMaxOffset = () => Math.max(0, (trackRef.current?.clientWidth ?? 0) - HANDLE_SIZE);

  const setOffset = (value: number, max: number) => {
    offsetRef.current = value;
    setOffsetState(value);
    setProgress(max > 0 ? value / max : 0);
  };

  const confirm = () => {
    if (confirmed || disabled) return;
    const max = getMaxOffset();
    dragRef.current = null;
    setDragging(false);
    setOffset(max, max);
    setConfirmed(true);
    timerRef.current = window.setTimeout(onConfirm, CONFIRM_DELAY_MS);
  };

  const handlePointerDown = (event: PointerEvent<HTMLButtonElement>) => {
    if (disabled || confirmed || event.button !== 0) return;
    event.currentTarget.setPointerCapture(event.pointerId);
    dragRef.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startOffset: offsetRef.current,
      maxOffset: getMaxOffset(),
    };
    setDragging(true);
  };

  const handlePointerMove = (event: PointerEvent<HTMLButtonElement>) => {
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== event.pointerId) return;
    const next = Math.min(Math.max(drag.startOffset + event.clientX - drag.startX, 0), drag.maxOffset);
    setOffset(next, drag.maxOffset);
  };

  const handlePointerEnd = (event: PointerEvent<HTMLButtonElement>) => {
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== event.pointerId) return;
    dragRef.current = null;
    if (drag.maxOffset > 0 && offsetRef.current >= drag.maxOffset * CONFIRM_THRESHOLD) {
      confirm();
      return;
    }
    setDragging(false);
    setOffset(0, drag.maxOffset);
  };

  // Keyboard activation fires a click with `detail === 0`. Pointer clicks must drag instead.
  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    if (event.detail === 0) confirm();
  };

  const state = confirmed ? 'success' : disabled ? 'disabled' : 'idle';
  const labelOpacity = confirmed ? 0 : dragging ? Math.max(0, 1 - progress * 2) : undefined;

  return (
    <div ref={trackRef} className="swipe" data-state={state} data-dragging={dragging || undefined}>
      {state === 'idle' && <span className="swipe__shimmer" aria-hidden="true" />}
      <span className="swipe__label" style={{ opacity: labelOpacity }} aria-hidden="true">
        {label}
      </span>
      <button
        type="button"
        className="swipe__handle"
        style={{ transform: `translateX(${offset}px)` }}
        disabled={disabled}
        aria-label={label}
        aria-describedby={hintId}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerEnd}
        onPointerCancel={handlePointerEnd}
        onLostPointerCapture={handlePointerEnd}
        // A native image drag would cancel the pointer stream mid-swipe.
        onDragStart={(event) => event.preventDefault()}
        onClick={handleClick}
      >
        <span className="swipe__knob">
          <img src={confirmed ? checkSuccess : arrowRight} width={20} height={20} alt="" draggable={false} />
        </span>
      </button>
      <span id={hintId} className="visually-hidden">
        {confirmed ? 'Confirmed' : 'Drag to the end or press Enter to confirm'}
      </span>
    </div>
  );
}
