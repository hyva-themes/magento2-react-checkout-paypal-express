import { shape, string } from 'prop-types';

import LocalStorage from '@hyva/react-checkout/utils/localStorage';

import { config } from '../../../../config';

export const paymentMethodShape = shape({ title: string, code: string });

export function performRedirect(order) {
  const orderNumber = order?.order_number;

  if (orderNumber) {
    window.location.replace(`${config.baseUrl}/checkout/onepage/success/`);
    LocalStorage.clearCheckoutStorage();
  }
}
