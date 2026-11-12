import fingerScan from '../../assets/icon-finger-scan.svg';
import moneySend from '../../assets/icon-money-send.svg';
import personalCard from '../../assets/icon-personalcard.svg';
import tick from '../../assets/icon-tick.svg';
import activeCircle from '../../assets/step-active-circle.svg';
import defaultCircle from '../../assets/step-default-circle.svg';
import doneCircle from '../../assets/step-done-circle.svg';
import { BrandMark } from '../../components/BrandMark';
import { Button } from '../../components/Button';
import { Screen } from '../../components/Screen';
import { JOURNEY_STEPS } from '../data';
import './StepStatusScreen.css';

type StepState = 'done' | 'active' | 'upcoming';

const STEP_STATES: StepState[] = ['done', 'active', 'upcoming'];

const STATE_TEXT: Record<StepState, string> = {
  done: 'Completed',
  active: 'Current step',
  upcoming: 'Not started',
};

const SYMBOLS: Record<StepState, { circle: string; icon: string }> = {
  done: { circle: doneCircle, icon: tick },
  active: { circle: activeCircle, icon: fingerScan },
  upcoming: { circle: defaultCircle, icon: moneySend },
};

type StepStatusScreenProps = {
  onContinue: () => void;
};

/** Figma "Step Status": step 1 done, step 2 next. */
export function StepStatusScreen({ onContinue }: StepStatusScreenProps) {
  return (
    <Screen background="status" footer={<Button onClick={onContinue}>Continue</Button>}>
      <div className="brand-header brand-header--start">
        <BrandMark />
        <h1 className="step-status__title">Great! You&apos;ve completed step 1</h1>
      </div>

      <div className="step-status">
        <ol className="stepper">
          {JOURNEY_STEPS.map((step, index) => {
            const state = STEP_STATES[index];
            const symbol = SYMBOLS[state];
            return (
              <li
                key={step.id}
                className={`stepper__step stepper__step--${state}`}
                aria-current={state === 'active' ? 'step' : undefined}
              >
                <div className="stepper__head">
                  <span className="stepper__symbol" aria-hidden="true">
                    <img className="stepper__circle" src={symbol.circle} width={32} height={32} alt="" />
                    <img className="stepper__icon" src={symbol.icon} width={20} height={20} alt="" />
                  </span>
                  <h2 className="stepper__title">
                    {step.title}
                    <span className="visually-hidden">, {STATE_TEXT[state]}</span>
                  </h2>
                </div>
                <div className="stepper__body">
                  <span className="stepper__trail" aria-hidden="true" />
                  <ul className="stepper__items">
                    {step.items.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
              </li>
            );
          })}
        </ol>

        <div className="step-status__toast">
          <img src={personalCard} width={24} height={24} alt="" />
          <p>Please have your ID Card ready</p>
        </div>
      </div>
    </Screen>
  );
}
