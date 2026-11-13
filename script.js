(function(){
'use strict';

/* ============ STATE ============ */
const state = {
  cart: JSON.parse(localStorage.getItem('fo-cart') || '[]'),
  route: 'home',
  productId: null,
  filters: { category: 'all', material: 'all', price: 'all', sort: 'featured' },
  roomItems: { sofa: null, chair: null, table: null, lighting: null },
  selectedVariantIdx: 0,
  galleryIdx: 0,
  openBuilderCat: null,
};

function saveCart() { localStorage.setItem('fo-cart', JSON.stringify(state.cart)); }
function findProduct(id) { return PRODUCTS.find(p => p.id === id); }
function formatPrice(n) { return '€' + n.toLocaleString('en-US'); }
function $(s, c=document) { return c.querySelector(s); }
function $$(s, c=document) { return [...c.querySelectorAll(s)]; }

/* ============ ROUTER ============ */
function parseRoute() {
  const hash = window.location.hash || '#/';
  const clean = hash.replace(/^#/, '');
  if (clean === '/' || clean === '') return { name: 'home' };
  if (clean === '/collection') return { name: 'collection' };
  if (clean === '/checkout') return { name: 'checkout' };
  if (clean === '/stories') return { name: 'stories' };
  if (clean === '/studio') return { name: 'studio' };
  const match = clean.match(/^\/product\/(.+)$/);
  if (match) return { name: 'product', id: match[1] };
  return { name: 'home' };
}

function router() {
  const route = parseRoute();
  state.route = route.name;
  state.productId = route.id || null;
  state.galleryIdx = 0;
  state.selectedVariantIdx = 0;
  const app = $('#app');
  app.innerHTML = '';
  if (route.name === 'home') renderHome(app);
  else if (route.name === 'collection') renderCollection(app);
  else if (route.name === 'product') renderProductPage(app, route.id);
  else if (route.name === 'checkout') renderCheckout(app);
  else if (route.name === 'stories') renderStories(app);
  else if (route.name === 'studio') renderStudio(app);
  window.scrollTo({ top: 0, behavior: 'instant' });
  updateNavActive();
  requestAnimationFrame(initReveals);
}

function updateNavActive() {
  $$('.nav-links a').forEach(a => {
    const href = a.getAttribute('href');
    const active =
      (state.route === 'collection' && (href === '#/collection')) ||
      (state.route === 'stories' && href === '#/stories') ||
      (state.route === 'studio' && href === '#/studio');
    a.classList.toggle('active', active);
  });
}

/* ============ NAVBAR ============ */
function initNavbar() {
  const navbar = $('#navbar');
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 40);
  }, { passive: true });
}

function initMobileMenu() {
  const ham = $('#hamburger');
  const menu = $('#mobileMenu');
  const close = $('#mobileClose');
  const mobileSearch = $('#mobileSearch');
  ham.addEventListener('click', () => {
    menu.classList.toggle('open');
    ham.classList.toggle('open');
    document.body.style.overflow = menu.classList.contains('open') ? 'hidden' : '';
  });
  close.addEventListener('click', () => {
    menu.classList.remove('open');
    ham.classList.remove('open');
    document.body.style.overflow = '';
  });
  $$('.mobile-links a').forEach(a => a.addEventListener('click', () => {
    menu.classList.remove('open');
    ham.classList.remove('open');
    document.body.style.overflow = '';
  }));
  if (mobileSearch) mobileSearch.addEventListener('click', (e) => {
    e.preventDefault();
    menu.classList.remove('open');
    ham.classList.remove('open');
    document.body.style.overflow = '';
    openSearch();
  });
}

/* ============ CART ============ */
function addToCart(productId, variantIdx, qty=1) {
  const product = findProduct(productId);
  if (!product) return;
  const variant = product.variants[variantIdx];
  const key = productId + '::' + variantIdx;
  const existing = state.cart.find(i => i.key === key);
  if (existing) existing.qty += qty;
  else state.cart.push({
    key, productId, variantIdx, qty,
    name: product.name, variantName: variant.name,
    price: variant.price, image: variant.image,
  });
  saveCart();
  updateCartBadge();
  renderCartDrawer();
  showToast('ADDED TO BAG');
}

function removeFromCart(key) {
  state.cart = state.cart.filter(i => i.key !== key);
  saveCart(); updateCartBadge(); renderCartDrawer();
}

function updateQty(key, delta) {
  const item = state.cart.find(i => i.key === key);
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) removeFromCart(key);
  else { saveCart(); updateCartBadge(); renderCartDrawer(); }
}

function cartTotal() {
  return state.cart.reduce((s, i) => s + i.price * i.qty, 0);
}
function cartCount() {
  return state.cart.reduce((s, i) => s + i.qty, 0);
}

function updateCartBadge() {
  const el = $('#cartCount');
  if (el) el.textContent = '(' + cartCount() + ')';
}

function openCart() {
  $('#cartDrawer').classList.add('open');
  $('#cartBackdrop').classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closeCart() {
  $('#cartDrawer').classList.remove('open');
  $('#cartBackdrop').classList.remove('open');
  document.body.style.overflow = '';
}

function renderCartDrawer() {
  const body = $('#cartBody');
  const foot = $('#cartFoot');
  if (state.cart.length === 0) {
    body.innerHTML = `<div class="cart-empty"><p>YOUR BAG IS EMPTY</p><a href="#/collection" onclick="document.getElementById('cartClose').click()">EXPLORE THE COLLECTION →</a></div>`;
    foot.innerHTML = '';
    return;
  }
  body.innerHTML = state.cart.map(item => `
    <div class="cart-item">
      <img src="${item.image}" alt="${item.name}">
      <div class="cart-item-info">
        <span class="cart-item-name">${item.name}</span>
        <span class="cart-item-variant">${item.variantName}</span>
        <span class="cart-item-price">${formatPrice(item.price)}</span>
      </div>
      <div class="cart-item-actions">
        <div class="qty-controls">
          <button class="qty-btn" data-qty="${item.key}" data-delta="-1">−</button>
          <span class="qty-value">${item.qty}</span>
          <button class="qty-btn" data-qty="${item.key}" data-delta="1">+</button>
        </div>
        <button class="cart-remove" data-remove="${item.key}">REMOVE</button>
      </div>
    </div>
  `).join('');
  foot.innerHTML = `
    <div class="cart-subtotal">
      <span>SUBTOTAL</span>
      <span>${formatPrice(cartTotal())}</span>
    </div>
    <button class="checkout-btn" id="checkoutBtn">PROCEED TO CHECKOUT</button>
  `;
  $('#checkoutBtn').addEventListener('click', () => {
    closeCart();
    window.location.hash = '#/checkout';
  });
}

/* ============ SEARCH ============ */
function openSearch() {
  $('#searchOverlay').classList.add('open');
  document.body.style.overflow = 'hidden';
  setTimeout(() => $('#searchInput').focus(), 100);
}
function closeSearch() {
  $('#searchOverlay').classList.remove('open');
  $('#searchInput').value = '';
  $('#searchResults').innerHTML = '';
  document.body.style.overflow = '';
}

function renderSearchResults(query) {
  const q = query.trim().toLowerCase();
  const results = $('#searchResults');
  if (!q) { results.innerHTML = ''; return; }
  const matches = PRODUCTS.filter(p =>
    p.name.toLowerCase().includes(q) ||
    p.category.toLowerCase().includes(q) ||
    p.variants.some(v => v.name.toLowerCase().includes(q))
  );
  if (matches.length === 0) {
    results.innerHTML = `<div class="search-no">NO OBJECTS FOUND</div>`;
    return;
  }
  results.innerHTML = matches.map(p => `
    <div class="search-result" data-goto="${p.id}">
      <img src="${p.variants[0].image}" alt="${p.name}">
      <div class="search-result-info">
        <span class="search-result-name">${p.name}</span>
        <span class="search-result-meta">${p.category.toUpperCase()} · ${p.variants[0].name}</span>
      </div>
      <span class="search-result-price">${formatPrice(p.variants[0].price)}</span>
    </div>
  `).join('');
}

/* ============ TOAST ============ */
let toastTimer = null;
function showToast(msg) {
  const t = $('#toast');
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove('show'), 2400);
}

