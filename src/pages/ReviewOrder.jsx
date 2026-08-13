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
    <div className="min-h-screen bg-white text-ginger-text">
      <header className="review-hero relative overflow-hidden bg-[#fff1c4]">
        <div className="review-hero__content relative mx-auto flex min-h-[174px] w-[calc(100%-28px)] max-w-[900px] items-center justify-center gap-0.5 pt-[22px] pb-[30px] max-[359px]:min-h-[154px] max-[359px]:gap-[7px] max-[359px]:pt-4 md:min-h-[232px] md:gap-3.5 md:pt-[30px] md:pb-[42px]">
          <button className="review-back absolute top-[22px] left-0 flex size-11 cursor-pointer items-center justify-center border-0 bg-transparent p-0 max-[359px]:top-4 max-[359px]:size-[38px] md:top-[30px] md:size-[52px]" type="button" onClick={onBack} aria-label="Back to menu"><Icon name="back" size={28} /></button>
          <img className="review-hero__mascot max-h-[130px] w-[clamp(76px,24vw,118px)] shrink-0 object-contain max-[359px]:w-[68px] md:max-h-[180px] md:w-[150px]" src={placeOrderMascot} alt="GingerDish penguin chef cooking" />
          <div className="min-w-0">
            <h1 className="pt-2.5 text-ginger-red-dark font-ginger-heading text-[clamp(1.45rem,7vw,2.6rem)] leading-[.95] font-bold tracking-[-.045em] uppercase">Order Summary</h1>
          </div>
        </div>
        <svg className="review-hero__wave" viewBox="0 0 100 18" preserveAspectRatio="none" aria-hidden="true">
          <path className="review-hero__wave-band" d="M0 8 C18 1 28 3 42 8 C58 14 72 2 100 8 L100 18 L0 18 Z" />
          <path className="review-hero__wave-fill" transform="translate(0 2)" d="M0 8 C18 1 28 3 42 8 C58 14 72 2 100 8 L100 18 L0 18 Z" />
        </svg>
      </header>

      <main className="mx-auto grid w-[calc(100%-28px)] max-w-[900px] gap-4 pt-[18px] pb-[calc(112px+env(safe-area-inset-bottom))] md:gap-5 md:pt-6">
        {cartItems.length === 0 ? (
          <section className="flex flex-col items-center py-[22px] text-center">
            <img className="aspect-square w-[min(100%,340px)] object-contain" src={emptyCartImage} alt="Your cart is empty" />
            <button className="mt-4 cursor-pointer rounded-[14px] border-0 bg-ginger-red-dark px-[18px] py-2.5 font-bold text-white" type="button" onClick={onBack}>Browse Menu</button>
          </section>
        ) : (
          <>
            <section className="review-card rounded-[var(--radius-lg)] border border-[#f0e5d4] bg-white px-4 py-[18px] shadow-ginger-card max-[359px]:px-3 md:px-7 md:py-6" aria-labelledby="your-order-title">
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

            <section className="review-card review-form-card rounded-[var(--radius-lg)] border border-[#f0e5d4] bg-white px-4 py-[18px] shadow-ginger-card max-[359px]:px-3 md:px-7 md:py-6">
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
        <div className="fixed inset-0 z-[2000] flex items-center justify-center bg-[rgba(45,31,24,.42)] p-5">
          <div className="relative max-h-[calc(100dvh-40px)] w-[90vw] max-w-[360px] overflow-auto rounded-3xl border border-[#f0e5d4] bg-white p-5 shadow-[0_12px_40px_rgba(0,0,0,.18)]" role="dialog" aria-modal="true" aria-labelledby="order-success-title">
            <h2 className="sr-only" id="order-success-title">Order sent successfully</h2>
            <button className="order-success-close" type="button" onClick={handleCloseOrderSuccess} aria-label="Close order confirmation">×</button>
            <img className="mx-auto block h-auto w-full max-w-[300px] object-contain" src={orderReceivedImage} alt="GingerDish order sent successfully" />
          </div>
        </div>
      )}
    </div>
  );
}
