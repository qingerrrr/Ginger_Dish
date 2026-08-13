import logo from "../../../Images/logo.png";

export default function Header() {
  return (
    <header className="flex items-center justify-between gap-3 md:mb-9">
      <div className="flex min-w-0 items-center mt-2.5 mb-[30px]">
        <div className="w-[clamp(58px,17vw,74px)] shrink-0 aspect-square overflow-hidden md:w-28 lg:w-[120px]"><img className="block size-full object-contain" src={logo} alt="GingerDish penguin chef mascot" /></div>
        <div className="min-w-0">
          <h1 className="mb-[3px] pl-2.5 whitespace-nowrap text-ginger-red-dark font-ginger-heading text-[clamp(1.9rem,9vw,2.35rem)] leading-[.82] font-bold tracking-[-.045em] md:text-[4.4rem] lg:text-[4.5rem]">GINGER DISH</h1>
          <p className="ml-2.5 whitespace-nowrap text-ginger-muted font-ginger-body text-[clamp(.76rem,3.4vw,1rem)] leading-[1.4]">From qing's little kitchen to you</p>
        </div>
      </div>
    </header>
  );
}
