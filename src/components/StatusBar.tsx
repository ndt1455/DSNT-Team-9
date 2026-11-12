import battery from '../assets/status-battery.svg';
import batteryLight from '../assets/status-battery-light.svg';
import cellular from '../assets/status-cellular.svg';
import cellularLight from '../assets/status-cellular-light.svg';
import wifi from '../assets/status-wifi.svg';
import wifiLight from '../assets/status-wifi-light.svg';
import './StatusBar.css';

type StatusBarProps = {
  tone?: 'dark' | 'light';
};

/** Mock iPhone status bar from Figma. Shown only inside the desktop device frame. */
export function StatusBar({ tone = 'dark' }: StatusBarProps) {
  const light = tone === 'light';

  return (
    <div className={`status-bar status-bar--${tone}`} aria-hidden="true">
      <div className="status-bar__time">9:41</div>
      <div className="status-bar__island" />
      <div className="status-bar__levels">
        <img src={light ? cellularLight : cellular} width={19.2} height={12.226} alt="" />
        <img src={light ? wifiLight : wifi} width={17.142} height={12.328} alt="" />
        <img src={light ? batteryLight : battery} width={27.328} height={13} alt="" />
      </div>
    </div>
  );
}
