import Icon from "../Icon";

export default function CartButton({ cartCount }) {
  return (
    <button className="cart-button" type="button" aria-label={`Open cart, ${cartCount} items`}>
      <Icon name="cart" size={23} />
      {cartCount > 0 && <span className="cart-button__badge">{cartCount}</span>}
    </button>
  );
}
