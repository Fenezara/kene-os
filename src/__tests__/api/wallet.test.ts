// Tests unitaires pour la logique du Portefeuille Kènè (Wallet)

export function calculateCashback(amount: number, rate = 0.05): number {
  if (amount <= 0) return 0;
  return Math.floor(amount * rate);
}

export function processWalletDebit(currentBalance: number, amountToPay: number): { success: boolean; newBalance: number; error?: string } {
  if (amountToPay <= 0) {
    return { success: false, newBalance: currentBalance, error: "Montant invalide" };
  }
  if (currentBalance < amountToPay) {
    return { success: false, newBalance: currentBalance, error: "Solde insuffisant" };
  }
  return { success: true, newBalance: currentBalance - amountToPay };
}

export function runWalletTests() {
  console.assert(calculateCashback(10000) === 500, 'Cashback 10k should be 500');
  console.assert(calculateCashback(25000) === 1250, 'Cashback 25k should be 1250');
  console.assert(calculateCashback(0) === 0, 'Cashback 0 should be 0');

  const resSuccess = processWalletDebit(15000, 10000);
  console.assert(resSuccess.success === true && resSuccess.newBalance === 5000, 'Debit should succeed');

  const resFail = processWalletDebit(3000, 10000);
  console.assert(resFail.success === false && resFail.newBalance === 3000, 'Debit should fail');
}
