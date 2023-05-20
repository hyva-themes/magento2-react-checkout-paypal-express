import { useContext } from 'react';

import CartContext from '@hyva/react-checkout/context/Cart/CartContext';

export default function usePaypalExpressCartContext() {
  const [cartData, cartActions] = useContext(CartContext);
  const cart = cartData?.cart || {};
  const cartId = cart.id;
  const cartBillingAddress = cart.billing_address || {};
  const selectedPaymentMethod = cart.selected_payment_method;
  const selectedShippingMethod = cart.selected_shipping_method || {};
  const { firstname, lastname, zipcode } = cartBillingAddress;
  const hasCartBillingAddress = firstname && lastname && zipcode;
  const { placeOrder } = cartActions;

  return {
    cartId,
    placeOrder,
    hasCartBillingAddress,
    selectedPaymentMethod,
    selectedShippingMethod,
  };
}
