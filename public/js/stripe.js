/* eslint-disable */
import { showAlert } from './alert.js';
var stripe = Stripe(process.env.STRIPE_PUBLIC_KEY);

export const bookTour = async (tourId) => {
  try {
    // 1) Get checkout session from API
    const session = await axios.get(
      `${process.env.BASE_URL}/api/v1/bookings/checkout-session/${tourId}`,
    );

    // 2) Create checkout form + charge credit card
    await stripe.redirectToCheckout({
      sessionId: session.data.session.id,
    });
  } catch (err) {
    console.log(err);
    showAlert('error', err);
  }
};
