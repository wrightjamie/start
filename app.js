let isEditMode = false;
let sidebarEl = null;

function parseSimpleMarkdown(text) {
  if (!text) return '';
  let html = text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  html = html.replace(/\*(.*?)\*/g, '<strong>$1</strong>');
  html = html.replace(/_(.*?)_/g, '<em>$1</em>');
  
  const lines = html.split('\n');
  let inList = false;
  let parsedLines = [];
  
  for (let i = 0; i < lines.length; i++) {
    let line = lines[i];
    if (line.trim().startsWith('- ')) {
      if (!inList) {
        parsedLines.push('<ul class="notes-list">');
        inList = true;
      }
      parsedLines.push(`<li>${line.trim().substring(2)}</li>`);
    } else {
      if (inList) {
        parsedLines.push('</ul>');
        inList = false;
      }
      parsedLines.push(line);
    }
  }
  if (inList) {
    parsedLines.push('</ul>');
  }
  
  return parsedLines.join('\n');
}

let bgIndex = 0;
let bgTimer = null;

function applyBackground() {
  if (CONFIG.backgrounds && CONFIG.backgrounds.length > 0) {
    document.body.style.backgroundImage = `url('${CONFIG.backgrounds[bgIndex]}')`;
    bgIndex = (bgIndex + 1) % CONFIG.backgrounds.length;
  }
}

document.addEventListener('DOMContentLoaded', () => {
  if (typeof CONFIG !== 'undefined') {
    initApp(CONFIG);
    initEditorUI();
  } else {
    console.error('Config not found!');
    document.getElementById('page-title').textContent = "Error Loading Config";
  }
});

function initEditorUI() {
  const toggleBtn = document.createElement('button');
  toggleBtn.className = 'edit-toggle-btn glass-panel';
  toggleBtn.innerHTML = '<i class="ph ph-pencil-simple"></i>';
  toggleBtn.id = 'main-edit-toggle';
  toggleBtn.title = 'Edit Dashboard';
  toggleBtn.onclick = () => {
    isEditMode = true;
    document.body.classList.add('edit-mode-active');
    updateApp();
    toggleSidebar(true);
  };
  document.body.appendChild(toggleBtn);

  if (CONFIG.backgrounds && CONFIG.backgrounds.length > 1) {
    const nextBgBtn = document.createElement('button');
    nextBgBtn.className = 'next-bg-btn glass-panel';
    nextBgBtn.innerHTML = '<i class="ph ph-image"></i>';
    nextBgBtn.id = 'main-next-bg';
    nextBgBtn.title = 'Next Background';
    nextBgBtn.onclick = () => {
      applyBackground();
      if (bgTimer && CONFIG.bgInterval > 0) {
        clearInterval(bgTimer);
        bgTimer = setInterval(applyBackground, CONFIG.bgInterval * 60000);
      }
    };
    document.body.appendChild(nextBgBtn);
  }
}

