import { useEffect, useState } from "react";
import reviewMascot from "../../Images/review_order.png";
import placeOrderMascot from "../../Images/place_order.png";
import yourNameMascot from "../../Images/your_name.png";
import emptyCartImage from "../../Images/empty_bag.png";
import orderReceivedImage from "../../Images/order_received.png";
import Icon from "../components/Icon";
import ReviewOrderItem from "../components/ReviewOrderItem/ReviewOrderItem";
import { orderService } from "../services/orderService";

export default function ReviewOrder({ cart, menuItems, onChangeQuantity, onBack, onOrderComplete }) {
  const [customerName, setCustomerName] = useState("");
  const [orderNotes, setOrderNotes] = useState("");
  const [nameError, setNameError] = useState("");
  const [submitError, setSubmitError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [showOrderSuccess, setShowOrderSuccess] = useState(false);
  const cartItems = menuItems.filter((item) => cart[item.id] > 0);

  useEffect(() => {
    if (!showOrderSuccess) return undefined;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = previousOverflow; };
  }, [showOrderSuccess]);

  const handlePlaceOrder = async () => {
    if (submitting) return;
    if (!customerName.trim()) {
      setNameError("Name, Please!");
      return;
    }
    setNameError("");
    setSubmitError("");
    setSubmitting(true);
    try {
      await orderService.createOrder({
        visitorName: customerName,
        items: cartItems.map((item) => ({ foodId: item.id, quantity: cart[item.id] })),
      });
      setShowOrderSuccess(true);
    } catch (orderError) {
      setSubmitError(orderError.message || "Unable to place your order. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleCloseOrderSuccess = () => {
    setShowOrderSuccess(false);
    setCustomerName("");
    setOrderNotes("");
    setNameError("");
    setSubmitError("");
    onOrderComplete();
  };

  return (
    <div className="review-page">
      <header className="review-hero">
        <div className="review-page__container review-hero__content">
          <button className="review-back" type="button" onClick={onBack} aria-label="Back to menu"><Icon name="back" size={28} /></button>
          <img className="review-hero__mascot" src={placeOrderMascot} alt="GingerDish penguin chef cooking" />
          <div className="review-hero__copy">
            <h1>Order Summary</h1>
          </div>
        </div>
        <svg className="review-hero__wave" viewBox="0 0 100 18" preserveAspectRatio="none" aria-hidden="true">
          <path className="review-hero__wave-band" d="M0 8 C18 1 28 3 42 8 C58 14 72 2 100 8 L100 18 L0 18 Z" />
          <path className="review-hero__wave-fill" transform="translate(0 2)" d="M0 8 C18 1 28 3 42 8 C58 14 72 2 100 8 L100 18 L0 18 Z" />
        </svg>
      </header>

      <main className="review-page__container review-main">
        {cartItems.length === 0 ? (
          <section className="review-empty">
            <img src={emptyCartImage} alt="Your cart is empty" />
            <button type="button" onClick={onBack}>Browse Menu</button>
          </section>
        ) : (
          <>
            <section className="review-card review-order-card" aria-labelledby="your-order-title">
              <div className="review-section-heading">
                <span className="review-section-heading__icon"><Icon name="bag" size={23} /></span>
                <h2 id="your-order-title">WHATCHA GETTING?</h2>
              </div>
              <div className="review-order-list">
                {cartItems.map((item) => (
                  <ReviewOrderItem key={item.id} item={item} quantity={cart[item.id]} onChangeQuantity={onChangeQuantity} />
                ))}
              </div>
            </section>

            <section className="review-card review-form-card">
              <label className="review-section-heading" htmlFor="customer-name">
                <span className="review-section-heading__icon review-section-heading__icon--photo"><img src={yourNameMascot} alt="" /></span>
                <span><strong>WHO'S ORDERING?</strong><small>Pop your name in below!</small></span>
              </label>
              <p className={`review-field-error${nameError ? "" : " review-field-error--placeholder"}`} id="customer-name-error" role={nameError ? "alert" : undefined} aria-hidden={!nameError}>{nameError || "\u00a0"}</p>
              <input id="customer-name" value={customerName} onChange={(event) => { setCustomerName(event.target.value); if (nameError) setNameError(""); if (submitError) setSubmitError(""); }} placeholder="e.g. Ginger Tea" required aria-invalid={Boolean(nameError)} aria-describedby={nameError ? "customer-name-error" : undefined} />
            </section>

            <div className="place-order-wrapper">
              {submitError && <p className="place-order-error" role="alert">{submitError}</p>}
              <button className="place-order-button" type="button" onClick={handlePlaceOrder} disabled={submitting}>
                <img className="place-order-mascot" src={reviewMascot} alt="" />
                <span className="place-order-label">{submitting ? "Placing..." : "Place Order"}</span>
                <span className="place-order-arrow"><Icon name="arrowRight" size={28} /></span>
              </button>
            </div>
          </>
        )}
      </main>
      {showOrderSuccess && (
        <div className="order-success-overlay">
          <div className="order-success-modal" role="dialog" aria-modal="true" aria-labelledby="order-success-title">
            <h2 className="sr-only" id="order-success-title">Order sent successfully</h2>
            <button className="order-success-close" type="button" onClick={handleCloseOrderSuccess} aria-label="Close order confirmation">×</button>
            <img className="order-success-image" src={orderReceivedImage} alt="GingerDish order sent successfully" />
          </div>
        </div>
      )}
    </div>
  );
}
