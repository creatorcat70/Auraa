function runStealthMode() {
  localStorage.setItem("stealthModeEnabled", "false");
  const cloak = localStorage.getItem("auraaCloak") || "default";
  let title = "Auraa";
  let icon = "icon.png";
  if (cloak !== "default") {
    const parts = cloak.split("|");
    if (parts.length === 2) {
      icon = parts[0];
      title = parts[1];
    }
  }
  const src = window.location.href;
  const popup = window.open("about:blank", "_blank");
  if (!popup || popup.closed) {
    alert("Popup blocked. Please allow popups for Cloaking to work.");
    return;
  }
  popup.document.write(`
    <html>
      <head>
        <title>${title}</title>
        <link rel="icon" href="${icon}">
        <style>
          html, body {
            margin: 0;
            padding: 0;
            height: 100%;
            overflow: hidden;
          }
          iframe {
            width: 100%;
            height: 100%;
            border: none;
          }
        </style>
      </head>
      <body>
        <iframe src="${src}"></iframe>
      </body>
    </html>
  `);
  popup.document.close();
  window.location.href = "https://www.google.com";
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

window.onload = function () {
  const loaderEl = document.getElementById("loader");
  const contentEl = document.getElementById("content");
  if (loaderEl) loaderEl.style.display = "none";
  if (contentEl) contentEl.style.display = "block";

  if (navigator.getBattery) {
    navigator.getBattery().then(battery => {
      function updateBattery() {
        const batteryEl = document.getElementById("battery");
        if (batteryEl) batteryEl.textContent = `${Math.round(battery.level * 100)}% ⚡`;
      }
      updateBattery();
      battery.addEventListener("levelchange", updateBattery);
    });
  } else {
    const batteryEl = document.getElementById("battery");
    if (batteryEl) batteryEl.textContent = "⚡ N/A";
  }

  function updateTime() {
    const now = new Date();
    const timeEl = document.getElementById("time");
    if (timeEl) timeEl.textContent = now.toLocaleTimeString();
  }
  setInterval(updateTime, 1000);
  updateTime();

  const checkbox = document.getElementById("blankMode");
  if (checkbox) {
    const stealthEnabled = JSON.parse(localStorage.getItem("stealthModeEnabled")) || false;
    checkbox.checked = stealthEnabled;
    let stealthModeOpened = JSON.parse(localStorage.getItem("stealthModeOpened")) || false;
    if (stealthEnabled && !stealthModeOpened) {
      runStealthMode();
      localStorage.setItem("stealthModeOpened", "true");
    }
    checkbox.addEventListener("change", function () {
      const isChecked = checkbox.checked;
      localStorage.setItem("stealthModeEnabled", JSON.stringify(isChecked));
      if (isChecked) {
        if (!stealthModeOpened) {
          runStealthMode();
          localStorage.setItem("stealthModeOpened", "true");
          stealthModeOpened = true;
        }
      } else {
        localStorage.setItem("stealthModeOpened", "false");
        stealthModeOpened = false;
      }
    });
  }

  const messages = [
    "Sydney was here",
    "bebby was here",
    "Unlimited Aura.",
    "aura level 10000",
    "If your teacher catches you, I was never here.",
    "Advanced blob proxy.",
    "Made using Tide",
    "Tide creds go to Mizzery"
  ];
  const randomIndex = Math.floor(Math.random() * messages.length);
  const msgEl = document.getElementById("randomMessage");
  if (msgEl) msgEl.textContent = messages[randomIndex];

  if ("geolocation" in navigator) {
    navigator.geolocation.getCurrentPosition(pos => {
      const lat = pos.coords.latitude;
      const lon = pos.coords.longitude;
      fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&timezone=auto`)
        .then(res => res.json())
        .then(data => {
          const current = data.current_weather;
          if (!current) return;
          const temp = current.temperature;
          const code = current.weathercode;
          const icon = getWeatherEmoji(code);
          const desc = getWeatherDescription(code);
          const iconEl = document.getElementById("weatherIcon");
          const tempEl = document.getElementById("temperature");
          const textEl = document.getElementById("weatherText");
          if (iconEl) iconEl.textContent = icon;
          if (tempEl) tempEl.textContent = `${temp}°C`;
          if (textEl) textEl.textContent = desc;
        });
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
      0:"Clear sky",
      1:"Mostly clear",
      2:"Partly cloudy",
      3:"Overcast",
      45:"Fog",
      48:"Rime fog",
      51:"Light drizzle",
      53:"Moderate drizzle",
      55:"Dense drizzle",
      56:"Light freezing drizzle",
      57:"Dense freezing drizzle",
      61:"Slight rain",
      63:"Moderate rain",
      65:"Heavy rain",
      66:"Light freezing rain",
      67:"Heavy freezing rain",
      71:"Slight snowfall",
      73:"Moderate snowfall",
      75:"Heavy snowfall",
      77:"Snow grains",
      80:"Light rain showers",
      81:"Moderate rain showers",
      82:"Heavy rain showers",
      85:"Light snow showers",
      86:"Heavy snow showers",
      95:"Thunderstorm",
      96:"Thunderstorm with light hail",
      99:"Thunderstorm with heavy hail"
    };
    return map[code]||"Unknown";
  }
};

document.querySelectorAll('a').forEach(link=>{
  link.addEventListener('click',()=>{
    const loader=document.getElementById("loader");
    const content=document.getElementById("content");
    if(loader) loader.style.display="block";
    if(content) content.style.display="none";
    const iframe=document.getElementById("gameFrame");
    if(iframe){
      iframe.onload=()=>{
        if(loader) loader.style.display="none";
        if(content) content.style.display="block";
      };
    }
  });
});

const searchForm=document.getElementById("searchForm");
if(searchForm){
  searchForm.addEventListener("submit",function(e){
    e.preventDefault();
    const query=document.getElementById("urlInput").value.trim();
    if(!query) return;
    if(typeof __uv$config==="undefined"){
      alert("Ultraviolet proxy not loaded.");
      return;
    }
    const rawUrl=generateSearchUrl(query);
    const encoded=__uv$config.encodeUrl(rawUrl);
    const proxyUrl=__uv$config.prefix+encoded;
    if(typeof createTab==="function"){
      createTab(proxyUrl, query);
    } else {
      window.location.href=proxyUrl;
    }
  });
}
