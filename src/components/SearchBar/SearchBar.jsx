import Icon from "../Icon";

export default function SearchBar({ value, onChange }) {
  return (
    <div className="search-row">
      <label className="search-box">
        <span className="sr-only">Search menu</span>
        <Icon name="search" size={19} />
        <input value={value} onChange={(event) => onChange(event.target.value)} placeholder="Search for food or drink..." type="search" />
      </label>
    </div>
  );
}
