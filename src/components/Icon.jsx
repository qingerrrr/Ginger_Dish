const paths = {
  cart: (
    <>
      <path d="M5.364 3.848C4 6 3 9.652 3 12.652V19a2 2 0 002 2h14a2 2 0 002-2v-5c0-2.334-1.816-4.668-2.622-7.002" />
      <path d="M7 3h11.379a2 2 0 011.789 1.106l.723 1.447A1 1 0 0119.997 7h-8.525a2 2 0 01-1.789-1.106L8.79 4.105a2 2 0 10-3.579 1.789l2.261 4.522A5 5 0 018 12.652V21" />
    </>
  ),
  search: <><circle cx="11" cy="11" r="7" /><path d="m20 20-4-4" /></>,
  back: <><path d="m15 18-6-6 6-6" /></>,
  bag: <><path d="M6 8h12l1 13H5L6 8Z" /><path d="M9 9V6a3 3 0 0 1 6 0v3" /></>,
  user: <><circle cx="12" cy="8" r="4" /><path d="M5 21a7 7 0 0 1 14 0" /></>,
  notes: <><path d="M6 3h12v18H6z" /><path d="M9 8h6M9 12h6M9 16h4" /></>,
  lock: <><rect x="5" y="10" width="14" height="11" rx="2" /><path d="M8 10V7a4 4 0 0 1 8 0v3" /></>,
  arrowRight: <><path d="M5 12h14M14 7l5 5-5 5" /></>,
  bowl: (
    <>
      <path d="M16.4 13.7A6.5 6.5 0 1 0 6.28 6.6c-1.1 3.13-.78 3.9-3.18 6.08A3 3 0 0 0 5 18c4 0 8.4-1.8 11.4-4.3" />
      <path d="m18.5 6 2.19 4.5a6.48 6.48 0 0 1-2.29 7.2C15.4 20.2 11 22 7 22a3 3 0 0 1-2.68-1.66L2.4 16.5" />
      <circle cx="12.5" cy="8.5" r="2.5" />
    </>
  ),
  cloche: <><path d="M4 10h16c0 6-3 9-8 9s-8-3-8-9ZM7 7c2-2 3 1 5-1s3 1 5-1" /><path d="M9 21h6" /></>,
  leaf: <><path d="M19 4C11 4 5 8 5 15c5 1 12-1 14-11Z" /><path d="M5 19c3-5 7-7 12-10" /></>,
  drink: <><path d="M7 7h10l-1 14H8L7 7ZM10 7l4-5" /></>,
  halal: <><path d="M15.5 4.5a7.5 7.5 0 1 0 4 12.8 8.5 8.5 0 1 1-4-12.8Z" /><path d="m17.5 7 .6 1.3 1.4.2-1 1 .2 1.4-1.2-.7-1.3.7.3-1.4-1-1 1.4-.2.6-1.3Z" /></>,
  cupcake: (
    <>
      <path d="M12 17c5 0 8-2.69 8-6H4c0 3.31 3 6 8 6m-4 4h8m-4-3v3M5.14 11a3.5 3.5 0 1 1 6.71 0" />
      <path d="M12.14 11a3.5 3.5 0 1 1 6.71 0" />
      <path d="M15.5 6.5a3.5 3.5 0 1 0-7 0" />
    </>
  ),
};

export default function Icon({ name, size = 24 }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name]}</svg>;
}
