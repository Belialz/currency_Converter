let translateButton = null;
let selectedText = '';
clientX = 0;
clientY = 0;
absoluteX = 0;
absoluteY = 0;

function showPopup(event, text, options = {}) {
    const existingPopups = document.querySelectorAll('.custom-popup');
    existingPopups.forEach(el => el.remove());

    const popup = document.createElement("div");
    popup.classList.add('custom-popup');
    
    // Расширенные стили
    popup.style.position = "absolute";
    popup.style.background = options.background || "white";
    popup.style.border = options.border || "1px solid #ccc";
    popup.style.padding = options.padding || "10px 15px";
    popup.style.borderRadius = options.borderRadius || "8px";
    popup.style.boxShadow = options.boxShadow || "0px 2px 10px rgba(0, 0, 0, 0.2)";
    popup.style.fontSize = options.fontSize || "14px";
    popup.style.zIndex = "9999"; // Поверх других элементов
    
    // Позиционирование с учетом размера экрана
    const x = event.pageX + 10;
    const y = event.pageY + 10;
    
    // Проверка выхода за границы экрана
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;
    
    popup.style.left = `${Math.min(x, windowWidth - 250)}px`;
    popup.style.top = `${Math.min(y, windowHeight - 100)}px`;
    
    popup.textContent = text;
    
    // Возможность закрыть попап кликом
    popup.addEventListener('click', () => popup.remove());
    
    document.body.appendChild(popup);
    
    const timeout = options.timeout || 3000;
    const timer = setTimeout(() => {
        popup.remove();
    }, timeout);
    
    return {
        element: popup,
        remove: () => {
            clearTimeout(timer);
            popup.remove();
        }
    };
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "openPopup") {
        showPopup({pageX: clientX, pageY: clientY}, `≈ ${request.selectedText}`);
    }
});

document.addEventListener("contextmenu", (e) => {
     clientX = e.clientX;
     clientY = e.clientY;
    
    // Абсолютные координаты
     absoluteX = e.x;
     absoluteY = e.y;
});