/* ============ REVEAL ============ */
function initReveals() {
  const els = $$('.reveal');
  const obs = new IntersectionObserver(entries => {
    entries.forEach(en => {
      if (en.isIntersecting) {
        en.target.classList.add('in');
        obs.unobserve(en.target);
      }
    });
  }, { threshold: 0.1 });
  els.forEach(el => obs.observe(el));
}

/* ============ HOME ============ */
function renderHome(app) {
  app.innerHTML = `
    <section class="hero">
      <div class="hero-bg"><img src="https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=2400&q=85" alt="Interior"></div>
      <div class="hero-overlay"></div>
      <div class="hero-content">
        <div class="hero-meta">
          <span>COLLECTION 01</span>
          <span>OBJECT 004</span>
          <span>2026</span>
        </div>
        <h1 class="hero-title">OBJECTS<br>FOR LIVING.</h1>
        <p class="hero-sub">Furniture designed as architecture for everyday life.</p>
        <a href="#/collection" class="hero-cta">EXPLORE COLLECTION →</a>
      </div>
      <div class="hero-corner">F / O<br>STUDIO::EU</div>
    </section>

    <section class="builder" id="space-builder">
      <div class="container">
        <div class="section-head">
          <span class="section-num">01 / INTERACTIVE</span>
          <h2 class="section-title">DESIGN YOUR SPACE.</h2>
          <p class="section-sub">Build a room using our objects. Add, remove, and see the total.</p>
        </div>
        <div class="builder-grid">
          <div class="room-scene" id="roomScene">
            <img src="https://images.unsplash.com/photo-1615529182904-14819c35db37?auto=format&fit=crop&w=1600&q=85" alt="Room">
            ${ROOM_CATEGORIES.map(cat => `
              <div class="room-marker" data-cat-marker="${cat.key}" style="top:${cat.position.top};left:${cat.position.left}"></div>
            `).join('')}
          </div>
          <div class="builder-panel">
            <div class="builder-panel-head">
              <span>YOUR SPACE</span>
              <span id="builderCount">0 SELECTED</span>
            </div>
            <div class="builder-cats" id="builderCats"></div>
            <div class="builder-total">
              <span class="builder-total-label">SPACE TOTAL</span>
              <span class="builder-total-value" id="builderTotal">€0</span>
            </div>
            <button class="builder-cta" id="builderAddAll" disabled>ADD ALL TO BAG</button>
          </div>
        </div>
      </div>
    </section>

    <section class="section" id="collection">
      <div class="collection-head reveal">
        <div>
          <span class="section-num">02 / COLLECTION</span>
          <h2 class="section-title">THE COLLECTION.</h2>
          <p class="section-sub">Twelve objects designed as a system for living.</p>
        </div>
        <div class="collection-meta">
          <div><span>OBJECTS</span><strong>12</strong></div>
          <div><span>MATERIALS</span><strong>04</strong></div>
          <div><span>COLLECTIONS</span><strong>03</strong></div>
        </div>
      </div>
      <div class="filters-bar reveal" id="filtersBar">
        <div class="filter-group">
          <span class="filter-label">CATEGORY</span>
          ${['all','seating','tables','lighting','storage','objects'].map(c => `<button class="filter-pill ${c==='all'?'active':''}" data-filter-cat="${c}">${c.toUpperCase()}</button>`).join('')}
        </div>
        <div class="filter-group">
          <span class="filter-label">MATERIAL</span>
          ${['all','wood','metal','fabric','glass'].map(m => `<button class="filter-pill ${m==='all'?'active':''}" data-filter-mat="${m}">${m.toUpperCase()}</button>`).join('')}
        </div>
        <div class="filter-group">
          <span class="filter-label">PRICE</span>
          ${[['all','ALL'],['low','UNDER €500'],['mid','€500–€1000'],['high','€1000+']].map(([k,l]) => `<button class="filter-pill ${k==='all'?'active':''}" data-filter-price="${k}">${l}</button>`).join('')}
        </div>
        <div class="filter-group">
          <span class="filter-count" id="filterCount">12 OBJECTS</span>
          <select class="sort-select" id="sortSelect">
            <option value="featured">FEATURED</option>
            <option value="price-asc">PRICE LOW → HIGH</option>
            <option value="price-desc">PRICE HIGH → LOW</option>
            <option value="newest">NEWEST</option>
          </select>
        </div>
      </div>
      <div class="product-grid" id="productGrid"></div>
    </section>

    <section class="story">
      <div class="container">
        <div class="story-inner">
          <div class="story-img reveal">
            <img src="https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&w=1200&q=85" alt="Interior detail">
          </div>
          <div class="story-content reveal">
            <span class="section-num" style="color:#888">03 / STORIES</span>
            <h2>THE IDEA BEHIND<br>THE OBJECTS.</h2>
            <p>We design objects that occupy space without overwhelming it. Every piece begins with an architectural question: what does this room need to feel complete?</p>
            <a href="#/stories" class="hero-cta" style="color:var(--bg);border-color:var(--bg);margin-top:2rem;display:inline-flex">READ THE STORIES →</a>
          </div>
        </div>
      </div>
    </section>

    <section class="section">
      <div class="container">
        <div class="section-head reveal">
          <span class="section-num">04 / STUDIO</span>
          <h2 class="section-title">THE STUDIO.</h2>
        </div>
        <div class="studio-grid">
          ${[
            ['DESIGN','https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=800&q=85','Every object begins as a drawing.'],
            ['MATERIAL','https://images.unsplash.com/photo-1533090161767-e6ffed986c88?auto=format&fit=crop&w=800&q=85','We select raw materials for character.'],
            ['CRAFT','https://images.unsplash.com/photo-1581858726788-75bc0f6a952d?auto=format&fit=crop&w=800&q=85','Hand-finished in our workshop.'],
            ['SPACE','https://images.unsplash.com/photo-1615529182904-14819c35db37?auto=format&fit=crop&w=800&q=85','Objects shaped by the room they inhabit.'],
          ].map(([t, src, d]) => `
            <div class="studio-card reveal">
              <img src="${src}" alt="${t}" loading="lazy">
              <div class="studio-overlay"><h4>${t}</h4><p>${d}</p></div>
            </div>
          `).join('')}
        </div>
      </div>
    </section>
  `;

  initSpaceBuilder();
  renderProductGrid();
  initFilters();
}

