document.getElementById("save-btn").addEventListener("click", () => {
  const selectedCurrency = document.getElementById("currency-select").value;
  const currencyTo = document.getElementById("currency-to-convert").value;
  chrome.storage.local.set(
    { baseCurrency: selectedCurrency, currencyTo: currencyTo },
    () => {
      showCustomAlert("Currency Saved", 2000);
    }
  );
});

chrome.storage.local.get({
  data: {},
  currencyTo: "",
  baseCurrency: "",
}, (result) => {
  const currencyData = result.data;

  if (currencyData) {
    // Получаем элемент select
    const selectElement = document.querySelectorAll(".select-wrapper select");
    selectElement.forEach((el) => {
      el.innerHTML = "";

      // Проходим по объекту валют и создаем опции для select
      Object.entries(currencyData).forEach(([code, name]) => {
        const option = document.createElement("option");
        option.value = code; // Значение будет код валюты (например, USD)
        option.textContent = `${code} - ${name}`; // Текст отображаемый в опции (например, USD - United States Dollar)

        // Добавляем опцию в select
        el.appendChild(option);
      });
    });
  }
  if (result.baseCurrency) {
    document.getElementById("currency-select").value = result.baseCurrency;
  }
  if (result.currencyTo) {
    document.getElementById("currency-to-convert").value = result.currencyTo;
  }
});

function showCustomAlert(message, duration) {
  // Создаем элемент уведомления
  const alert = document.createElement("div");
  alert.textContent = message;
  alert.style.position = "fixed";
  alert.style.bottom = "20px";
  alert.style.left = "50%";
  alert.style.transform = "translateX(-50%)";
  alert.style.backgroundColor = "#4CAF50"; // Зеленый фон
  alert.style.color = "white";
  alert.style.padding = "10px 20px";
  alert.style.borderRadius = "5px";
  alert.style.fontSize = "14px";
  alert.style.boxShadow = "0px 4px 6px rgba(0, 0, 0, 0.1)";
  alert.style.zIndex = "9999";
  alert.style.opacity = "0";
  alert.style.transition = "opacity 0.5s";

  // Добавляем элемент на страницу
  document.body.appendChild(alert);

  // Анимация появления
  setTimeout(() => {
    alert.style.opacity = "1";
  }, 0);

  // Убираем уведомление через заданное время
  setTimeout(() => {
    alert.style.opacity = "0";
    // Удаляем элемент из DOM после анимации исчезновения
    setTimeout(() => {
      alert.remove();
    }, 500);
  }, duration);
}
