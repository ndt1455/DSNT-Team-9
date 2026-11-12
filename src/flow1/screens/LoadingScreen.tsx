import { useEffect } from 'react';
import glow from '../../assets/loading-glow.svg';
import { Screen } from '../../components/Screen';
import './LoadingScreen.css';

/** Matches the prototype's 2 s splash before the product picker. */
const SPLASH_DURATION_MS = 2000;

type LoadingScreenProps = {
  onDone: () => void;
};

export function LoadingScreen({ onDone }: LoadingScreenProps) {
  useEffect(() => {
    const timer = window.setTimeout(onDone, SPLASH_DURATION_MS);
    return () => window.clearTimeout(timer);
  }, [onDone]);

  return (
    <Screen className="loading-screen" background="none" statusBarTone="light">
      <img className="loading-screen__glow" src={glow} width={684} height={1354} alt="" />
      <p className="visually-hidden" role="status">
        Loading Accer
      </p>
    </Screen>
  );
}
