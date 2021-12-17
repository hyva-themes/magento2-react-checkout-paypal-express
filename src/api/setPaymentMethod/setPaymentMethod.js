import { SET_PAYMENT_METHOD_ON_CART_PAYPAL_EXPRESS } from './mutation';
import sendRequest from '../../../../../api/sendRequest';
import LocalStorage from '../../../../../utils/localStorage';
import modifier from './modifier';

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
