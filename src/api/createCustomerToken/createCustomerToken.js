import { CREATE_PAYPAL_EXPRESS_TOKEN } from './mutation';
import LocalStorage from '../../../../../utils/localStorage';
import modifier from './modifier';
import sendRequest from '../../../../../api/sendRequest';

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
