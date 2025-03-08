document.getElementById('save-btn').addEventListener('click', () => {
  const selectedCurrency = document.getElementById('currency-select').value;
  const currencyTo = document.getElementById('currency-to-convert').value;
  chrome.storage.local.set({ baseCurrency: selectedCurrency,  currencyTo: currencyTo}, () => {
    alert(`Currency Saved`);
  });
});

chrome.storage.local.get('baseCurrency', (data) => {
  if (data.baseCurrency) {
    document.getElementById('currency-select').value = data.baseCurrency;
  }
});
chrome.storage.local.get('currencyTo', (data) => {
  if (data.currencyTo) {
    document.getElementById('currency-to-convert').value = data.currencyTo;
  }
});