/* ============ SPACE BUILDER ============ */
function initSpaceBuilder() {
  renderBuilderCats();
  renderRoomMarkers();
  updateBuilderTotal();
}

function renderBuilderCats() {
  const cats = $('#builderCats');
  cats.innerHTML = ROOM_CATEGORIES.map(cat => {
    const selected = state.roomItems[cat.key];
    const isOpen = state.openBuilderCat === cat.key;
    return `
      <div class="builder-cat ${isOpen ? 'open' : ''}" data-cat="${cat.key}">
        <div class="builder-cat-head" data-toggle-cat="${cat.key}">
          <span class="builder-cat-label">${cat.label}</span>
          <span class="builder-cat-status ${selected ? 'filled' : ''}">${selected ? '● SELECTED' : '○ EMPTY'}</span>
          <span class="builder-cat-toggle">+</span>
        </div>
        <div class="builder-cat-options">
          ${cat.products.map(pid => {
            const p = findProduct(pid);
            const isSelected = selected === pid;
            return `
              <div class="builder-option ${isSelected ? 'selected' : ''}" data-select-product="${pid}" data-cat-key="${cat.key}">
                <img src="${p.variants[0].image}" alt="${p.name}">
                <div class="builder-option-info">
                  <span class="builder-option-name">${p.name}</span>
                  <span class="builder-option-price">${formatPrice(p.variants[0].price)}</span>
                </div>
                <span class="builder-option-check">${isSelected ? '✓' : ''}</span>
              </div>
            `;
          }).join('')}
        </div>
      </div>
    `;
  }).join('');

  // Category toggle
  $$('[data-toggle-cat]').forEach(el => {
    el.addEventListener('click', () => {
      const cat = el.dataset.toggleCat;
      state.openBuilderCat = state.openBuilderCat === cat ? null : cat;
      renderBuilderCats();
    });
  });

  // Option select
  $$('[data-select-product]').forEach(el => {
    el.addEventListener('click', () => {
      const pid = el.dataset.selectProduct;
      const catKey = el.dataset.catKey;
      state.roomItems[catKey] = state.roomItems[catKey] === pid ? null : pid;
      renderBuilderCats();
      renderRoomMarkers();
      updateBuilderTotal();
    });
  });
}

function renderRoomMarkers() {
  ROOM_CATEGORIES.forEach(cat => {
    const marker = $(`[data-cat-marker="${cat.key}"]`);
    if (!marker) return;
    const pid = state.roomItems[cat.key];
    if (!pid) {
      marker.innerHTML = `<button class="room-marker-empty" data-toggle-cat-from-room="${cat.key}" title="Add ${cat.label}">+</button>`;
      marker.querySelector('.room-marker-empty').addEventListener('click', () => {
        state.openBuilderCat = cat.key;
        renderBuilderCats();
      });
    } else {
      const p = findProduct(pid);
      marker.innerHTML = `
        <div class="room-marker-filled">
          <button class="room-marker-remove" data-remove-room="${cat.key}">×</button>
          <img src="${p.variants[0].image}" alt="${p.name}">
          <span class="room-marker-name">${p.name}</span>
          <span class="room-marker-price">${formatPrice(p.variants[0].price)}</span>
        </div>
      `;
      marker.querySelector('[data-remove-room]').addEventListener('click', (e) => {
        e.stopPropagation();
        state.roomItems[cat.key] = null;
        renderRoomMarkers();
        renderBuilderCats();
        updateBuilderTotal();
      });
    }
  });
}

function updateBuilderTotal() {
  const items = Object.values(state.roomItems).filter(Boolean);
  const total = items.reduce((s, pid) => s + findProduct(pid).variants[0].price, 0);
  const countEl = $('#builderCount');
  const totalEl = $('#builderTotal');
  const addBtn = $('#builderAddAll');
  if (countEl) countEl.textContent = items.length + ' SELECTED';
  if (totalEl) totalEl.textContent = formatPrice(total);
  if (addBtn) addBtn.disabled = items.length === 0;
}

/* ============ PRODUCT GRID (Collection + Home) ============ */
function getFilteredProducts() {
  let list = [...PRODUCTS];
  if (state.filters.category !== 'all') list = list.filter(p => p.category === state.filters.category);
  if (state.filters.material !== 'all') list = list.filter(p => p.material === state.filters.material);
  if (state.filters.price !== 'all') {
    list = list.filter(p => {
      const price = p.variants[0].price;
      if (state.filters.price === 'low') return price < 500;
      if (state.filters.price === 'mid') return price >= 500 && price <= 1000;
      if (state.filters.price === 'high') return price > 1000;
      return true;
    });
  }
  if (state.filters.sort === 'price-asc') list.sort((a,b) => a.variants[0].price - b.variants[0].price);
  else if (state.filters.sort === 'price-desc') list.sort((a,b) => b.variants[0].price - a.variants[0].price);
  else if (state.filters.sort === 'newest') list.sort((a,b) => parseInt(b.num) - parseInt(a.num));
  return list;
}

