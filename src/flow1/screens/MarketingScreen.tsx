import { AppHeader } from '../../components/AppHeader';
import { ProgressBar } from '../../components/ProgressBar';
import { Screen } from '../../components/Screen';
import { SwipeSlider } from '../../components/SwipeSlider';
import { Toggle } from '../../components/Toggle';

type MarketingScreenProps = {
  marketingOptIn: boolean;
  personalInfoAccess: boolean;
  onMarketingOptInChange: (checked: boolean) => void;
  onPersonalInfoAccessChange: (checked: boolean) => void;
  onBack: () => void;
  onConfirm: () => void;
};

const OPTIONS = [
  {
    id: 'marketing',
    title: 'Marketing Communications',
    description: 'Receive notifications about loan approval status and special offers',
  },
  {
    id: 'pia',
    title: 'Personal Information Access',
    description: 'Collect and process personal data',
  },
] as const;

/** Figma "Marketing & PIA". Both toggles are optional, so the slider is always enabled. */
export function MarketingScreen({
  marketingOptIn,
  personalInfoAccess,
  onMarketingOptInChange,
  onPersonalInfoAccessChange,
  onBack,
  onConfirm,
}: MarketingScreenProps) {
  const values = { marketing: marketingOptIn, pia: personalInfoAccess };
  const handlers = { marketing: onMarketingOptInChange, pia: onPersonalInfoAccessChange };

  return (
    <Screen
      progress={<ProgressBar value={50} label="Set up profile progress" />}
      header={<AppHeader eyebrow="Set up profile" title="Marketing & PIA" onBack={onBack} />}
      footer={<SwipeSlider label="Swipe to confirm" onConfirm={onConfirm} />}
    >
      <div className="panel-stack">
        {OPTIONS.map((option) => (
          <section key={option.id} className="panel" aria-labelledby={`${option.id}-title`}>
            <div className="panel__row">
              <h2 id={`${option.id}-title`} className="panel__title">
                {option.title}
              </h2>
              <Toggle
                checked={values[option.id]}
                onChange={handlers[option.id]}
                labelledBy={`${option.id}-title`}
                describedBy={`${option.id}-description`}
              />
            </div>
            <div className="panel__note">
              <p id={`${option.id}-description`}>{option.description}</p>
            </div>
          </section>
        ))}
      </div>
    </Screen>
  );
}
