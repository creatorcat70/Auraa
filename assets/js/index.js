function runStealthMode() {
  const title = "Google";
  const icon = "https://www.google.com/favicon.ico";
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

  // Prevent repeated cloaking
  localStorage.setItem("stealthModeEnabled", "false");

  // Redirect this tab away
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
  document.getElementById("loader").style.display = "none";
  document.getElementById("content").style.display = "block";

  // Battery indicator
  navigator.getBattery?.().then(battery => {
    function updateBattery() {
      document.getElementById("battery").textContent = `Battery: ${Math.round(battery.level * 100)}% ⚡`;
    }
    updateBattery();
    battery.addEventListener("levelchange", updateBattery);
  });

  // Clock
  function updateTime() {
    const now = new Date();
    document.getElementById("time").textContent = "Time: " + now.toLocaleTimeString();
  }
  setInterval(updateTime, 1000);
  updateTime();

  // Stealth mode toggle
  const stealth = JSON.parse(localStorage.getItem("stealthModeEnabled")) || false;
  const checkbox = document.getElementById("blankMode");
  checkbox.checked = stealth;

  if (stealth) runStealthMode();

  checkbox.addEventListener("change", function () {
    const isChecked = checkbox.checked;
    localStorage.setItem("stealthModeEnabled", JSON.stringify(isChecked));
    if (isChecked) runStealthMode();
  });

  // Random message display
  const messages = [
    "Sydney was here",
    "bebby was here",
    "Unlimited Aura.",
    "aura level 10000"
  ];
  const randomIndex = Math.floor(Math.random() * messages.length);
  document.getElementById("randomMessage").textContent = messages[randomIndex];
};

// Optional <a> clicks for game loading (if any)
document.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    const gameName = link.textContent;
    console.log("Loading " + gameName + "...");

    document.getElementById("loader").style.display = "block";
    document.getElementById("content").style.display = "none";

    const iframe = document.getElementById("gameFrame");
    if (iframe) {
      iframe.onload = function () {
        document.getElementById("loader").style.display = "none";
        document.getElementById("content").style.display = "block";
      };
    }
  });
});

// Search form submit with UV proxy
document.getElementById("searchForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const query = document.getElementById("urlInput").value.trim();
  if (!query) return;

  if (typeof __uv$config === "undefined") {
    alert("Ultraviolet proxy not loaded.");
    return;
  }

  const rawUrl = generateSearchUrl(query);
  const encoded = __uv$config.encodeUrl(rawUrl);
  const proxyUrl = __uv$config.prefix + encoded;

  document.getElementById("loader").style.display = "block";
  document.getElementById("content").style.display = "none";

  window.location.href = proxyUrl;
});
