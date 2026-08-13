import QuantityControl from "../QuantityControl/QuantityControl";

export default function ReviewOrderItem({ item, quantity, onChangeQuantity }) {
  return (
    <article className="review-item grid min-h-[150px] grid-cols-[minmax(100px,38%)_minmax(0,1fr)] gap-3.5 py-3 first:pt-0.5 max-[359px]:min-h-[142px] max-[359px]:grid-cols-[minmax(92px,35%)_minmax(0,1fr)] max-[359px]:gap-2.5 md:min-h-[180px] md:grid-cols-[minmax(140px,39%)_minmax(0,1fr)] md:gap-[26px] md:py-5 lg:min-h-[190px]">
      <div className="review-item__image-wrap menu-card__image-wrap">
        <img className="review-item__image menu-card__image" src={item.imageUrl} alt={item.name} />
      </div>
      <div className="review-item__content relative flex min-w-0 flex-col justify-center">
        <div className="review-item__info flex flex-col items-start justify-center gap-1.5">
          <h3 className="m-0 font-ginger-heading text-[clamp(1.02rem,4.8vw,1.35rem)] leading-[1.08] font-bold wrap-break-word md:text-2xl">{item.name}</h3>
          {item.halal && <span className="menu-card__halal-badge">Halal</span>}
        </div>
        <QuantityControl
          itemName={item.name}
          quantity={quantity}
          onDecrease={() => onChangeQuantity(item.id, -1)}
          onIncrease={() => onChangeQuantity(item.id, 1)}
        />
      </div>
    </article>
  );
}
