import logo from "../../../Images/logo.png";

export default function Header() {
  return (
    <header className="site-header">
      <div className="brand">
        <div className="brand__logo-wrap"><img className="brand__logo" src={logo} alt="GingerDish penguin chef mascot" /></div>
        <div className="brand__copy">
          <h1>GINGER DISH</h1>
          <p>From qing's little kitchen to you</p>
        </div>
      </div>
    </header>
  );
}
