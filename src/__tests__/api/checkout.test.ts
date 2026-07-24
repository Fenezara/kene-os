// Tests unitaires pour la caisse et le calcul des commandes (Checkout & VAT)

export function calculateInvoice(items: { price: number; quantity: number }[], vatRate = 0.18): { subtotalHT: number; vatAmount: number; totalTTC: number } {
  const subtotalHT = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const vatAmount = Math.round(subtotalHT * vatRate);
  const totalTTC = subtotalHT + vatAmount;
  return { subtotalHT, vatAmount, totalTTC };
}

export function runCheckoutTests() {
  const cart = [
    { price: 10000, quantity: 2 }, // 20 000 F HT
    { price: 5000, quantity: 1 }   // 5 000 F HT
  ];
  const invoice = calculateInvoice(cart);

  console.assert(invoice.subtotalHT === 25000, 'Subtotal HT should be 25000');
  console.assert(invoice.vatAmount === 4500, 'VAT 18% should be 4500');
  console.assert(invoice.totalTTC === 29500, 'Total TTC should be 29500');

  const emptyInvoice = calculateInvoice([]);
  console.assert(emptyInvoice.subtotalHT === 0 && emptyInvoice.totalTTC === 0, 'Empty cart should be 0');
}
