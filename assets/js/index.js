document.addEventListener('DOMContentLoaded', () => {
  const tabBar = document.getElementById('tabBar');
  const contentArea = document.getElementById('contentArea');
  const addTabBtn = document.getElementById('addTabBtn');
  const homeTabBtn = tabBar ? tabBar.querySelector('button[data-tab="home"]') : null;
  const homeContent = document.getElementById('homeContent');
  let tabCount = 1;

  function createTab(url, title) {
    tabCount++;
    const tabId = 'tab' + tabCount;
    const tabBtn = document.createElement('button');
    tabBtn.className = 'tab';
    tabBtn.dataset.tab = tabId;
    tabBtn.title = url;
    tabBtn.innerHTML = `<span>${title}</span><span class="closeBtn">&times;</span>`;
    tabBar.insertBefore(tabBtn, addTabBtn);
    const iframe = document.createElement('iframe');
    iframe.className = 'proxyIframe tabContent';
    iframe.dataset.tab = tabId;
    iframe.src = url;
    contentArea.appendChild(iframe);
    activateTab(tabId);
    tabBtn.querySelector('.closeBtn').addEventListener('click', e => {
      e.stopPropagation();
      closeTab(tabId);
    });
    tabBtn.addEventListener('click', () => activateTab(tabId));
  }

  function activateTab(tabId) {
    if (!tabBar || !contentArea) return;
    [...tabBar.querySelectorAll('button.tab')].forEach(btn => btn.classList.remove('active'));
    [...contentArea.querySelectorAll('.tabContent')].forEach(div => div.classList.remove('active'));
    if (tabId === 'home') {
      if (homeTabBtn) homeTabBtn.classList.add('active');
      if (homeContent) homeContent.classList.add('active');
      const searchForm = document.getElementById('searchForm');
      if (searchForm) searchForm.style.display = 'inline-block';
      const urlInput = document.getElementById('urlInput');
      if (urlInput) urlInput.value = '';
    } else {
      const searchForm = document.getElementById('searchForm');
      if (searchForm) searchForm.style.display = 'none';
      const btn = tabBar.querySelector(`button[data-tab="${tabId}"]`);
      const iframe = contentArea.querySelector(`iframe[data-tab="${tabId}"]`);
      if (btn) btn.classList.add('active');
      if (iframe) iframe.classList.add('active');
    }
  }

  function closeTab(tabId) {
    if (!tabBar || !contentArea) return;
    const btn = tabBar.querySelector(`button[data-tab="${tabId}"]`);
    const iframe = contentArea.querySelector(`iframe[data-tab="${tabId}"]`);
    const wasActive = btn && btn.classList.contains('active');
    if (btn) btn.remove();
    if (iframe) iframe.remove();
    if (wasActive && homeTabBtn) activateTab('home');
  }

  if (addTabBtn) {
    addTabBtn.addEventListener('click', () => createTab('https://startpage.com', 'New Tab'));
  }
  if (homeTabBtn) {
    homeTabBtn.addEventListener('click', () => activateTab('home'));
  }

  const sidebarButtons = document.querySelectorAll('.sidebar button[data-url]');
  sidebarButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const url = btn.dataset.url;
      const title = btn.title || url;
      createTab(url, title);
    });
  });

  const sidebarHomeBtn = document.getElementById('sidebarHomeBtn');
  if (sidebarHomeBtn) {
    sidebarHomeBtn.addEventListener('click', () => activateTab('home'));
  }

  function runStealthMode() {
    localStorage.setItem('stealthModeEnabled', JSON.stringify(false));
    const cloak = localStorage.getItem('auraaCloak') || 'default';
    let title = 'Auraa';
    let icon = 'icon.png';
    if (cloak !== 'default') {
      const parts = cloak.split('|');
      if (parts.length === 2) {
        icon = parts[0];
        title = parts[1];
      }
    }
    const src = window.location.href;
    const popup = window.open('about:blank', '_blank');
    if (!popup || popup.closed) {
      alert('Popup blocked. Please allow popups for Cloaking to work.');
      return;
    }
    popup.document.write(`
      <html>
        <head>
          <title>${title}</title>
          <link rel="icon" href="${icon}">
          <style>
            html, body { margin:0; padding:0; height:100%; overflow:hidden; }
            iframe { width:100%; height:100%; border:none; }
          </style>
        </head>
        <body>
          <iframe src="${src}"></iframe>
        </body>
      </html>
    `);
    popup.document.close();
    window.location.href = 'https://www.google.com';
  }

  function generateSearchUrl(query) {
    try {
      const url = new URL(query);
      return url.toString();
    } catch {
      try {
        const url = new URL(`https://${query}`);
        if (url.hostname.includes('.')) return url.toString();
      } catch {}
    }
    return `https://startpage.com/search?q=${encodeURIComponent(query)}&source=web`;
  }

  const blankModeCheckbox = document.getElementById('blankMode');
  if (blankModeCheckbox) {
    const stealthEnabled = JSON.parse(localStorage.getItem('stealthModeEnabled') || 'false');
    blankModeCheckbox.checked = stealthEnabled;
    let stealthModeOpened = JSON.parse(localStorage.getItem('stealthModeOpened') || 'false');
    if (stealthEnabled && !stealthModeOpened) {
      runStealthMode();
      localStorage.setItem('stealthModeOpened', 'true');
      stealthModeOpened = true;
    }
    blankModeCheckbox.addEventListener('change', () => {
      const isChecked = blankModeCheckbox.checked;
      localStorage.setItem('stealthModeEnabled', JSON.stringify(isChecked));
      if (isChecked) {
        if (!stealthModeOpened) {
          runStealthMode();
          localStorage.setItem('stealthModeOpened', 'true');
          stealthModeOpened = true;
        }
      } else {
        localStorage.setItem('stealthModeOpened', 'false');
        stealthModeOpened = false;
      }
    });
  }

  const messages = [
    'Sydney was here',
    'bebby was here',
    'Unlimited Aura.',
    'aura level 10000',
    'If your teacher catches you, I was never here.',
    'Advanced blob proxy.',
    'Made using Tide',
    'Tide creds go to Mizzery'
  ];
  const randomIndex = Math.floor(Math.random() * messages.length);
  const msgEl = document.getElementById('randomMessage');
  if (msgEl) msgEl.textContent = messages[randomIndex];

  if ('getBattery' in navigator) {
    navigator.getBattery().then(battery => {
      function updateBattery() {
        const batteryEl = document.getElementById('battery');
        if (batteryEl) batteryEl.textContent = `${Math.round(battery.level * 100)}% ⚡`;
      }
      updateBattery();
      battery.addEventListener('levelchange', updateBattery);
    });
  } else {
    const batteryEl = document.getElementById('battery');
    if (batteryEl) batteryEl.textContent = '⚡ N/A';
  }

  function updateTime() {
    const now = new Date();
    const timeEl = document.getElementById('time');
    if (timeEl) timeEl.textContent = now.toLocaleTimeString();
  }
  setInterval(updateTime, 1000);
  updateTime();

  if ('geolocation' in navigator) {
    navigator.geolocation.getCurrentPosition(pos => {
      const lat = pos.coords.latitude;
      const lon = pos.coords.longitude;
      fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&timezone=auto`)
        .then(res => res.json())
        .then(data => {
          const current = data.current_weather;
          if (!current) throw new Error('No weather data');
          const temp = current.temperature;
          const code = current.weathercode;
          const icon = getWeatherEmoji(code);
          const desc = getWeatherDescription(code);
          const iconEl = document.getElementById('weatherIcon');
          const tempEl = document.getElementById('temperature');
          const textEl = document.getElementById('weatherText');
          if (iconEl) iconEl.textContent = icon;
          if (tempEl) tempEl.textContent = `${temp}°C`;
          if (textEl) textEl.textContent = desc;
        })
        .catch(() => {});
    }, () => {}, { timeout: 10000 });
  }

  function getWeatherEmoji(code) {
    if ([0,1].includes(code)) return '☀️';
    if ([2,3].includes(code)) return '⛅';
    if ([45,48].includes(code)) return '🌫️';
    if ([51,53,55,56,57].includes(code)) return '🌧️';
    if ([61,63,65,66,67,80,81,82].includes(code)) return '🌦️';
    if ([71,73,75,77,85,86].includes(code)) return '❄️';
    if ([95,96,99].includes(code)) return '⛈️';
    return '❓';
  }

  function getWeatherDescription(code) {
    const map = {
      0: 'Clear sky',
      1: 'Mostly clear',
      2: 'Partly cloudy',
      3: 'Overcast',
      45: 'Fog',
      48: 'Rime fog',
      51: 'Light drizzle',
      53: 'Moderate drizzle',
      55: 'Dense drizzle',
      56: 'Light freezing drizzle',
      57: 'Dense freezing drizzle',
      61: 'Slight rain',
      63: 'Moderate rain',
      65: 'Heavy rain',
      66: 'Light freezing rain',
      67: 'Heavy freezing rain',
      71: 'Slight snowfall',
      73: 'Moderate snowfall',
      75: 'Heavy snowfall',
      77: 'Snow grains',
      80: 'Light rain showers',
      81: 'Moderate rain showers',
      82: 'Heavy rain showers',
      85: 'Light snow showers',
      86: 'Heavy snow showers',
      95: 'Thunderstorm',
      96: 'Thunderstorm with light hail',
      99: 'Thunderstorm with heavy hail'
    };
    return map[code] || 'Unknown';
  }

  const searchForm = document.getElementById('searchForm');
  if (searchForm) {
    searchForm.addEventListener('submit', e => {
      e.preventDefault();
      const query = document.getElementById('urlInput').value.trim();
      if (!query) return;
      if (typeof __uv$config === 'undefined') {
        alert('Ultraviolet proxy not loaded.');
        return;
      }
      const rawUrl = generateSearchUrl(query);
      const encoded = __uv$config.encodeUrl(rawUrl);
      const proxyUrl = __uv$config.prefix + encoded;
      createTab(proxyUrl, query);
    });
  }
});
