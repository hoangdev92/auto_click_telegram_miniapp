// ==UserScript==
// @name         Auto Cick miniapp telegram Devhoanglv92
// @namespace    http://tampermonkey.net/
// @version      2024-12-26
// @description  Hỗ trợ autoclick vào vùng giữa màn hình, vì nhiều miniapp khác nhau nhưng vùng nhấn là ở giữa nên tạm thời chỉ hỗ trợ ở giữa màn hình
// @author       devhoanglv92
// @match        *://www.kucoin.com/*
// @match        *://babydogeclikerbot.com/*
// @icon         https://i.postimg.cc/brxR6L7c/128.png
// @grant        GM_log
// @grant        unsafeWindow
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js
// @require      https://cdn.jsdelivr.net/npm/sweetalert2@11
// ==/UserScript==

(function() {
  'use strict';

let isRunning = false;
let isAutoClickerEnabled = false;
let clickSpeed = parseInt(localStorage.getItem('clickSpeed')) || 100;

function createPopup() {
  const popup = document.createElement('div');
  popup.id = 'autoclicker-popup';
popup.innerHTML = `
<div style="
position: fixed;
bottom: 10px;
right: 10px;
background-color: rgba(0, 0, 0, 0.7);
color: white;
padding: 10px;
border-radius: 10px;
z-index: 10000;
font-size: 14px;
text-align: center;
box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.5);
width: 120px;
font-family: Arial, sans-serif;
">
<p style="
  margin: 0 0 10px 0;
  font-weight: bold;
  font-size: 10px;
">
  AUTO CLICK BY DEVHOANGLV92
</p>
<button id="toggle-autoclicker" style="
  background-color: #4CAF50;
  color: white;
  border: none;
  padding: 8px 8px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 8px;
  font-weight: bold;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.3);
  transition: background-color 0.3s;
  width: 100%;
">Bật Autoclick</button>
<button id="settings-button" style="
  background-color: #2196F3;
  color: white;
  border: none;
  padding: 8px 8px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 8px;
  font-weight: bold;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.3);
  margin-top: 8px;
  transition: background-color 0.3s;
  width: 100%;
">Cài đặt</button>
<div id="settings-panel" style="display: none; margin-top: 10px;">
  <label for="click-speed" style="
    font-size: 8px;
    display: block;
    margin-bottom: 5px;
  ">
    Tốc độ Tap: <span id="click-speed-value">${clickSpeed}</span> ms
  </label>
  <input type="range" id="click-speed" min="20" max="1000" step="10" value="${clickSpeed}" style="
    width: 20px;
    height: 100px;
    -webkit-appearance: slider-vertical;
    writing-mode: bt-lr;
    margin: 0 auto;
    padding: 0;
  ">
</div>
</div>
`;

document.body.appendChild(popup);

const toggleButton = document.getElementById('toggle-autoclicker');
const speedSlider = document.getElementById('click-speed');
const speedValue = document.getElementById('click-speed-value');
const settingsButton = document.getElementById('settings-button');
const settingsPanel = document.getElementById('settings-panel');

toggleButton.addEventListener('click', function() {
  isAutoClickerEnabled = !isAutoClickerEnabled;
  toggleButton.textContent = isAutoClickerEnabled ? 'Tắt Autoclick' : 'Bật Autoclick';
  toggleButton.style.backgroundColor = isAutoClickerEnabled ? '#f44336' : '#4CAF50';
  isAutoClickerEnabled ? startAutoClicker() : stopAutoClicker();
});

speedSlider.addEventListener('input', function() {
  clickSpeed = parseInt(this.value);
  speedValue.textContent = clickSpeed + ' ms';
  localStorage.setItem('clickSpeed', clickSpeed);
});

settingsButton.addEventListener('click', function() {
if (settingsPanel.style.display === 'none') {
settingsPanel.style.display = 'block';
settingsButton.textContent = 'Đóng cài đặt';
settingsButton.style.backgroundColor = '#f44336';
} else {
settingsPanel.style.display = 'none';
settingsButton.textContent = 'Cài đặt';
settingsButton.style.backgroundColor = '#2196F3';
}
});

toggleButton.addEventListener('mouseover', function() {
  this.style.backgroundColor = isAutoClickerEnabled ? '#d32f2f' : '#45a049';
});

toggleButton.addEventListener('mouseout', function() {
  this.style.backgroundColor = isAutoClickerEnabled ? '#f44336' : '#4CAF50';
});

settingsButton.addEventListener('mouseover', function() {
  this.style.backgroundColor = settingsPanel.style.display === 'none' ? '#1976D2' : '#d32f2f';
});

settingsButton.addEventListener('mouseout', function() {
  this.style.backgroundColor = settingsPanel.style.display === 'none' ? '#2196F3' : '#f44336';
});
}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function detectInputSupport() {
  const support = {
    touch: false,
    pointer: false,
    mouse: false
  };

  const listTouch = ['babydogeclikerbot.com'];
  // Check touch support
  support.touch = listTouch.filter((x) => window.location.host.includes(x)).length > 0;

  // Check pointer support
  const listPointer = ['kucoin.com'];
  support.pointer = listPointer.filter((e) => window.location.host.includes(e)).length > 0;

  // Check mouse support
  support.mouse = 'onmousedown' in window;

  return support;
}

function simulateClick(element) {
  const rect = element.getBoundingClientRect();
  const x = getRandomInt(rect.left, rect.right);
  const y = getRandomInt(rect.top, rect.bottom);
  const support = detectInputSupport();
  if (support.touch) {
    // Create touch event
    const touchObj = new Touch({
      identifier: Date.now(),
      target: element,
      clientX: x,
      clientY: y,
      pageX: x,
      pageY: y,
      radiusX: getRandomInt(2, 5),
      radiusY: getRandomInt(2, 5),
      force: Math.random() * 0.5 + 0.5
    });

    element.dispatchEvent(new TouchEvent('touchstart', {
      bubbles: true,
      cancelable: true,
      view: unsafeWindow,
      touches: [touchObj],
      targetTouches: [touchObj],
      changedTouches: [touchObj]
    }));

    setTimeout(() => {
      element.dispatchEvent(new TouchEvent('touchend', {
        bubbles: true,
        cancelable: true,
        view: unsafeWindow,
        touches: [],
        targetTouches: [],
        changedTouches: [touchObj]
      }));
    }, 50);
  }
  if (support.mouse) {
    const clickEvent = new MouseEvent('click', {
      view: unsafeWindow,
      bubbles: true,
      cancelable: true,
      clientX: x,
      clientY: y
    });
    element.dispatchEvent(clickEvent);
  }
}

function getEnergy() {
  let energyElement;
  if (window.location.host.includes('kucoin.com')) {
      energyElement = document.querySelector('.process--mIfwx');
      if (!energyElement) return null;
      const energy = parseInt(energyElement.querySelector('span').textContent, 10);
      return isNaN(energy) ? null : energy;
  } else {
      const energyElement = $('p[data-v-f0853464]')[0];
      const energy = parseInt(energyElement.textContent.split('/')[0]);
      return isNaN(energy) ? null : energy;
  }
}

function getFrogElement() {
    let element;
    if (window.location.host.includes('kucoin.com')) {
        element = $('body').find('g[clip-path="url(#__lottie_element_2)"]')[0];
    } else if (window.location.host.includes('babydogeclikerbot.com')) {
        element = $('body').find('div[data-testid="tap_doge"]').find('img')[0];
    }
    return element;
  // return document.querySelector('#root > div.container--WYn0q > div:nth-child(2) > div.mainTouch--h_jfA > div:nth-child(2) > div.frogAnim--d8og4');
}

function startAutoClicker() {
  if (!isAutoClickerEnabled) return;
  const frogElement = getFrogElement();
  if (!frogElement) {
    setTimeout(startAutoClicker, 1000);
    return;
  }
  const energy = getEnergy();
  if (energy === 0) {
    const waitTime = getRandomInt(30000, 60000);
      Swal.fire({
                title: 'thông báo!',
                position: "top-end",
                text: `Năng lượng bằng 0, tạm dừng trong ${waitTime/1000} giây`,
                type: 'warning',
                timer: 2500,
                timerProgressBar: true,
                showConfirmButton: false,
            });
    console.log(`Năng lượng bằng 0, tạm dừng trong ${waitTime/1000} giây`);
    setTimeout(startAutoClicker, waitTime);
  } else {
    simulateClick(frogElement);
    setTimeout(startAutoClicker, clickSpeed);
  }
}

function stopAutoClicker() {
  console.log('Auto đã dừng!');
}

function checkAndStart() {
  if (!isRunning && window.location.href.includes('/miniapp/tap-game')) {
    console.log('Bắt đầu chạy Auto...');
    isRunning = true;
    setTimeout(startAutoClicker, 5000);
  }
}

createPopup();
checkAndStart();

const observer = new MutationObserver(() => {
  checkAndStart();
});
observer.observe(document.body, { childList: true, subtree: true });
})();
