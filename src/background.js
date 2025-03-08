let baseCurrency, convertCurrency;

chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "Convert",
    title: "Convert to selected Currency",
    contexts: ["selection"]
  });
});

chrome.storage.local.get('baseCurrency', (data) => {
        baseCurrency = data.baseCurrency || 'EUR';
        console.log('Base Currency:', baseCurrency);
      });
chrome.storage.local.get('currencyTo', (data) => {
  convertCurrency = data.baseCurrency || 'PLN';
  console.log('Convert Currency:', convertCurrency);
});

function extractNumbers(text) {
  const cleanedText = text.replace(/\s+/g, '');
  const regex = /\d+(\.\d+)?/g;
  const matches = cleanedText.match(regex) || [];
  return matches.map(num => parseFloat(num));
}

chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  if (info.menuItemId === "Convert") {
    const parsed = extractNumbers(info.selectionText);
    if (!parsed || isNaN(parsed)) return;

    const response = await fetch(`https://api.frankfurter.app/latest?from=${baseCurrency}&to=${convertCurrency}`);
    const data = await response.json();
    const rate = Object.values(data.rates)[0]
    const converted = parsed.map((item) => (item * rate).toFixed(2));
    chrome.notifications.create({
        type: "basic",
              iconUrl: "./icons/6594315.png",
              title: "Currency Converter",
              message: `${parsed.join(',')} ${baseCurrency} ≈ ${converted.join(',')} ${convertCurrency}`,
        }, (notificationId) => {
          if (chrome.runtime.lastError) {
            console.error("Ошибка: ", chrome.runtime.lastError);
          } else {
            console.log("Уведомление создано: ", notificationId);
          }
    });
  }
});
