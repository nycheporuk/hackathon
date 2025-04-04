import signNowIcon from '~/assets/svg/SignNow.svg';
import './Header.scss';

export default function Header() {
  return (
    <div className="header">
      <img src={signNowIcon} />
      <h3>AI Agent</h3>
    </div>
  );
}
