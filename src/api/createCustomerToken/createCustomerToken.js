import sendRequest from '@hyva/react-checkout/api/sendRequest';
import LocalStorage from '@hyva/react-checkout/utils/localStorage';

import modifier from './modifier';
import { CREATE_PAYPAL_EXPRESS_TOKEN } from './mutation';

export default async function createCustomerToken(
  appDispatch,
  createTokenInput
) {
  const variables = {
    ...createTokenInput,
    cartId: LocalStorage.getCartId(),
  };

  return modifier(
    await sendRequest(appDispatch, {
      query: CREATE_PAYPAL_EXPRESS_TOKEN,
      variables,
    })
  );
}
