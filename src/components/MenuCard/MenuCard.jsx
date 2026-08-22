import QuantityControl from "../QuantityControl/QuantityControl";

export default function MenuCard({ item, quantity, onAdd, onChangeQuantity }) {
  return (
    <article className="menu-card grid min-h-[180px] grid-cols-[38%_minmax(0,1fr)] overflow-hidden rounded-[var(--radius-lg)] border border-[#f0e5d4] bg-ginger-surface p-0 shadow-ginger-card max-[359px]:min-h-[172px] max-[359px]:grid-cols-[35%_minmax(0,1fr)] md:min-h-[190px] md:grid-cols-[39%_minmax(0,1fr)] lg:min-h-[200px]">
      <div className="menu-card__image-wrap"><img className="menu-card__image" src={item.imageUrl} alt={item.name} /></div>
      <div className="menu-card__content flex min-w-0 flex-col pt-5 pr-[13px] pb-2.5 pl-3.5 max-[359px]:pt-[15px] max-[359px]:pr-2.5 max-[359px]:pb-2 max-[359px]:pl-[11px] md:pt-[15px] md:pr-[15px] md:pb-3 md:pl-[18px]">
        <div className="menu-card__heading flex min-w-0 items-start justify-between gap-1.5">
          <h3>{item.name}</h3>
        </div>
        {item.halal && <span className="menu-card__halal-badge">Halal</span>}
        <p className="menu-card__description mt-[7px] mb-2 line-clamp-3 overflow-hidden whitespace-pre-line text-ginger-muted text-[clamp(.7rem,3vw,.9rem)] leading-[1.4] max-[359px]:text-[.68rem] md:text-[.92rem]">{item.description}</p>
        <div className="menu-card__actions mt-auto flex min-h-10 items-end justify-end max-[359px]:min-h-9">
          {quantity > 0 ? (
            <QuantityControl
              itemName={item.name}
              quantity={quantity}
              onDecrease={() => onChangeQuantity(item.id, -1)}
              onIncrease={() => onChangeQuantity(item.id, 1)}
            />
          ) : (
            <button className="add-button" type="button" onClick={() => onAdd(item)} aria-label={`Add ${item.name} to cart`} />
          )}
        </div>
      </div>
    </article>
  );
}