function renderProductGrid() {
  const grid = $('#productGrid');
  const countEl = $('#filterCount');
  if (!grid) return;
  const list = getFilteredProducts();
  if (countEl) countEl.textContent = list.length + ' OBJECT' + (list.length === 1 ? '' : 'S');
  if (list.length === 0) {
    grid.innerHTML = `<div class="empty-state" style="grid-column:1/-1"><h3>NO OBJECTS FOUND</h3><p>TRY DIFFERENT FILTERS</p></div>`;
    return;
  }
  grid.innerHTML = list.map(p => {
    const v = p.variants[0];
    return `
      <div class="product-card reveal" data-product-id="${p.id}">
        <div class="product-img-wrap">
          <img src="${v.image}" alt="${p.name}" loading="lazy">
          <span class="product-card-num">${p.num}</span>
          <span class="product-card-view">VIEW OBJECT →</span>
        </div>
        <div class="product-info">
          <div class="product-info-row">
            <span class="product-name">${p.name}</span>
            <span class="product-price">${formatPrice(v.price)}</span>
          </div>
          <span class="product-material">${v.name} · ${p.category.toUpperCase()}</span>
        </div>
      </div>
    `;
  }).join('');

  $$('.product-card').forEach(card => {
    card.addEventListener('click', () => {
      window.location.hash = '#/product/' + card.dataset.productId;
    });
  });
  initReveals();
}

function initFilters() {
  $$('[data-filter-cat]').forEach(btn => {
    btn.addEventListener('click', () => {
      state.filters.category = btn.dataset.filterCat;
      $$('[data-filter-cat]').forEach(b => b.classList.toggle('active', b === btn));
      renderProductGrid();
    });
  });
  $$('[data-filter-mat]').forEach(btn => {
    btn.addEventListener('click', () => {
      state.filters.material = btn.dataset.filterMat;
      $$('[data-filter-mat]').forEach(b => b.classList.toggle('active', b === btn));
      renderProductGrid();
    });
  });
  $$('[data-filter-price]').forEach(btn => {
    btn.addEventListener('click', () => {
      state.filters.price = btn.dataset.filterPrice;
      $$('[data-filter-price]').forEach(b => b.classList.toggle('active', b === btn));
      renderProductGrid();
    });
  });
  const sortEl = $('#sortSelect');
  if (sortEl) {
    sortEl.addEventListener('change', e => {
      state.filters.sort = e.target.value;
      renderProductGrid();
    });
  }
  const addAllBtn = $('#builderAddAll');
  if (addAllBtn) {
    addAllBtn.addEventListener('click', () => {
      Object.values(state.roomItems).filter(Boolean).forEach(pid => {
        addToCart(pid, 0, 1);
      });
      state.roomItems = { sofa: null, chair: null, table: null, lighting: null };
      renderBuilderCats();
      renderRoomMarkers();
      updateBuilderTotal();
    });
  }
}

/* ============ COLLECTION PAGE ============ */
function renderCollection(app) {
  app.innerHTML = `
    <section class="section" style="padding-top:100px">
      <div class="container">
        <div class="collection-head">
          <div>
            <span class="section-num">COLLECTION</span>
            <h1 class="section-title">THE COLLECTION.</h1>
            <p class="section-sub">Twelve objects designed as a system for living.</p>
          </div>
          <div class="collection-meta">
            <div><span>OBJECTS</span><strong>12</strong></div>
            <div><span>MATERIALS</span><strong>04</strong></div>
            <div><span>COLLECTIONS</span><strong>03</strong></div>
          </div>
        </div>
        <div class="filters-bar" id="filtersBar">
          <div class="filter-group">
            <span class="filter-label">CATEGORY</span>
            ${['all','seating','tables','lighting','storage','objects'].map(c => `<button class="filter-pill ${c==='all'?'active':''}" data-filter-cat="${c}">${c.toUpperCase()}</button>`).join('')}
          </div>
          <div class="filter-group">
            <span class="filter-label">MATERIAL</span>
            ${['all','wood','metal','fabric','glass'].map(m => `<button class="filter-pill ${m==='all'?'active':''}" data-filter-mat="${m}">${m.toUpperCase()}</button>`).join('')}
          </div>
          <div class="filter-group">
            <span class="filter-label">PRICE</span>
            ${[['all','ALL'],['low','UNDER €500'],['mid','€500–€1000'],['high','€1000+']].map(([k,l]) => `<button class="filter-pill ${k==='all'?'active':''}" data-filter-price="${k}">${l}</button>`).join('')}
          </div>
          <div class="filter-group">
            <span class="filter-count" id="filterCount">12 OBJECTS</span>
            <select class="sort-select" id="sortSelect">
              <option value="featured">FEATURED</option>
              <option value="price-asc">PRICE LOW → HIGH</option>
              <option value="price-desc">PRICE HIGH → LOW</option>
              <option value="newest">NEWEST</option>
            </select>
          </div>
        </div>
        <div class="product-grid" id="productGrid"></div>
      </div>
    </section>
  `;
  state.filters = { category: 'all', material: 'all', price: 'all', sort: 'featured' };
  renderProductGrid();
  initFilters();
}

