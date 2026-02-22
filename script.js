class SightBrowser {
  constructor() {
    this.tabs = [];
    this.activeTabId = null;
    this.settings = { cursor: true, background: true, engine: 'https://www.google.com/search?q=' };
    this.init();
  }

  init() {
    this.loadSettings();
    this.createTab();
    this.updateTime();
    this.cursorSetup();
    this.eventSetup();
    setInterval(() => this.updateTime(), 1000);
  }

  createTab(url = null) {
    const id = Date.now() + Math.random();
    const tab = { id, title: url ? 'Loading...' : 'New Tab', url: null, isHome: !url };
    this.tabs.push(tab);
    this.renderTabs();
    this.activeTabId = id;
    if (tab.isHome) this.showHomepage(id);
    else this.loadURL(url, id);
  }

  renderTabs() {
    const bar = document.getElementById('tabsBar');
    bar.innerHTML = '<button class="new-tab-btn" id="newTab"><i class="fas fa-plus"></i></button>';
    this.tabs.forEach(tab => {
      const div = document.createElement('div');
      div.className = `tab ${tab.id === this.activeTabId ? 'active' : ''}`;
      div.dataset.id = tab.id;
      div.innerHTML = `<span>${tab.title.slice(0,20)}${tab.title.length > 20 ? '...' : ''}</span><i class="fas fa-times tab-close"></i>`;
      bar.appendChild(div);
    });
  }

  // ✅ FIXED: Site 1 Homepage + Site 2 Search
  showHomepage(tabId) {
    const area = document.getElementById('contentArea');
    const iframe = document.createElement('iframe');
    iframe.dataset.id = tabId;
    iframe.className = 'browser-frame';
    
    iframe.srcdoc = `<!DOCTYPE html>
<html>
<head>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      background: rgba(0,0,0,0.7) url('data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACwAAAAAAQABAAACAkQBADs=') center/cover;
      color: white; font-family: Arial, sans-serif; min-height: 100vh;
      display: flex; flex-direction: column; align-items: center; padding: 40px 20px;
      text-align: center;
    }
    h1 { 
      font-size: 3.5rem; font-weight: 800; margin: 30px 0 40px;
      background: linear-gradient(130deg, #fff, #dcdcdc); -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      font-family: 'Whitney', Arial, sans-serif;
    }
    .search-container {
      max-width: 500px; width: 100%; margin: 30px 0;
    }
    .search-input {
      width: 100%; height: 65px; padding: 0 25px; font-size: 18px;
      border: 3px solid rgba(138,43,226,0.7); border-radius: 35px;
      background: rgba(255,255,255,0.12); color: white; backdrop-filter: blur(15px);
      font-size: 18px; outline: none; transition: all 0.3s;
    }
    .search-input::placeholder { color: #aaa; }
    .search-input:focus {
      border-color: #8a2be2; box-shadow: 0 0 25px rgba(138,43,226,0.5);
    }
    .nav-buttons {
      display: flex; flex-wrap: wrap; justify-content: center; gap: 20px;
      margin-top: 50px; max-width: 800px;
    }
    .nav-btn {
      background: rgba(35,35,40,0.95); color: #fff; padding: 16px 32px;
      border-radius: 12px; text-decoration: none; font-size: 16px; font-weight: 500;
      border: 1px solid rgba(255,255,255,0.15); display: inline-flex; align-items: center;
      gap: 12px; backdrop-filter: blur(10px); transition: all 0.3s; min-width: 140px;
      justify-content: center;
    }
    .nav-btn:hover {
      background: rgba(55,55,60,0.95); transform: translateY(-3px);
      box-shadow: 0 10px 25px rgba(0,0,0,0.4);
    }
  </style>
</head>
<body>
  <h1>𝙨𝙞𝙜𝙝𝙩</h1>
  
  <div class="search-container">
    <input class="search-input" id="homeSearch" placeholder="Type URL (google.com) or search term and press Enter..." autofocus>
  </div>
  
  <div class="nav-buttons">
    <a class="nav-btn" href="https://sites.google.com/view/voteubg/prozy" target="_blank">
      <i class="fas fa-globe"></i> Prozy
    </a>
    <a class="nav-btn" href="https://sites.google.com/view/voteubg/learning" target="_blank">
      <i class="fas fa-gamepad"></i> Gxmes
    </a>
    <a class="nav-btn" href="https://sites.google.com/view/voteubg/movies" target="_blank">
      <i class="fas fa-clapperboard"></i> Movies
    </a>
    <a class="nav-btn" href="https://sites.google.com/view/voteubg/partn" target="_blank">
      <i class="fas fa-handshake"></i> Partners
    </a>
  </div>

  <script>
    document.getElementById('homeSearch').addEventListener('keypress', function(e) {
      if (e.key === 'Enter') {
        const query = this.value.trim();
        if (query) {
          window.parent.postMessage({action: 'search', query: query}, '*');
          this.value = '';
        }
      }
    });
  </script>
</body>
</html>`;
    
    area.appendChild(iframe);
    this.switchTab(tabId);
  }

  loadURL(query, tabId) {
    const tab = this.tabs.find(t => t.id === tabId);
    if (!tab) return;

    let url = query;
    if (!query.startsWith('http') && !query.includes('.')) {
      url = this.settings.engine + encodeURIComponent(query);
    } else if (!query.startsWith('http')) {
      url = 'https://' + query;
    }

    tab.url = url;
    tab.title = query.slice(0, 30) + (query.length > 30 ? '...' : '');
    
    const iframe = document.createElement('iframe');
    iframe.dataset.id = tabId;
    iframe.className = 'browser-frame';
    iframe.src = `https://YOUR-WORKER.workers.dev/?q=${encodeURIComponent(url)}`; // ← REPLACE THIS
    document.getElementById('contentArea').appendChild(iframe);
    this.switchTab(tabId);
    this.renderTabs();
  }

  switchTab(id) {
    document.querySelectorAll('.browser-frame').forEach(f => f.classList.remove('active'));
    const frame = document.querySelector(`[data-id="${id}"]`);
    if (frame) frame.classList.add('active');
    this.activeTabId = id;
    this.renderTabs();
  }

  closeTab(id) {
    const frame = document.querySelector(`[data-id="${id}"]`);
    if (frame) frame.remove();
    this.tabs = this.tabs.filter(t => t.id !== id);
    this.renderTabs();
    if (this.tabs.length === 0) this.createTab();
    else this.switchTab(this.tabs[this.tabs.length - 1]?.id || null);
  }

  updateTime() {
    const now = new Date();
    document.getElementById('currentTime').textContent = now.toLocaleTimeString('en-US', { hour12: true });
    document.getElementById('currentDate').textContent = now.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
  }

  cursorSetup() {
    const cursor = document.getElementById('cursor');
    document.addEventListener('mousemove', e => {
      if (this.settings.cursor) {
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';
      }
    });
    
    // Hover effects
    document.addEventListener('mouseover', e => {
      if (this.settings.cursor && (e.target.matches('button, a, .tab, input, .nav-btn'))) {
        cursor.classList.add('hover');
      }
    });
    document.addEventListener('mouseout', e => {
      if (this.settings.cursor) cursor.classList.remove('hover');
    });
  }

  eventSetup() {
    // Listen for homepage search
    window.addEventListener('message', e => {
      if (e.data.action === 'search') {
        this.loadURL(e.data.query, this.activeTabId);
      }
    });

    document.addEventListener('click', e => {
      if (e.target.id === 'newTab') this.createTab();
      if (e.target.closest('.tab-close')) {
        this.closeTab(parseFloat(e.target.closest('.tab').dataset.id));
      }
      if (e.target.closest('.tab') && !e.target.closest('.tab-close')) {
        this.switchTab(parseFloat(e.target.closest('.tab').dataset.id));
      }
    });

    document.getElementById('settingsBtn').onclick = () => {
      document.getElementById('settingsModal').style.display = 'block';
    };

    document.getElementById('closeSettingsBtn').onclick = () => {
      document.getElementById('settingsModal').style.display = 'none';
    };

    document.getElementById('clearTabsBtn').onclick = () => {
      this.clearAllTabs();
      document.getElementById('settingsModal').style.display = 'none';
    };

    document.querySelectorAll('#cursorToggle, #bgToggle').forEach(cb => {
      cb.onchange = () => this.saveSettings();
    });
    document.getElementById('defaultEngine').onchange = () => this.saveSettings();
  }

  saveSettings() {
    this.settings.cursor = document.getElementById('cursorToggle').checked;
    this.settings.background = document.getElementById('bgToggle').checked;
    this.settings.engine = document.getElementById('defaultEngine').value;
    
    document.body.style.background = this.settings.background ? 
      "url('https://wallpapers-clan.com/wp-content/uploads/2024/03/starfall-night-sky-mountains-aesthetic-gif-preview-desktop-wallpaper.gif') no-repeat center center fixed" : '#000';
    document.getElementById('cursor').style.display = this.settings.cursor ? 'block' : 'none';
    localStorage.setItem('sight-settings', JSON.stringify(this.settings));
  }

  loadSettings() {
    const saved = localStorage.getItem('sight-settings');
    if (saved) {
      Object.assign(this.settings, JSON.parse(saved));
      document.getElementById('cursorToggle').checked = this.settings.cursor;
      document.getElementById('bgToggle').checked = this.settings.background;
      document.getElementById('defaultEngine').value = this.settings.engine;
      this.saveSettings();
    }
  }

  clearAllTabs() {
    document.getElementById('contentArea').innerHTML = '';
    this.tabs = [];
    this.createTab();
  }
}

// Global functions for onclick
window.clearAllTabs = () => window.SightBrowser?.clearAllTabs();
window.toggleSettings = () => document.getElementById('settingsModal').style.display = 'none';

window.SightBrowser = new SightBrowser();

