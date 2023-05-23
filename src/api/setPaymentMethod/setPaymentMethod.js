import sendRequest from '@hyva/react-checkout/api/sendRequest';
import LocalStorage from '@hyva/react-checkout/utils/localStorage';

import modifier from './modifier';
import { SET_PAYMENT_METHOD_ON_CART_PAYPAL_EXPRESS } from './mutation';

export default async function setPaymentMethodPaypalExpress(
  appDispatch,
  setPaymentInput
) {
  const variables = {
    ...setPaymentInput,
    cartId: LocalStorage.getCartId(),
  };

  return modifier(
    await sendRequest(appDispatch, {
      query: SET_PAYMENT_METHOD_ON_CART_PAYPAL_EXPRESS,
      variables,
    })
  );
}