/* ============ PRODUCT PAGE ============ */
function renderProductPage(app, id) {
  const p = findProduct(id);
  if (!p) { app.innerHTML = `<div class="container" style="padding:120px 24px"><h2>OBJECT NOT FOUND</h2><a href="#/collection" style="text-decoration:underline;margin-top:1rem;display:inline-block">← BACK TO COLLECTION</a></div>`; return; }
  state.selectedVariantIdx = 0;
  state.galleryIdx = 0;
  const v = p.variants[0];
  const allImages = [v.image, ...p.contextImages.map(c => c.src)];
  app.innerHTML = `
    <div class="product-page">
      <div class="product-layout">
        <div class="gallery">
          <div class="gallery-main"><img id="galleryMain" src="${allImages[0]}" alt="${p.name}"></div>
          <div class="gallery-thumbs">
            ${allImages.map((src, i) => `
              <div class="gallery-thumb ${i===0?'active':''}" data-gal="${i}">
                <img src="${src}" alt="${p.name} view ${i+1}">
              </div>
            `).join('')}
          </div>
        </div>
        <div class="product-info-panel">
          <div class="product-meta-top">
            <span class="product-eyebrow">OBJECT ${p.num} · COLLECTION ${p.collection}</span>
            <span class="product-avail">${p.availability}</span>
          </div>
          <h1 class="product-title">${p.name}</h1>
          <div class="product-price-big" id="productPrice">${formatPrice(v.price)}</div>
          <p class="product-tagline">${p.tagline}</p>
          <p class="product-desc">${p.description}</p>

          <div class="selector-block">
            <span class="selector-label">FINISH / MATERIAL</span>
            <div class="color-swatches" id="colorSwatches">
              ${p.variants.map((vv, i) => `
                <div class="color-swatch ${i===0?'active':''}" data-variant="${i}">
                  <span class="color-swatch-dot" style="background:${vv.color}"></span>
                  <span class="color-swatch-name">${vv.name}</span>
                </div>
              `).join('')}
            </div>
          </div>

          <div class="spec-list">
            <div class="spec-row"><span>MATERIAL</span><span id="specMat">${v.name}</span></div>
            <div class="spec-row"><span>SKU</span><span id="specSku">${v.sku}</span></div>
            <div class="spec-row"><span>DIMENSIONS</span><span>W ${p.dimensions.w} × D ${p.dimensions.d} × H ${p.dimensions.h} CM</span></div>
            <div class="spec-row"><span>WEIGHT</span><span>${p.weight}</span></div>
          </div>

          <div class="add-actions">
            <button class="add-btn" id="addToBagBtn">ADD TO BAG</button>
            <button class="save-btn" id="saveBtn">♡ SAVE</button>
          </div>
        </div>
      </div>

      <section class="tech-section">
        <div class="container">
          <div class="tech-head">
            <span class="section-num">OBJECT SPECIFICATION</span>
          </div>
          ${renderTechnicalDrawing(p)}
        </div>
      </section>

      <section class="material-section">
        <div class="material-img">
          <img src="${p.contextImages[1].src}" alt="Material detail">
        </div>
        <div class="material-content">
          <span class="section-num">MATERIAL / 02</span>
          <h3>${v.name}</h3>
          <p>Selected for its grain, durability and tactile warmth. Every object is finished by hand in our European workshop.</p>
          <div class="material-specs">
            <div><span>ORIGIN</span><span>EUROPE</span></div>
            <div><span>FINISH</span><span>MATTE</span></div>
            <div><span>PRODUCTION</span><span>HAND FINISHED</span></div>
            <div><span>SKU</span><span id="matSku">${v.sku}</span></div>
          </div>
        </div>
      </section>

      <section class="related">
        <div class="related-head">
          <h3>COMPLETE THE SPACE.</h3>
          <button id="addRelatedAll">ADD ALL TO BAG</button>
        </div>
        <div class="product-grid" id="relatedGrid"></div>
      </section>
    </div>
  `;

  // Gallery thumbnails
  $$('.gallery-thumb').forEach(t => {
    t.addEventListener('click', () => {
      const i = parseInt(t.dataset.gal);
      state.galleryIdx = i;
      $$('.gallery-thumb').forEach(x => x.classList.remove('active'));
      t.classList.add('active');
      const main = $('#galleryMain');
      main.style.opacity = '0';
      setTimeout(() => {
        main.src = allImages[i];
        main.style.opacity = '1';
      }, 150);
    });
  });

  // Color swatches
  $$('.color-swatch').forEach(sw => {
    sw.addEventListener('click', () => {
      const i = parseInt(sw.dataset.variant);
      state.selectedVariantIdx = i;
      const vv = p.variants[i];
      $$('.color-swatch').forEach(x => x.classList.remove('active'));
      sw.classList.add('active');
      $('#productPrice').textContent = formatPrice(vv.price);
      $('#specMat').textContent = vv.name;
      $('#specSku').textContent = vv.sku;
      $('#matSku').textContent = vv.sku;
      // Update main gallery image
      const newImages = [vv.image, ...p.contextImages.map(c => c.src)];
      const main = $('#galleryMain');
      main.style.opacity = '0';
      setTimeout(() => {
        main.src = newImages[0];
        main.style.opacity = '1';
      }, 150);
      $$('.gallery-thumb').forEach((t, idx) => {
        const img = t.querySelector('img');
        img.src = newImages[idx];
      });
      // Update material story image
      const matImg = $('.material-img img');
      if (matImg) matImg.src = p.contextImages[1].src;
    });
  });

  // Add to bag
  $('#addToBagBtn').addEventListener('click', () => {
    addToCart(p.id, state.selectedVariantIdx, 1);
    openCart();
  });
  $('#saveBtn').addEventListener('click', () => showToast('OBJECT SAVED'));

  // Related products
  const related = PRODUCTS.filter(r => r.id !== p.id).slice(0, 4);
  const relatedGrid = $('#relatedGrid');
  relatedGrid.innerHTML = related.map(rp => {
    const rv = rp.variants[0];
    return `
      <div class="product-card" data-product-id="${rp.id}">
        <div class="product-img-wrap">
          <img src="${rv.image}" alt="${rp.name}" loading="lazy">
          <span class="product-card-num">${rp.num}</span>
          <span class="product-card-view">VIEW OBJECT →</span>
        </div>
        <div class="product-info">
          <div class="product-info-row">
            <span class="product-name">${rp.name}</span>
            <span class="product-price">${formatPrice(rv.price)}</span>
          </div>
          <span class="product-material">${rv.name} · ${rp.category.toUpperCase()}</span>
        </div>
      </div>
    `;
  }).join('');
  $$('#relatedGrid .product-card').forEach(c => {
    c.addEventListener('click', () => { window.location.hash = '#/product/' + c.dataset.productId; });
  });
  $('#addRelatedAll').addEventListener('click', () => {
    related.forEach(rp => addToCart(rp.id, 0, 1));
    openCart();
  });
}

