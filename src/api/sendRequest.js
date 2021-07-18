import { config } from '../../../../config';
import LocalStorage from '../../../../utils/localStorage';
import env from '../../../../utils/env';
import RootElement from '../../../../utils/rootElement';

export const RESPONSE_TEXT = 'text';
export const RESPONSE_JSON = 'json';

const storeCode = env.storeCode || RootElement.getStoreCode();

export default function sendRequest(
  queryParams = {},
  relativeUrl,
  responseType = 'json',
  additionalHeaders = {},
  isGet = false
) {
  const token = LocalStorage.getCustomerToken();

  const headers = {
    'Content-Type': 'application/json',
    Store: storeCode,
    ...additionalHeaders,
  };
  const url = `${config.baseUrl}${relativeUrl || '/graphql'}`;

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const body = isGet ? undefined : { body: JSON.stringify({ ...queryParams }) };

  return fetch(url, {
    method: isGet ? 'GET' : 'POST',
    headers,
    ...body,
  })
    .then(response => {
      if (response.ok && responseType === RESPONSE_TEXT) {
        return response.text();
      }
      return response.json();
    })
    .catch(exception => {
      console.error(exception);
      throw exception;
    });
}
