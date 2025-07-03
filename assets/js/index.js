<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Auraa</title>
  <link rel="icon" href="favicon.ico" type="image/x-icon" />
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css">
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;700&display=swap');

    body {
      margin: 0;
      padding: 0;
      background: linear-gradient(135deg, #2a003f, #000000);
      color: #fff;
      font-family: 'Poppins', sans-serif;
      height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;
    }

    .container {
      text-align: center;
    }

    .title {
      font-size: 4rem;
      font-weight: 700;
      background: linear-gradient(to right, #c77dff, #7b2cbf);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      text-shadow: 0 0 10px #9d4edd, 0 0 20px #7b2cbf;
    }

    .dot {
      color: #9d4edd;
    }

    input[type="text"] {
      padding: 12px;
      width: 300px;
      border: none;
      border-radius: 25px;
      background: rgba(50, 0, 80, 0.9);
      color: white;
      font-size: 1rem;
      outline: none;
      transition: 0.3s;
    }

    button {
      margin-top: 15px;
      padding: 10px 30px;
      font-size: 1rem;
      border: none;
      border-radius: 25px;
      background: #7b2cbf;
      color: white;
      cursor: pointer;
      transition: 0.3s;
    }

    button:hover {
      background: #9d4edd;
    }

    .options {
      margin-top: 10px;
    }

    .footer {
      position: fixed;
      bottom: 10px;
      right: 15px;
      font-size: 0.9rem;
      color: rgba(255, 255, 255, 0.8);
    }

    .loader {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 1.5rem;
      background: #2a003f;
      z-index: 999;
    }
  </style>
</head>
<body>
  <div id="loader" class="loader">Loading...</div>

  <div class="container" id="content" style="display:none;">
    <h1 class="title">Auraa<span class="dot">.</span></h1>

    <form id="searchForm">
      <input type="text" id="urlInput" placeholder="Search for more Aura..." autocomplete="off" />
      <div class="options">
        <label><input type="checkbox" id="blankMode" /> Cloak (stealth mode)</label>
      </div>
      <button type="submit">Start</button>
    </form>
  </div>

  <div class="footer">Auraa | By Mizzery & thefakesydney</div>

  <script src="/active/uv/uv.bundle.js" defer></script>
  <script src="/active/uv/uv.config.js" defer></script>
  <script>
    function runStealthMode() {
      const sites = [
        {
          title: "Google",
          icon: "https://www.google.com/favicon.ico",
          url: "https://www.google.com"
        },
        {
          title: "Google Classroom",
          icon: "https://classroom.google.com/favicon.ico",
          url: "https://classroom.google.com"
        },
        {
          title: "Google Drive",
          icon: "https://ssl.gstatic.com/docs/doclist/images/infinite_arrow_favicon_5.ico",
          url: "https://drive.google.com"
        },
        {
          title: "Google Docs",
          icon: "https://ssl.gstatic.com/docs/doclist/images/infinite_arrow_favicon_5.ico",
          url: "https://docs.google.com"
        },
        {
          title: "Khan Academy",
          icon: "https://www.khanacademy.org/favicon.ico",
          url: "https://www.khanacademy.org"
        },
        {
          title: "Desmos",
          icon: "https://www.desmos.com/favicon.ico",
          url: "https://www.desmos.com"
        }
      ];

      const site = sites[Math.floor(Math.random() * sites.length)];
      const src = window.location.href;

      const popup = window.open("about:blank", "_blank");
      if (!popup || popup.closed) {
        alert("Popup blocked. Please allow popups for cloaking to work.");
        return;
      }

      popup.document.write(`
        <html>
          <head>
            <title>${site.title}</title>
            <link rel="icon" href="${site.icon}">
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

      window.location.href = site.url;
    }

    window.onload = function () {
      document.getElementById('loader').style.display = 'none';
      document.getElementById('content').style.display = 'block';

      const stealth = JSON.parse(localStorage.getItem("stealthModeEnabled")) || false;
      const checkbox = document.getElementById("blankMode");
      checkbox.checked = stealth;

      if (stealth) runStealthMode();

      checkbox.addEventListener("change", function () {
        const isChecked = checkbox.checked;
        localStorage.setItem("stealthModeEnabled", JSON.stringify(isChecked));
        if (isChecked) runStealthMode();
      });
    };

    document.getElementById('searchForm').addEventListener('submit', async function (e) {
      e.preventDefault();
      let query = document.getElementById('urlInput').value.trim();
      if (!query) return;

      const rawUrl = generateSearchUrl(query);
      const encoded = __uv$config.encodeUrl(rawUrl);
      const proxyUrl = __uv$config.prefix + encoded;

      document.getElementById('loader').style.display = 'block';
      document.getElementById('content').style.display = 'none';

      window.location.href = proxyUrl;
    });

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
      return `https://startpage.com/search?q=${encodeURIComponent(query)}`;
    }
  </script>
</body>
</html>