function renderTechnicalDrawing(p) {
  const { w, d, h } = p.dimensions;
  const type = p.svgType;
  const W = 700, H = 400;
  const cx = W/2;
  const scale = Math.min(220/Math.max(w,d,h), 3.5);
  const sw = w * scale, sd = d * scale * 0.5, sh = h * scale;

  let shape = '';
  const x = cx - sw/2, y = 200 - sh/2;
  const yBottom = y + sh;

  if (type === 'chair') {
    shape = `
      <rect x="${x}" y="${y}" width="${sw*0.15}" height="${sh}" fill="none" stroke="#111" stroke-width="1.5"/>
      <rect x="${x}" y="${yBottom - sh*0.3}" width="${sw}" height="${sh*0.15}" fill="none" stroke="#111" stroke-width="1.5"/>
      <line x1="${x}" y1="${yBottom}" x2="${x}" y2="${yBottom}" stroke="#111"/>
    `;
  } else if (type === 'sofa') {
    shape = `
      <rect x="${x}" y="${y}" width="${sw}" height="${sh*0.4}" fill="none" stroke="#111" stroke-width="1.5"/>
      <rect x="${x}" y="${y+sh*0.4}" width="${sw}" height="${sh*0.4}" fill="none" stroke="#111" stroke-width="1.5"/>
      <rect x="${x}" y="${yBottom-sh*0.2}" width="${sw}" height="${sh*0.2}" fill="none" stroke="#111" stroke-width="1.5"/>
    `;
  } else if (type === 'table') {
    shape = `
      <rect x="${x}" y="${y+sh*0.2}" width="${sw}" height="${sh*0.1}" fill="none" stroke="#111" stroke-width="1.5"/>
      <line x1="${x+sw*0.1}" y1="${y+sh*0.3}" x2="${x+sw*0.1}" y2="${yBottom}" stroke="#111" stroke-width="1.5"/>
      <line x1="${x+sw*0.9}" y1="${y+sh*0.3}" x2="${x+sw*0.9}" y2="${yBottom}" stroke="#111" stroke-width="1.5"/>
    `;
  } else if (type === 'lamp-floor') {
    shape = `
      <rect x="${cx-sw*0.3}" y="${y}" width="${sw*0.6}" height="${sh*0.15}" fill="none" stroke="#111" stroke-width="1.5"/>
      <line x1="${cx}" y1="${y+sh*0.15}" x2="${cx}" y2="${yBottom-sh*0.05}" stroke="#111" stroke-width="1.5"/>
      <rect x="${cx-sw*0.2}" y="${yBottom-sh*0.05}" width="${sw*0.4}" height="${sh*0.05}" fill="none" stroke="#111" stroke-width="1.5"/>
    `;
  } else if (type === 'lamp-table') {
    shape = `
      <rect x="${cx-sw*0.35}" y="${y+sh*0.3}" width="${sw*0.7}" height="${sh*0.25}" fill="none" stroke="#111" stroke-width="1.5"/>
      <line x1="${cx}" y1="${y+sh*0.55}" x2="${cx}" y2="${yBottom-sh*0.05}" stroke="#111" stroke-width="1.5"/>
      <rect x="${cx-sw*0.3}" y="${yBottom-sh*0.05}" width="${sw*0.6}" height="${sh*0.05}" fill="none" stroke="#111" stroke-width="1.5"/>
    `;
  } else if (type === 'shelf') {
    shape = `
      <rect x="${x}" y="${y}" width="${sw}" height="${sh}" fill="none" stroke="#111" stroke-width="1.5"/>
      <line x1="${x}" y1="${y+sh*0.33}" x2="${x+sw}" y2="${y+sh*0.33}" stroke="#111" stroke-width="1"/>
      <line x1="${x}" y1="${y+sh*0.66}" x2="${x+sw}" y2="${y+sh*0.66}" stroke="#111" stroke-width="1"/>
    `;
  } else if (type === 'stool') {
    shape = `
      <rect x="${x}" y="${y+sh*0.3}" width="${sw}" height="${sh*0.12}" fill="none" stroke="#111" stroke-width="1.5"/>
      <line x1="${x+sw*0.15}" y1="${y+sh*0.42}" x2="${x+sw*0.15}" y2="${yBottom}" stroke="#111" stroke-width="1.5"/>
      <line x1="${x+sw*0.85}" y1="${y+sh*0.42}" x2="${x+sw*0.85}" y2="${yBottom}" stroke="#111" stroke-width="1.5"/>
    `;
  } else if (type === 'cabinet') {
    shape = `
      <rect x="${x}" y="${y}" width="${sw}" height="${sh}" fill="none" stroke="#111" stroke-width="1.5"/>
      <line x1="${cx}" y1="${y}" x2="${cx}" y2="${yBottom}" stroke="#111" stroke-width="1"/>
      <line x1="${x}" y1="${y+sh*0.5}" x2="${x+sw}" y2="${y+sh*0.5}" stroke="#111" stroke-width="1"/>
    `;
  } else if (type === 'bench') {
    shape = `
      <rect x="${x}" y="${y+sh*0.35}" width="${sw}" height="${sh*0.1}" fill="none" stroke="#111" stroke-width="1.5"/>
      <line x1="${x+sw*0.1}" y1="${y+sh*0.45}" x2="${x+sw*0.1}" y2="${yBottom}" stroke="#111" stroke-width="1.5"/>
      <line x1="${x+sw*0.9}" y1="${y+sh*0.45}" x2="${x+sw*0.9}" y2="${yBottom}" stroke="#111" stroke-width="1.5"/>
    `;
  } else if (type === 'mirror') {
    shape = `
      <circle cx="${cx}" cy="${y+sh/2}" r="${Math.min(sw,sh)/2}" fill="none" stroke="#111" stroke-width="1.5"/>
    `;
  }

  const dimY = yBottom + 40;
  const dimX = x - 40;

  return `
    <svg class="tech-drawing" viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg">
      ${shape}
      <!-- WIDTH dimension -->
      <line x1="${x}" y1="${dimY}" x2="${x+sw}" y2="${dimY}" stroke="#77756F" stroke-width="1"/>
      <line x1="${x}" y1="${dimY-4}" x2="${x}" y2="${dimY+4}" stroke="#77756F" stroke-width="1"/>
      <line x1="${x+sw}" y1="${dimY-4}" x2="${x+sw}" y2="${dimY+4}" stroke="#77756F" stroke-width="1"/>
      <text x="${cx}" y="${dimY+18}" text-anchor="middle" font-family="IBM Plex Mono, monospace" font-size="11" letter-spacing="1" fill="#111">W ${w} CM</text>
      <!-- HEIGHT dimension -->
      <line x1="${dimX}" y1="${y}" x2="${dimX}" y2="${yBottom}" stroke="#77756F" stroke-width="1"/>
      <line x1="${dimX-4}" y1="${y}" x2="${dimX+4}" y2="${y}" stroke="#77756F" stroke-width="1"/>
      <line x1="${dimX-4}" y1="${yBottom}" x2="${dimX+4}" y2="${yBottom}" stroke="#77756F" stroke-width="1"/>
      <text x="${dimX-10}" y="${y+sh/2}" text-anchor="middle" font-family="IBM Plex Mono, monospace" font-size="11" letter-spacing="1" fill="#111" transform="rotate(-90 ${dimX-10} ${y+sh/2})">H ${h} CM</text>
      <!-- corner marks -->
      <line x1="${x-10}" y1="${y-10}" x2="${x-10}" y2="${y-5}" stroke="#111" stroke-width="1"/>
      <line x1="${x-10}" y1="${y-10}" x2="${x-5}" y2="${y-10}" stroke="#111" stroke-width="1"/>
      <line x1="${x+sw+10}" y1="${y-10}" x2="${x+sw+10}" y2="${y-5}" stroke="#111" stroke-width="1"/>
      <line x1="${x+sw+10}" y1="${y-10}" x2="${x+sw+5}" y2="${y-10}" stroke="#111" stroke-width="1"/>
      <text x="${W-40}" y="${H-20}" text-anchor="end" font-family="IBM Plex Mono, monospace" font-size="9" letter-spacing="1" fill="#77756F">D ${d} CM · SCALE 1:20</text>
    </svg>
  `;
}

