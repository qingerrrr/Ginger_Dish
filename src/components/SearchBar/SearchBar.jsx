import Icon from "../Icon";

export default function SearchBar({ value, onChange }) {
  return (
    <div className="mb-[35px] flex items-center gap-[7px] md:max-w-[850px]">
      <label className="search-box flex h-[38px] min-w-0 flex-1 items-center gap-[9px] rounded-[var(--radius-md)] border-[1.5px] border-ginger-border bg-ginger-surface px-3.5 lg:h-[54px]">
        <span className="sr-only">Search menu</span>
        <Icon name="search" size={19} />
        <input className="min-w-0 w-full border-0 bg-transparent text-ginger-text text-[clamp(.82rem,3.7vw,.94rem)] outline-0 placeholder:text-[#8e7c70]" value={value} onChange={(event) => onChange(event.target.value)} placeholder="Search for food or drink..." type="search" />
      </label>
    </div>
  );
}
