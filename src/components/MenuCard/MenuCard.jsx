import QuantityControl from "../QuantityControl/QuantityControl";

export default function MenuCard({ item, quantity, onAdd, onChangeQuantity }) {
  return (
    <article className="menu-card">
      <div className="menu-card__image-wrap"><img className="menu-card__image" src={item.imageUrl} alt={item.name} /></div>
      <div className="menu-card__content">
        <div className="menu-card__heading">
          <h3>{item.name}</h3>
        </div>
        {item.halal && <span className="menu-card__halal-badge">Halal</span>}
        <p className="menu-card__description">{item.description}</p>
        <div className="menu-card__actions">
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