/* ============ CHECKOUT ============ */
function renderCheckout(app) {
  if (state.cart.length === 0) {
    app.innerHTML = `<div class="container" style="padding:150px 24px;text-align:center">
      <h2 style="font-family:var(--font-display);font-size:2rem;text-transform:uppercase;margin-bottom:1rem">YOUR BAG IS EMPTY</h2>
      <a href="#/collection" style="font-family:var(--font-mono);font-size:11px;letter-spacing:.14em;text-transform:uppercase;border-bottom:1px solid #111;padding-bottom:4px">EXPLORE THE COLLECTION →</a>
    </div>`;
    return;
  }
  const subtotal = cartTotal();
  const shipping = subtotal > 500 ? 0 : 45;
  const total = subtotal + shipping;

  app.innerHTML = `
    <div class="checkout-page">
      <h1 class="checkout-title">CHECKOUT</h1>
      <div class="checkout-grid">
        <form class="checkout-form" id="checkoutForm" novalidate>
          <div class="checkout-section">
            <h3>SHIPPING INFORMATION</h3>
            <div class="form-row">
              <div class="form-group">
                <label for="cName">FULL NAME *</label>
                <input type="text" id="cName" required>
                <span class="form-error" data-for="cName"></span>
              </div>
              <div class="form-group">
                <label for="cEmail">EMAIL *</label>
                <input type="email" id="cEmail" required>
                <span class="form-error" data-for="cEmail"></span>
              </div>
            </div>
            <div class="form-row">
              <div class="form-group">
                <label for="cPhone">PHONE *</label>
                <input type="tel" id="cPhone" required>
                <span class="form-error" data-for="cPhone"></span>
              </div>
              <div class="form-group">
                <label for="cCountry">COUNTRY *</label>
                <input type="text" id="cCountry" required>
                <span class="form-error" data-for="cCountry"></span>
              </div>
            </div>
            <div class="form-row">
              <div class="form-group">
                <label for="cCity">CITY *</label>
                <input type="text" id="cCity" required>
                <span class="form-error" data-for="cCity"></span>
              </div>
              <div class="form-group">
                <label for="cAddress">ADDRESS *</label>
                <input type="text" id="cAddress" required>
                <span class="form-error" data-for="cAddress"></span>
              </div>
            </div>
          </div>
          <div class="checkout-section">
            <h3>PAYMENT METHOD</h3>
            <div class="payment-options" id="paymentOptions">
              <label class="payment-option active">
                <input type="radio" name="payment" value="card" checked>
                <span class="payment-option-label">CREDIT / DEBIT CARD</span>
              </label>
              <label class="payment-option">
                <input type="radio" name="payment" value="apple">
                <span class="payment-option-label">APPLE PAY</span>
              </label>
              <label class="payment-option">
                <input type="radio" name="payment" value="bank">
                <span class="payment-option-label">BANK TRANSFER</span>
              </label>
            </div>
          </div>
          <button type="submit" class="place-order-btn">PLACE ORDER — ${formatPrice(total)}</button>
        </form>

        <aside class="order-summary">
          <h3>YOUR ORDER</h3>
          ${state.cart.map(item => `
            <div class="order-item">
              <img src="${item.image}" alt="${item.name}">
              <div class="order-item-info">
                <span class="order-item-name">${item.name} × ${item.qty}</span>
                <span class="order-item-variant">${item.variantName}</span>
              </div>
              <span class="order-item-price">${formatPrice(item.price * item.qty)}</span>
            </div>
          `).join('')}
          <div class="order-totals">
            <div class="order-row"><span>SUBTOTAL</span><span>${formatPrice(subtotal)}</span></div>
            <div class="order-row"><span>SHIPPING</span><span>${shipping === 0 ? 'FREE' : formatPrice(shipping)}</span></div>
            <div class="order-row total"><span>TOTAL</span><span>${formatPrice(total)}</span></div>
          </div>
        </aside>
      </div>
    </div>
  `;

  // Payment option active state
  $$('.payment-option').forEach(opt => {
    opt.addEventListener('click', () => {
      $$('.payment-option').forEach(o => o.classList.remove('active'));
      opt.classList.add('active');
    });
  });

  // Form validation
  const form = $('#checkoutForm');
  const fields = ['cName','cEmail','cPhone','cCountry','cCity','cAddress'];
  fields.forEach(id => {
    const el = $('#' + id);
    el.addEventListener('blur', () => validateCheckoutField(el));
    el.addEventListener('input', () => { if (el.classList.contains('error')) validateCheckoutField(el); });
  });

  form.addEventListener('submit', e => {
    e.preventDefault();
    let valid = true;
    fields.forEach(id => {
      if (!validateCheckoutField($('#' + id))) valid = false;
    });
    if (!valid) return;

    const orderNum = 'FORM-' + String(Math.floor(Math.random()*9000+1000));
    state.cart = [];
    saveCart();
    updateCartBadge();
    renderCartDrawer();

    app.innerHTML = `
      <div class="checkout-success">
        <div class="success-mark">✓</div>
        <h2>ORDER RECEIVED</h2>
        <p>Thank you for your order. This is a demonstration — no real payment was processed. You'll receive a confirmation email at the address provided.</p>
        <div class="order-num">ORDER #${orderNum}</div>
        <div><a href="#/collection">RETURN TO COLLECTION →</a></div>
      </div>
    `;
  });
}

function validateCheckoutField(field) {
  const errEl = document.querySelector(`.form-error[data-for="${field.id}"]`);
  const setErr = (msg) => { if (errEl) errEl.textContent = msg; field.classList.toggle('error', !!msg); };
  if (field.hasAttribute('required') && !field.value.trim()) { setErr('REQUIRED'); return false; }
  if (field.type === 'email' && field.value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(field.value)) { setErr('INVALID EMAIL'); return false; }
  if (field.type === 'tel' && field.value && field.value.replace(/\D/g,'').length < 8) { setErr('INVALID NUMBER'); return false; }
  setErr(''); return true;
}