function toggleSidebar(show) {
  const toggleBtn = document.getElementById('main-edit-toggle');
  const nextBgBtn = document.getElementById('main-next-bg');
  if (show) {
    if(toggleBtn) toggleBtn.style.display = 'none';
    if(nextBgBtn) nextBgBtn.style.display = 'none';
    sidebarEl = document.createElement('div');
    sidebarEl.className = 'editor-sidebar glass-panel';
    sidebarEl.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
        <div class="sidebar-tabs" style="margin-bottom: 0; border-bottom: none;">
          <button id="tab-btn-settings" class="sidebar-tab-btn active">Settings</button>
          <button id="tab-btn-code" class="sidebar-tab-btn">Code</button>
        </div>
        <button id="close-editor-btn" style="background: none; border: none; color: white; cursor: pointer; font-size: 1.2rem;" title="Close Editor"><i class="ph ph-x"></i></button>
      </div>
      
      <div id="tab-settings" class="sidebar-tab-content active">
        <div class="settings-form" style="margin-top: 1rem;">
          <div class="form-group">
            <label>Page Title</label>
            <input type="text" id="setting-title" value="${CONFIG.title || ''}" />
          </div>
          <div class="form-group">
            <label>Logo URL</label>
            <input type="text" id="setting-logo" value="${CONFIG.logoUrl || ''}" placeholder="assets/roundel.svg" />
          </div>
          <div class="form-group">
            <label>Max Width</label>
            <input type="text" id="setting-width" value="${CONFIG.maxWidth || '1400px'}" />
          </div>
          <div class="form-group">
            <label>Background Cycle (mins)</label>
            <input type="number" id="setting-bg-int" value="${CONFIG.bgInterval || 0}" min="0" />
          </div>
          <div class="form-group">
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <label>Background URLs</label>
              <button id="add-bg-btn" style="background: none; border: none; color: var(--raf-light-blue); cursor: pointer;" title="Add Background"><i class="ph ph-plus"></i></button>
            </div>
            <details>
              <summary style="cursor: pointer; color: var(--raf-light-blue); margin-bottom: 0.5rem; font-size: 0.85rem;">Show Backgrounds...</summary>
              <div id="bg-list-container" style="display: flex; flex-direction: column; gap: 0.5rem;"></div>
            </details>
          </div>
        </div>
      </div>

      <div id="tab-code" class="sidebar-tab-content">
        <p style="font-size: 0.85rem; color: var(--text-secondary); margin: 1rem 0 0.5rem 0;">Copy this code and paste it into your <strong>config.js</strong> file on your NAS to save your layout permanently.</p>
        <a href="https://phosphoricons.com/" target="_blank" style="color: var(--raf-light-blue); text-decoration: none; font-size: 0.85rem; margin-bottom: 1rem; display: inline-flex; align-items: center; gap: 0.25rem;"><i class="ph ph-arrow-square-out"></i> Browse Phosphor Icons</a>
        <textarea id="config-output" readonly></textarea>
        <div style="display: flex; gap: 0.5rem;">
          <button id="copy-config-btn" class="glass-panel" style="flex: 1;"><i class="ph ph-copy"></i> Copy</button>
          <button id="dl-config-btn" class="glass-panel" style="flex: 1;"><i class="ph ph-download-simple"></i> Download</button>
        </div>
      </div>
    `;
    document.body.appendChild(sidebarEl);
    updateConfigOutput();
    
    // Bind Tabs
    const tabBtnSettings = document.getElementById('tab-btn-settings');
    const tabBtnCode = document.getElementById('tab-btn-code');
    const tabSettings = document.getElementById('tab-settings');
    const tabCode = document.getElementById('tab-code');

    tabBtnSettings.onclick = () => {
      tabBtnSettings.classList.add('active');
      tabBtnCode.classList.remove('active');
      tabSettings.classList.add('active');
      tabCode.classList.remove('active');
    };

    tabBtnCode.onclick = () => {
      tabBtnCode.classList.add('active');
      tabBtnSettings.classList.remove('active');
      tabCode.classList.add('active');
      tabSettings.classList.remove('active');
    };

    // Bind Settings Forms
    const updateConfigSetting = (key, val) => {
      CONFIG[key] = val;
      updateApp();
    };

    document.getElementById('setting-title').oninput = (e) => updateConfigSetting('title', e.target.value);
    document.getElementById('setting-logo').oninput = (e) => updateConfigSetting('logoUrl', e.target.value);
    document.getElementById('setting-width').oninput = (e) => updateConfigSetting('maxWidth', e.target.value);
    document.getElementById('setting-bg-int').onchange = (e) => updateConfigSetting('bgInterval', parseFloat(e.target.value) || 0);

    const renderBgList = () => {
      const container = document.getElementById('bg-list-container');
      if (!container) return;
      container.innerHTML = '';
      (CONFIG.backgrounds || []).forEach((bgUrl, i) => {
        const row = document.createElement('div');
        row.style.display = 'flex';
        row.style.gap = '0.5rem';
        
        const input = document.createElement('input');
        input.type = 'text';
        input.value = bgUrl;
        input.style.flex = '1';
        input.placeholder = "e.g. assets/bg1.png";
        input.onchange = (e) => {
          CONFIG.backgrounds[i] = e.target.value;
          updateApp();
        };
        
        const delBtn = document.createElement('button');
        delBtn.innerHTML = '<i class="ph ph-trash"></i>';
        delBtn.style.cssText = 'background: rgba(255,0,0,0.2); border: 1px solid rgba(255,0,0,0.3); color: white; cursor: pointer; padding: 0 0.75rem; border-radius: 4px; transition: background 0.2s;';
        delBtn.onmouseover = () => delBtn.style.background = 'rgba(255,0,0,0.5)';
        delBtn.onmouseout = () => delBtn.style.background = 'rgba(255,0,0,0.2)';
        delBtn.onclick = () => {
          CONFIG.backgrounds.splice(i, 1);
          renderBgList();
          updateApp();
        };
        
        row.appendChild(input);
        row.appendChild(delBtn);
        container.appendChild(row);
      });
    };
    renderBgList();

    document.getElementById('add-bg-btn').onclick = () => {
      if (!CONFIG.backgrounds) CONFIG.backgrounds = [];
      CONFIG.backgrounds.push('');
      renderBgList();
    };

    document.getElementById('close-editor-btn').onclick = () => {
      isEditMode = false;
      document.body.classList.remove('edit-mode-active');
      updateApp();
      toggleSidebar(false);
    };

    document.getElementById('copy-config-btn').onclick = () => {
      const ta = document.getElementById('config-output');
      ta.select();
      document.execCommand('copy');
      const btn = document.getElementById('copy-config-btn');
      btn.innerHTML = '<i class="ph ph-check"></i> Copied!';
      setTimeout(() => btn.innerHTML = '<i class="ph ph-copy"></i> Copy', 2000);
    };

    document.getElementById('dl-config-btn').onclick = () => {
      const ta = document.getElementById('config-output');
      const blob = new Blob([ta.value], { type: 'text/javascript' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'config.js';
      a.click();
      URL.revokeObjectURL(url);
    };
  } else if (sidebarEl) {
    if(toggleBtn) toggleBtn.style.display = 'flex';
    if(nextBgBtn) nextBgBtn.style.display = 'flex';
    sidebarEl.remove();
    sidebarEl = null;
  }
}

function updateConfigOutput() {
  if (isEditMode && sidebarEl) {
    const ta = document.getElementById('config-output');
    ta.value = 'const CONFIG = ' + JSON.stringify(CONFIG, null, 2) + ';';
  }
}

function updateApp() {
  initApp(CONFIG);
  updateConfigOutput();
}

function createToolbar(label, onDelete, onAdd, onMoveUp, onMoveDown, isCol = false) {
  const tb = document.createElement('div');
  const classNameSuffix = label.toLowerCase().replace(' ', '-');
  tb.className = `edit-toolbar toolbar-${classNameSuffix}`;
  tb.innerHTML = `<span>${label}</span>`;
  
  const btnGroup = document.createElement('div');
  btnGroup.className = 'toolbar-btn-group';

  if (onMoveUp) {
    const btn = document.createElement('button');
    btn.innerHTML = isCol ? '<i class="ph ph-caret-left"></i>' : '<i class="ph ph-caret-up"></i>';
    btn.onclick = (e) => { e.stopPropagation(); onMoveUp(); };
    btnGroup.appendChild(btn);
  }
  if (onMoveDown) {
    const btn = document.createElement('button');
    btn.innerHTML = isCol ? '<i class="ph ph-caret-right"></i>' : '<i class="ph ph-caret-down"></i>';
    btn.onclick = (e) => { e.stopPropagation(); onMoveDown(); };
    btnGroup.appendChild(btn);
  }
  if (onAdd) {
    const btn = document.createElement('button');
    btn.innerHTML = '<i class="ph ph-plus"></i>';
    btn.title = label === 'Row' ? 'Add Column' : (label === 'Column' ? 'Add Widget' : 'Add Item');
    btn.onclick = (e) => { e.stopPropagation(); onAdd(); };
    btnGroup.appendChild(btn);
  }
  if (onDelete) {
    const btn = document.createElement('button');
    btn.innerHTML = '<i class="ph ph-trash"></i>';
    btn.title = "Delete";
    btn.onclick = (e) => { e.stopPropagation(); onDelete(); };
    btnGroup.appendChild(btn);
  }
  
  tb.appendChild(btnGroup);
  return tb;
}

function initApp(config) {
  if (config.backgrounds && config.backgrounds.length > 0) {
    applyBackground();
    clearInterval(bgTimer);
    if (config.bgInterval > 0) {
      bgTimer = setInterval(applyBackground, config.bgInterval * 60000);
    }
  }

  document.documentElement.style.setProperty('--max-container-width', config.maxWidth || '1400px');
  document.title = config.title || "Homepage";

  const appRoot = document.getElementById('app-root');
  appRoot.innerHTML = ''; 

  if (config.layout && Array.isArray(config.layout)) {
    config.layout.forEach((node, index) => {
      appRoot.appendChild(renderNode(node, config.layout, index));
    });
  }

  if (isEditMode) {
    const addRowBtn = document.createElement('button');
    addRowBtn.className = 'add-row-btn glass-panel';
    addRowBtn.innerHTML = '<i class="ph ph-list-plus" style="font-size: 1.4rem;"></i> Add New Row';
    addRowBtn.onclick = () => {
      config.layout.push({ type: 'row', children: [] });
      updateApp();
    };
    appRoot.appendChild(addRowBtn);
  }
}

function renderNode(node, parentArray, index) {
  switch (node.type) {
    case 'row':
      return renderRow(node, parentArray, index);
    case 'column':
      return renderColumn(node, parentArray, index);
    case 'grid':
    case 'links':
      return renderGrid(node, parentArray, index);
    case 'widget':
      return renderWidget(node, parentArray, index);
    default:
      console.warn(`Unknown node type: ${node.type}`);
      return document.createElement('div');
  }
}

function renderRow(node, parentArray, index) {
  const el = document.createElement('div');
  el.className = 'row';
  
  if (isEditMode) {
    el.classList.add('edit-outline');
    const moveUp = index > 0 ? () => { [parentArray[index - 1], parentArray[index]] = [parentArray[index], parentArray[index - 1]]; updateApp(); } : null;
    const moveDown = index < parentArray.length - 1 ? () => { [parentArray[index], parentArray[index + 1]] = [parentArray[index + 1], parentArray[index]]; updateApp(); } : null;
    
    el.appendChild(createToolbar('Row', () => {
      if(confirm('Delete entire row?')) { parentArray.splice(index, 1); updateApp(); }
    }, () => {
      if(!node.children) node.children = [];
      node.children.push({ type: 'column', children: [] });
      updateApp();
    }, moveUp, moveDown));
  }

  if (node.children) {
    node.children.forEach((child, i) => el.appendChild(renderNode(child, node.children, i)));
  }
  return el;
}

function renderColumn(node, parentArray, index) {
  const el = document.createElement('div');
  el.className = 'column';
  
  if (node.width) {
    if (node.width.includes('/')) {
      const [num, den] = node.width.split('/');
      if (num && den) {
        const percentage = (parseInt(num) / parseInt(den)) * 100;
        el.style.flex = `0 0 calc(${percentage}% - 1rem)`;
      }
    } else {
      el.style.flex = node.width;
    }
  }

  if (isEditMode) {
    el.classList.add('edit-outline');
    const moveUp = index > 0 ? () => { [parentArray[index - 1], parentArray[index]] = [parentArray[index], parentArray[index - 1]]; updateApp(); } : null;
    const moveDown = index < parentArray.length - 1 ? () => { [parentArray[index], parentArray[index + 1]] = [parentArray[index + 1], parentArray[index]]; updateApp(); } : null;
    
    const tb = createToolbar('Column', () => {
      if(confirm('Delete column?')) { parentArray.splice(index, 1); updateApp(); }
    }, () => {
      const type = prompt("Add what? (type 'links', 'weather', 'time', 'notes', 'rss', 'title', or 'search')");
      if(type === 'links' || type === 'grid') {
        if(!node.children) node.children = [];
        node.children.push({ type: 'links', title: '', columns: 3, links: [] });
        updateApp();
      } else if (type === 'weather') {
        if(!node.children) node.children = [];
        node.children.push({ type: 'widget', widgetType: 'weather', locationName: 'London', latitude: 51.5, longitude: -0.1 });
        updateApp();
      } else if (type === 'time') {
        if(!node.children) node.children = [];
        node.children.push({ type: 'widget', widgetType: 'time' });
        updateApp();
      } else if (type === 'notes') {
        if(!node.children) node.children = [];
        node.children.push({ type: 'widget', widgetType: 'notes', title: 'Noticeboard', content: '' });
        updateApp();
      } else if (type === 'rss') {
        if(!node.children) node.children = [];
        node.children.push({ type: 'widget', widgetType: 'rss', title: 'BBC News', feedUrl: 'http://feeds.bbci.co.uk/news/uk/rss.xml', maxItems: 5 });
        updateApp();
      } else if (type === 'title') {
        if(!node.children) node.children = [];
        node.children.push({ type: 'widget', widgetType: 'title' });
        updateApp();
      } else if (type === 'search') {
        if(!node.children) node.children = [];
        node.children.push({ type: 'widget', widgetType: 'search' });
        updateApp();
      }
    }, moveUp, moveDown, true);
    
    const widthBtn = document.createElement('button');
    widthBtn.innerHTML = '<i class="ph ph-arrows-out-line-horizontal"></i>';
    widthBtn.title = "Set Column Width";
    widthBtn.onclick = (e) => {
      e.stopPropagation();
      const w = prompt("Enter width fraction (e.g. '1/3') or weight (e.g. '2'):", node.width || "1");
      if (w !== null) {
        if (w.trim() === '' || w.trim() === '1') delete node.width;
        else node.width = w.trim();
        updateApp();
      }
    };
    tb.querySelector('.toolbar-btn-group').prepend(widthBtn);
    
    el.appendChild(tb);
  }

  if (node.children) {
    node.children.forEach((child, i) => el.appendChild(renderNode(child, node.children, i)));
  }
  return el;
}

function renderGrid(node, parentArray, index) {
  const section = document.createElement('div');
  section.className = 'grid-section glass-panel';

  if (isEditMode) {
    section.classList.add('edit-outline');
    section.appendChild(createToolbar('Links', () => {
      if(confirm('Delete links section?')) { parentArray.splice(index, 1); updateApp(); }
    }));
  }

  if (node.title || isEditMode) {
    const titleContainer = document.createElement('div');
    const titleEl = document.createElement('h2');
    titleEl.className = 'grid-title';
    titleEl.textContent = node.title || (isEditMode ? "(No Title)" : "");
    if (!node.title && isEditMode) {
      titleEl.style.color = "rgba(255,255,255,0.3)";
      titleEl.style.fontStyle = "italic";
    }
    
    if (isEditMode) {
      const editTitleBtn = document.createElement('button');
      editTitleBtn.className = 'inline-edit-btn';
      editTitleBtn.innerHTML = '<i class="ph ph-pencil"></i>';
      editTitleBtn.onclick = () => {
        const newTitle = prompt("Links Title (leave blank to hide):", node.title || "");
        if(newTitle !== null) { node.title = newTitle; updateApp(); }
      };
      titleEl.appendChild(editTitleBtn);
    }
    titleContainer.appendChild(titleEl);
    section.appendChild(titleContainer);
  }

  const container = document.createElement('div');
  container.className = 'grid-container';
  container.style.gridTemplateColumns = `repeat(auto-fit, minmax(220px, 1fr))`;

  if (node.links) {
    node.links.forEach((link, i) => {
      const a = document.createElement('a');
      a.className = 'link-card glass-panel';
      
      if (isEditMode) {
        a.href = '#';
        a.classList.add('edit-link-mode');
        a.onclick = (e) => {
          e.preventDefault();
          const t = prompt("Link Title:", link.title);
          if(t !== null) link.title = t;
          const u = prompt("URL:", link.url);
          if(u !== null) link.url = u;
          const ic = prompt("Icon Name (e.g. 'globe'):", link.icon);
          if(ic !== null) link.icon = ic;
          updateApp();
        };
        
        const delBtn = document.createElement('button');
        delBtn.className = 'link-del-btn';
        delBtn.innerHTML = '<i class="ph ph-trash"></i>';
        delBtn.onclick = (e) => {
          e.preventDefault();
          e.stopPropagation();
          if(confirm('Delete link?')) { node.links.splice(i, 1); updateApp(); }
        };

        const iconDiv = document.createElement('div');
        iconDiv.className = 'link-icon';
        const icon = document.createElement('i');
        icon.className = `ph ph-${link.icon || 'link'}`;
        iconDiv.appendChild(icon);

        const contentDiv = document.createElement('div');
        contentDiv.className = 'link-content';
        const titleDiv = document.createElement('div');
        titleDiv.className = 'link-title';
        titleDiv.textContent = link.title;
        contentDiv.appendChild(titleDiv);

        a.appendChild(iconDiv);
        a.appendChild(contentDiv);
        a.appendChild(delBtn);
        container.appendChild(a);
      } else {
        if (link.url === '#') {
          a.href = '#';
          a.addEventListener('click', (e) => e.preventDefault());
        } else {
          a.href = link.url;
          a.target = '_blank';
          a.rel = 'noopener noreferrer';
        }
        
        const iconDiv = document.createElement('div');
        iconDiv.className = 'link-icon';
        const icon = document.createElement('i');
        icon.className = `ph ph-${link.icon || 'link'}`;
        iconDiv.appendChild(icon);

        const contentDiv = document.createElement('div');
        contentDiv.className = 'link-content';
        const titleDiv = document.createElement('div');
        titleDiv.className = 'link-title';
        titleDiv.textContent = link.title;
        contentDiv.appendChild(titleDiv);

        a.appendChild(iconDiv);
        a.appendChild(contentDiv);
        container.appendChild(a);
      }
    });
  }

  if (isEditMode) {
    const addLinkBtn = document.createElement('button');
    addLinkBtn.className = 'link-card glass-panel add-link-btn';
    addLinkBtn.innerHTML = `
      <div class="link-icon"><i class="ph ph-plus"></i></div>
      <div class="link-content">
        <div class="link-title">Add Link</div>
      </div>
    `;
    addLinkBtn.onclick = () => {
      if(!node.links) node.links = [];
      node.links.push({ title: 'New Link', url: '#', icon: 'link' });
      updateApp();
    };
    container.appendChild(addLinkBtn);
  }

  section.appendChild(container);
  return section;
}

function renderWidget(node, parentArray, index) {
  const panel = document.createElement('div');
  panel.className = 'glass-panel';
  
  if (isEditMode) {
    panel.classList.add('edit-outline');
    const tb = createToolbar('Widget', () => {
      if(confirm('Delete widget?')) { parentArray.splice(index, 1); updateApp(); }
    });
    panel.appendChild(tb);
  }

  if (node.widgetType === 'title') {
    panel.classList.add('widget-title');
    panel.classList.remove('glass-panel'); 
    
    let logoHTML = '';
    if (CONFIG.logoUrl) {
      logoHTML = `<img src="${CONFIG.logoUrl}" class="raf-roundel" alt="Logo" style="width: 56px; height: 56px;">`;
    }
    
    const h1 = document.createElement('h1');
    h1.textContent = CONFIG.title || "Homepage";
    
    if (isEditMode) {
      const editTitleBtn = document.createElement('button');
      editTitleBtn.className = 'inline-edit-btn';
      editTitleBtn.innerHTML = '<i class="ph ph-pencil"></i>';
      editTitleBtn.onclick = () => {
        const newTitle = prompt("Enter new page title:", CONFIG.title);
        if (newTitle) { CONFIG.title = newTitle; updateApp(); }
      };
      h1.appendChild(editTitleBtn);
    }

    panel.insertAdjacentHTML('beforeend', logoHTML);
    panel.appendChild(h1);
  }
  else if (node.widgetType === 'time') {
    panel.classList.add('widget-time');
    
    const timeEl = document.createElement('div');
    timeEl.className = 'time-display';
    
    const dateEl = document.createElement('div');
    dateEl.className = 'date-display';

    const updateTime = () => {
      const now = new Date();
      timeEl.textContent = now.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
      dateEl.textContent = now.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
    };

    updateTime();
    if(!isEditMode) setInterval(updateTime, 1000);

    panel.appendChild(timeEl);
    panel.appendChild(dateEl);
  } 
  else if (node.widgetType === 'weather') {
    panel.classList.add('widget-weather');
    
    const currentEl = document.createElement('div');
    currentEl.className = 'weather-current';
    
    const forecastEl = document.createElement('div');
    forecastEl.className = 'weather-forecast';
    
    panel.appendChild(currentEl);
    panel.appendChild(forecastEl);

    const apiUrl = `https://api.open-meteo.com/v1/forecast?latitude=${node.latitude}&longitude=${node.longitude}&current_weather=true&daily=weathercode,temperature_2m_max,temperature_2m_min&timezone=auto`;

    const bindWeatherEditBtn = () => {
      if (isEditMode) {
        const btn = currentEl.querySelector('.weather-edit-btn');
        if (btn) {
          btn.onclick = async (e) => {
            e.stopPropagation();
            const loc = prompt("Enter City/Location Name:", node.locationName);
            if (!loc || loc === node.locationName) return;
            
            btn.innerHTML = '<i class="ph ph-spinner ph-spin"></i>';
            try {
              const geoRes = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(loc)}&count=1`);
              const geoData = await geoRes.json();
              if (geoData.results && geoData.results.length > 0) {
                node.locationName = geoData.results[0].name;
                node.latitude = geoData.results[0].latitude;
                node.longitude = geoData.results[0].longitude;
                updateApp();
              } else {
                alert("Location not found! Please try a different name.");
                updateApp();
              }
            } catch(err) {
              alert("Error searching for location.");
              updateApp();
            }
          };
        }
        const minusBtn = currentEl.querySelector('.weather-minus-btn');
        if (minusBtn) {
          minusBtn.onclick = (e) => {
            e.stopPropagation();
            if (node.forecastDays === undefined) node.forecastDays = 4;
            if (node.forecastDays > 0) { node.forecastDays--; updateApp(); }
          };
        }
        
        const plusBtn = currentEl.querySelector('.weather-plus-btn');
        if (plusBtn) {
          plusBtn.onclick = (e) => {
            e.stopPropagation();
            if (node.forecastDays === undefined) node.forecastDays = 4;
            if (node.forecastDays < 5) { node.forecastDays++; updateApp(); }
          };
        }
      }
    };

    fetch(apiUrl)
      .then(res => res.json())
      .then(data => {
        if (data.error) throw new Error("API Error");
        const cw = data.current_weather;
        const codeMap = {
          0: { desc: 'Clear sky', icon: 'sun' },
          1: { desc: 'Mainly clear', icon: 'cloud-sun' },
          2: { desc: 'Partly cloudy', icon: 'cloud-sun' },
          3: { desc: 'Overcast', icon: 'cloud' },
          45: { desc: 'Fog', icon: 'cloud-fog' },
          48: { desc: 'Depositing rime fog', icon: 'cloud-fog' },
          51: { desc: 'Light drizzle', icon: 'cloud-rain' },
          53: { desc: 'Moderate drizzle', icon: 'cloud-rain' },
          55: { desc: 'Dense drizzle', icon: 'cloud-rain' },
          61: { desc: 'Slight rain', icon: 'cloud-rain' },
          63: { desc: 'Moderate rain', icon: 'cloud-rain' },
          65: { desc: 'Heavy rain', icon: 'cloud-rain' },
          71: { desc: 'Slight snow fall', icon: 'cloud-snow' },
          73: { desc: 'Moderate snow fall', icon: 'cloud-snow' },
          75: { desc: 'Heavy snow fall', icon: 'cloud-snow' },
          95: { desc: 'Thunderstorm', icon: 'cloud-lightning' }
        };

        const info = codeMap[cw.weathercode] || { desc: 'Unknown', icon: 'cloud' };

        currentEl.innerHTML = `
          <div class="weather-temp">
            <i class="ph ph-${info.icon}"></i> ${Math.round(cw.temperature)}°C
          </div>
          <div class="weather-desc">${info.desc}</div>
          <div class="weather-location" style="display: flex; align-items: center; justify-content: center; gap: 0.25rem;">
            ${node.locationName.toUpperCase()}
            ${isEditMode ? `
              <button class="inline-edit-btn weather-edit-btn" style="display: flex;" title="Edit Location"><i class="ph ph-pencil-simple"></i></button>
              <button class="inline-edit-btn weather-minus-btn" style="display: flex;" title="Fewer Days"><i class="ph ph-minus"></i></button>
              <button class="inline-edit-btn weather-plus-btn" style="display: flex;" title="More Days"><i class="ph ph-plus"></i></button>
            ` : ''}
          </div>
        `;
        bindWeatherEditBtn();

        const daily = data.daily;
        let forecastHTML = '';
        const days = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

        const daysToRender = node.forecastDays !== undefined ? node.forecastDays : 4;
        for (let i = 1; i <= daysToRender; i++) {
          const date = new Date(daily.time[i]);
          const dayName = days[date.getDay()];
          const maxTemp = Math.round(daily.temperature_2m_max[i]);
          const minTemp = Math.round(daily.temperature_2m_min[i]);
          const fMap = codeMap[daily.weathercode[i]] || { icon: 'cloud' };

          const dayEl = document.createElement('div');
          dayEl.className = 'forecast-day';
          dayEl.innerHTML = `
              <span class="day-name">${dayName}</span>
              <i class="ph ph-${fMap.icon}"></i>
              <span class="temps">${maxTemp}° / ${minTemp}°</span>
            `;
          forecastEl.appendChild(dayEl);
        }
      })
      .catch(err => {
        currentEl.innerHTML = `
          <div class="weather-desc" style="color: #ffcccc;">Weather Unavailable</div>
          <div class="weather-location" style="display: flex; align-items: center; justify-content: center; gap: 0.25rem;">
            ${node.locationName.toUpperCase()}
            ${isEditMode ? `
              <button class="inline-edit-btn weather-edit-btn" style="display: flex;" title="Edit Location"><i class="ph ph-pencil-simple"></i></button>
              <button class="inline-edit-btn weather-minus-btn" style="display: flex;" title="Fewer Days"><i class="ph ph-minus"></i></button>
              <button class="inline-edit-btn weather-plus-btn" style="display: flex;" title="More Days"><i class="ph ph-plus"></i></button>
            ` : ''}
          </div>
        `;
        bindWeatherEditBtn();
      });

  } else if (node.widgetType === 'search') {
    panel.classList.add('widget-search');
    panel.classList.remove('glass-panel');
    
    panel.insertAdjacentHTML('beforeend', `
      <form class="search-form" action="https://www.google.com/search" method="GET">
        <i class="ph ph-magnifying-glass search-icon"></i>
        <input type="text" name="q" class="search-input" placeholder="Search Google..." autocomplete="off" ${isEditMode ? 'disabled' : ''} />
        <div class="search-suggestions"></div>
      </form>
    `);

    if (!isEditMode) {
      const input = panel.querySelector('.search-input');
      const form = panel.querySelector('.search-form');
      const suggestionsBox = panel.querySelector('.search-suggestions');

      let debounceTimer;
      
      if (!window.handleGoogleSuggestions) {
        window.handleGoogleSuggestions = function(data) {
          const query = data[0];
          const suggestions = data[1];
          
          if (suggestions.length === 0) {
            suggestionsBox.style.display = 'none';
            return;
          }

          suggestionsBox.innerHTML = '';
          suggestionsBox.style.display = 'block';

          suggestions.forEach(s => {
            const item = document.createElement('div');
            item.className = 'suggestion-item';
            item.innerHTML = `<i class="ph ph-magnifying-glass suggestion-icon"></i> <span>${s}</span>`;
            item.addEventListener('click', () => {
              input.value = s;
              form.submit();
            });
            suggestionsBox.appendChild(item);
          });
        };
      }

      input.addEventListener('input', (e) => {
        const val = e.target.value.trim();
        if (!val) {
          suggestionsBox.style.display = 'none';
          return;
        }

        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => {
          const script = document.createElement('script');
          script.src = `https://suggestqueries.google.com/complete/search?client=chrome&q=${encodeURIComponent(val)}&callback=handleGoogleSuggestions`;
          document.body.appendChild(script);
          script.onload = () => script.remove();
          script.onerror = () => script.remove();
        }, 150);
      });

      document.addEventListener('click', (e) => {
        if (!panel.contains(e.target)) {
          suggestionsBox.style.display = 'none';
        }
      });

      let activeIndex = -1;
      input.addEventListener('keydown', (e) => {
        const items = suggestionsBox.querySelectorAll('.suggestion-item');
        if (items.length === 0) return;

        if (e.key === 'ArrowDown') {
          e.preventDefault();
          activeIndex = activeIndex < items.length - 1 ? activeIndex + 1 : 0;
        } else if (e.key === 'ArrowUp') {
          e.preventDefault();
          activeIndex = activeIndex > 0 ? activeIndex - 1 : items.length - 1;
        } else if (e.key === 'Enter' && activeIndex >= 0) {
          e.preventDefault();
          items[activeIndex].click();
          return;
        } else return;

        items.forEach(i => i.classList.remove('active'));
        items[activeIndex].classList.add('active');
        input.value = items[activeIndex].querySelector('span').textContent;
      });
    }
  } else if (node.widgetType === 'notes') {
    panel.classList.add('widget-notes');
    
    const titleEl = document.createElement('h3');
    titleEl.className = 'notes-title';
    titleEl.innerHTML = `<i class="ph ph-note"></i> ${node.title || 'Noticeboard'}`;
    panel.appendChild(titleEl);

    if (isEditMode) {
      const editTitleBtn = document.createElement('button');
      editTitleBtn.className = 'inline-edit-btn';
      editTitleBtn.innerHTML = '<i class="ph ph-pencil-simple"></i>';
      editTitleBtn.onclick = (e) => {
        e.stopPropagation();
        const t = prompt('Title:', node.title);
        if (t !== null) { node.title = t; updateApp(); }
      };
      titleEl.appendChild(editTitleBtn);

      const textarea = document.createElement('textarea');
      textarea.className = 'notes-editor';
      textarea.value = node.content || '';
      textarea.placeholder = "Type your notes here...\\nUse *bold*, _italics_, and - for lists.";
      textarea.oninput = (e) => {
        node.content = e.target.value;
        updateConfigOutput();
      };
      panel.appendChild(textarea);
    } else {
      const contentEl = document.createElement('div');
      contentEl.className = 'notes-content';
      contentEl.innerHTML = parseSimpleMarkdown(node.content || '');
      panel.appendChild(contentEl);
    }
  } else if (node.widgetType === 'rss') {
    panel.classList.add('widget-rss');
    
    const titleEl = document.createElement('h3');
    titleEl.className = 'rss-title';
    titleEl.innerHTML = `<i class="ph ph-rss"></i> ${node.title || 'News Feed'}`;
    panel.appendChild(titleEl);

    if (isEditMode) {
      const editTitleBtn = document.createElement('button');
      editTitleBtn.className = 'inline-edit-btn';
      editTitleBtn.innerHTML = '<i class="ph ph-pencil-simple"></i>';
      editTitleBtn.onclick = (e) => {
        e.stopPropagation();
        const t = prompt('Title:', node.title);
        if (t !== null) node.title = t;
        const u = prompt('RSS Feed URL:', node.feedUrl);
        if (u !== null) node.feedUrl = u;
        updateApp();
      };
      titleEl.appendChild(editTitleBtn);
    }

    const contentEl = document.createElement('div');
    contentEl.className = 'rss-content';
    contentEl.innerHTML = '<div style="display:flex;justify-content:center;padding:1rem;"><i class="ph ph-spinner ph-spin" style="font-size:2rem;color:var(--raf-light-blue);"></i></div>';
    panel.appendChild(contentEl);

    if (node.feedUrl) {
      const apiUrl = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(node.feedUrl)}`;
      fetch(apiUrl)
        .then(res => res.json())
        .then(data => {
          if (data.status === 'ok') {
            const items = data.items.slice(0, node.maxItems || 5);
            let html = '<div class="rss-list">';
            items.forEach(item => {
              let dateStr = '';
              if (item.pubDate) {
                const d = new Date(item.pubDate.replace(' ', 'T'));
                dateStr = `<div class="rss-date">${d.toLocaleDateString()} ${d.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</div>`;
              }
              html += `
                <a href="${item.link}" target="_blank" rel="noopener noreferrer" class="rss-item">
                  <div class="rss-item-title">${item.title}</div>
                  ${dateStr}
                </a>
              `;
            });
            html += '</div>';
            contentEl.innerHTML = html;
          } else {
            contentEl.innerHTML = `<div class="rss-error">Failed to load feed.</div>`;
          }
        })
        .catch(err => {
          contentEl.innerHTML = `<div class="rss-error">Error fetching feed.</div>`;
        });
    } else {
      contentEl.innerHTML = `<div class="rss-error">No RSS URL provided. Click the pencil to configure.</div>`;
    }
  }
  
  return panel;
}
