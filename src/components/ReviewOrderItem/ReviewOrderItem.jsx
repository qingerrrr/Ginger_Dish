import QuantityControl from "../QuantityControl/QuantityControl";

export default function ReviewOrderItem({ item, quantity, onChangeQuantity }) {
  return (
    <article className="review-item">
      <div className="review-item__image-wrap menu-card__image-wrap">
        <img className="review-item__image menu-card__image" src={item.image} alt={item.name} />
      </div>
      <div className="review-item__content">
        <div className="review-item__info">
          <h3>{item.name}</h3>
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
