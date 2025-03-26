let baseCurrency, convertCurrency;

getConversionRate = async (amount, currencyTo, baseCurrency) => {
  const response = await fetch(
    `https://api.frankfurter.app/latest?from=${baseCurrency}&to=${currencyTo}`
  );
  const data = await response.json();
  const rate = Object.values(data.rates)[0];
  const result = (amount * rate).toFixed(2);
  return result;
};

getCurrency = async () => {
  const response = await fetch(
    `https://api.frankfurter.dev/v1/currencies`
  );
  const data = await response.json();
  return data;
};

chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "Convert",
    title: "Convert to selected Currency",
    contexts: ["selection"],
  });
  getCurrency().then((data) => {
    chrome.storage.local.set({ data });
  
  }); 
});

chrome.storage.local.get("baseCurrency", (data) => {
  baseCurrency = data.baseCurrency || "EUR";
  console.log("Base Currency:", baseCurrency);
});
chrome.storage.local.get("currencyTo", (data) => {
  convertCurrency = data.baseCurrency || "PLN";
  console.log("Convert Currency:", convertCurrency);
});

function extractNumbers(text) {
  const cleanedText = text.replace(/\s+/g, "");
  const regex = /\d+(\.\d+)?/g;
  const matches = cleanedText.match(regex) || [];
  return matches.map((num) => parseFloat(num));
}

chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  if (info.menuItemId === "Convert") {
    const parsed = extractNumbers(info.selectionText);
    if (!parsed || isNaN(parsed)) return;
    chrome.storage.local.get({currencyTo: '', baseCurrency: ''}, (data) => {
      convertCurrency = data.baseCurrency || "PLN";
      console.log("Convert Currency:", convertCurrency);
    
    console.log("Parsed amount:", parsed[0]);
    getConversionRate(parsed[0], data.currencyTo, data.baseCurrency)
      .then((convertedAmount) => {
        chrome.tabs.sendMessage(tab.id, {
          action: "openPopup",
          selectedText: `${convertedAmount} ${data.currencyTo}`,
      });
      })
      .catch((error) => {
        console.error(error);
      });
    });
  }
})
