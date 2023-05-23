export default function createCustomerTokenModifier(result) {
  return result?.data || {};
}