/* ============ STORIES PAGE ============ */
function renderStories(app) {
  app.innerHTML = `
    <section class="section" style="padding-top:110px">
      <div class="container">
        <span class="section-num">STORIES</span>
        <h1 class="section-title" style="margin-bottom:1.5rem">THE IDEA<br>BEHIND THE OBJECTS.</h1>
        <p class="section-sub" style="margin-bottom:3rem">Every object we design begins with a question about the room it will inhabit.</p>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:2rem;align-items:start" class="stories-grid-2col">
          <div class="reveal">
            <img src="https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&w=1200&q=85" alt="Interior" style="width:100%;aspect-ratio:4/5;object-fit:cover">
          </div>
          <div class="reveal" style="padding-top:2rem">
            <h2 style="font-family:var(--font-display);font-size:clamp(1.6rem,3vw,2.4rem);font-weight:500;letter-spacing:-0.02em;text-transform:uppercase;margin-bottom:1.5rem">WE DESIGN OBJECTS THAT OCCUPY SPACE WITHOUT OVERWHELMING IT.</h2>
            <p style="color:var(--muted);line-height:1.7;margin-bottom:1.5rem">Furniture is not decoration. It is architecture at the scale of the body — the structure that holds daily life. Every piece we make is designed to be lived with, not around.</p>
            <p style="color:var(--muted);line-height:1.7;margin-bottom:1.5rem">Our process starts with material. We work with oak, wool, steel, glass — materials with memory and character. The form follows what the material allows.</p>
            <p style="color:var(--muted);line-height:1.7">Each collection is small by intention. We would rather make twelve objects well than a hundred objects adequately.</p>
          </div>
        </div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:2rem;margin-top:3rem" class="stories-grid-2col">
          <div class="reveal"><img src="https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1200&q=85" alt="Interior" style="width:100%;aspect-ratio:1;object-fit:cover"></div>
          <div class="reveal"><img src="https://images.unsplash.com/photo-1615529182904-14819c35db37?auto=format&fit=crop&w=1200&q=85" alt="Interior" style="width:100%;aspect-ratio:1;object-fit:cover"></div>
        </div>
      </div>
    </section>
  `;
  initReveals();
}

/* ============ STUDIO PAGE ============ */
function renderStudio(app) {
  app.innerHTML = `
    <section class="section" style="padding-top:110px">
      <div class="container">
        <span class="section-num">THE STUDIO</span>
        <h1 class="section-title" style="margin-bottom:1.5rem">DESIGN.<br>MATERIAL.<br>CRAFT.<br>SPACE.</h1>
        <p class="section-sub" style="margin-bottom:3rem">Four principles that guide every object we produce.</p>
        <div class="studio-grid">
          ${[
            ['DESIGN','https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=800&q=85','Every object begins as a drawing — an architectural problem solved at the scale of furniture.'],
            ['MATERIAL','https://images.unsplash.com/photo-1533090161767-e6ffed986c88?auto=format&fit=crop&w=800&q=85','We select raw materials for character, not for uniformity. Each has its own grain, weight, and memory.'],
            ['CRAFT','https://images.unsplash.com/photo-1581858726788-75bc0f6a952d?auto=format&fit=crop&w=800&q=85','Every piece is hand-finished in our European workshop. Joinery is visible and intentional.'],
            ['SPACE','https://images.unsplash.com/photo-1615529182904-14819c35db37?auto=format&fit=crop&w=800&q=85','Objects are shaped by the room they inhabit. We design for the space between pieces as much as for the pieces themselves.'],
          ].map(([t, src, d]) => `
            <div class="studio-card reveal">
              <img src="${src}" alt="${t}" loading="lazy">
              <div class="studio-overlay"><h4>${t}</h4><p>${d}</p></div>
            </div>
          `).join('')}
        </div>
      </div>
    </section>
  `;
  initReveals();
}

/* ============ FOOTER ============ */
function renderFooter() {
  $('#footer').innerHTML = `
    <div class="footer-top">
      <div class="footer-brand">
        <h3>FORM / OBJECTS</h3>
        <p>OBJECTS FOR LIVING.</p>
        <div class="newsletter">
          <span class="footer-col-title" style="margin-top:1.5rem">NEWSLETTER</span>
          <div class="newsletter-input">
            <input type="email" placeholder="EMAIL ADDRESS" id="newsletterEmail">
            <button type="button" id="newsletterBtn">JOIN →</button>
          </div>
        </div>
      </div>
      <div class="footer-col">
        <div class="footer-col-title">COLLECTION</div>
        <a href="#/collection">ALL OBJECTS</a>
        <a href="#/collection">SEATING</a>
        <a href="#/collection">TABLES</a>
        <a href="#/collection">LIGHTING</a>
        <a href="#/collection">STORAGE</a>
      </div>
      <div class="footer-col">
        <div class="footer-col-title">STUDIO</div>
        <a href="#/studio">ABOUT</a>
        <a href="#/stories">STORIES</a>
        <a href="#/studio">MATERIALS</a>
      </div>
      <div class="footer-col">
        <div class="footer-col-title">CUSTOMER CARE</div>
        <a href="#">SHIPPING</a>
        <a href="#">RETURNS</a>
        <a href="#">CONTACT</a>
      </div>
      <div class="footer-col">
        <div class="footer-col-title">SOCIAL</div>
        <a href="#">INSTAGRAM ↗</a>
        <a href="#">PINTEREST ↗</a>
      </div>
    </div>
    <div class="footer-bottom">
      <span>© 2026 FORM / OBJECTS</span>
      <span>MADE IN EUROPE</span>
    </div>
  `;

  $('#newsletterBtn').addEventListener('click', () => {
    const email = $('#newsletterEmail').value.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { showToast('INVALID EMAIL'); return; }
    $('#newsletterEmail').value = '';
    showToast('SUBSCRIBED');
  });
}

/* ============ GLOBAL EVENT DELEGATION ============ */
function initGlobalEvents() {
  // Navbar
  $('#cartBtn').addEventListener('click', openCart);
  $('#cartClose').addEventListener('click', closeCart);
  $('#cartBackdrop').addEventListener('click', closeCart);

  $('#searchBtn').addEventListener('click', openSearch);
  $('#searchClose').addEventListener('click', closeSearch);
  $('#searchInput').addEventListener('input', e => renderSearchResults(e.target.value));
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      closeSearch();
      closeCart();
    }
  });
  $('#searchResults').addEventListener('click', e => {
    const result = e.target.closest('.search-result');
    if (result) {
      const id = result.dataset.goto;
      closeSearch();
      window.location.hash = '#/product/' + id;
    }
  });

  // Cart drawer delegation
  $('#cartBody').addEventListener('click', e => {
    const qtyBtn = e.target.closest('[data-qty]');
    if (qtyBtn) {
      updateQty(qtyBtn.dataset.qty, parseInt(qtyBtn.dataset.delta));
      return;
    }
    const removeBtn = e.target.closest('[data-remove]');
    if (removeBtn) {
      removeFromCart(removeBtn.dataset.remove);
    }
  });

  // Route change
  window.addEventListener('hashchange', router);
}

/* ============ INIT ============ */
document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initMobileMenu();
  initGlobalEvents();
  renderFooter();
  renderCartDrawer();
  updateCartBadge();
  router();
});

})();