import { useEffect, useState } from 'react';
import identityIcon from '../../assets/icon-identity.svg';
import offersIcon from '../../assets/icon-offers.svg';
import setupIcon from '../../assets/icon-setup.svg';
import { BrandMark } from '../../components/BrandMark';
import { Button } from '../../components/Button';
import { Screen } from '../../components/Screen';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';
import { JOURNEY_STEPS } from '../data';
import './StepsIntroScreen.css';

const STEP_ICONS = {
  setup: { src: setupIcon, width: 31.993, height: 36 },
  identity: { src: identityIcon, width: 36.002, height: 36.001 },
  offers: { src: offersIcon, width: 35.956, height: 35.969 },
} as const;

/** Prototype: each card stays open for 0.8 s after a ~1 s transition, then the next one opens. */
const CYCLE_MS = 1800;

type StepsIntroScreenProps = {
  onStart: () => void;
};

/**
 * Figma "Step doing - Animation". With reduced motion the cards stay open,
 * which matches the static "Step doing" frame.
 */
export function StepsIntroScreen({ onStart }: StepsIntroScreenProps) {
  const reducedMotion = usePrefersReducedMotion();
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (reducedMotion) return;
    const timer = window.setInterval(() => {
      setActiveIndex((index) => (index + 1) % JOURNEY_STEPS.length);
    }, CYCLE_MS);
    return () => window.clearInterval(timer);
  }, [reducedMotion]);

  return (
    <Screen footer={<Button onClick={onStart}>Start Now</Button>}>
      <div className="brand-header">
        <BrandMark />
        <h1 className="steps-intro__subtitle">Just 3 steps to get your credit card</h1>
      </div>

      <ol className="step-cards">
        {JOURNEY_STEPS.map((step, index) => {
          const icon = STEP_ICONS[step.id];
          return (
            <li key={step.id} className="step-card" data-active={reducedMotion || index === activeIndex || undefined}>
              <div className="step-card__collapse step-card__collapse--icon" aria-hidden="true">
                <div>
                  <span className="step-card__icon">
                    <img src={icon.src} width={icon.width} height={icon.height} alt="" />
                  </span>
                </div>
              </div>
              <h2 className="step-card__title">{step.title}</h2>
              <div className="step-card__collapse">
                <div>
                  <ul className="step-card__items">
                    {step.items.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </li>
          );
        })}
      </ol>
    </Screen>
  );
}
