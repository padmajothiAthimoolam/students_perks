import { Coupon, Redemption } from "../types";

type Props = {
  studentId: string;
  availableCredits: number;
  coupons: Coupon[];
  redemptions: Redemption[];
  onRedeem: (coupon: Coupon) => void;
};

export default function CouponStore({ studentId, availableCredits, coupons, redemptions, onRedeem }: Props) {
  const redeemedIds = new Set(redemptions.filter((item) => item.studentId === studentId).map((item) => item.couponId));

  return (
    <section className="panel">
      <div className="panel-heading">
        <div>
          <p className="eyebrow">Rewards Marketplace </p>
          <h2>Retail Discount Coupons</h2>
        </div>
        <div className="credit-wallet"><span>Available</span><strong>{availableCredits} credits</strong></div>
      </div>

      <div className="coupon-grid">
        {coupons.map((coupon) => {
          const redeemed = redeemedIds.has(coupon.id);
          const canRedeem = availableCredits >= coupon.creditsRequired && !redeemed;
          return (
            <article className="coupon-card" key={coupon.id}>
              <div className="coupon-retailer">{coupon.retailer}</div>
              <h3>{coupon.title}</h3>
              <p>{coupon.description}</p>
              <small>Expires {coupon.expiry}</small>
              {redeemed ? (
                <div className="coupon-code">Code: {coupon.code}</div>
              ) : (
                <button className="primary-button" disabled={!canRedeem} onClick={() => onRedeem(coupon)}>
                  Redeem for {coupon.creditsRequired} credits
                </button>
              )}
            </article>
          );
        })}
      </div>
    </section>
  );
}
