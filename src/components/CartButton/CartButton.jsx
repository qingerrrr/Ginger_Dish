import Icon from "../Icon";

export default function CartButton({ cartCount, onClick }) {
  return (
    <button className="cart-button" type="button" onClick={onClick} aria-label={`Open cart, ${cartCount} items`}>
      <Icon name="cart" size={23} />
      {cartCount > 0 && <span className="cart-button__badge">{cartCount}</span>}
    </button>
  );
}
