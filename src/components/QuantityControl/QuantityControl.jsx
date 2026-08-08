export default function QuantityControl({ itemName, quantity, onDecrease, onIncrease }) {
  return (
    <div className="quantity-control" aria-label={`${itemName} quantity`}>
      <button type="button" onClick={onDecrease} aria-label={`Decrease ${itemName} quantity`}>−</button>
      <span aria-live="polite">{quantity}</span>
      <button type="button" onClick={onIncrease} aria-label={`Increase ${itemName} quantity`}>+</button>
    </div>
  );
}
