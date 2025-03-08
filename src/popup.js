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
  if (data.baseCurrency) {
    document.getElementById('currency-to-convert').value = data.baseCurrency;
  }
});

// Функция для отображения Toast-уведомления
function showToastNotification(numbers, converted) {
  const resultMessage = `${numbers} USD ≈ ${converted} PLN`;
  
  // Показываем уведомление
  toastr.success(resultMessage, "Currency Converter");
}

// Слушаем сообщения от background.js
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "conversionResult") {
    // Получаем результат из сообщения
    const { numbers, converted } = message;
    
    // Показываем уведомление с результатом
    showToastNotification(numbers, converted);
  }
});