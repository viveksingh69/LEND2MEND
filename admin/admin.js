/* =============================================
   SAINI ADMIN — JavaScript
   Handles: auth guard, tab switching,
   policy CRUD, image upload, settings
   ============================================= */

// ─── Auth Guard ───────────────────────────────
(function () {
  if (!sessionStorage.getItem('saini_admin_auth')) {
    window.location.href = 'index.html';
  }
})();

// ─── Storage Keys ──────────────────────────────
const KEYS = {
  policies: 'saini_policies',
  images:   'saini_images',
  password: 'saini_admin_pass',
};

// ─── Helpers ──────────────────────────────────
function getStore(key) {
  try { return JSON.parse(localStorage.getItem(key)) || []; }
  catch { return []; }
}

function setStore(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}

function uid() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
}

function showToast(msg, type = 'ok') {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.className = `toast ${type} show`;
  setTimeout(() => t.classList.remove('show'), 3000);
}

function confirmAction(msg) {
  return window.confirm(msg);
}

// ─── Tab Switching ─────────────────────────────
const tabs = ['overview', 'policies', 'images', 'settings'];

function switchTab(tabId) {
  tabs.forEach(t => {
    const panel = document.getElementById('tab-' + t);
    const link  = document.getElementById('nav-' + t);
    if (panel) panel.classList.toggle('active', t === tabId);
    if (link)  link.classList.toggle('active',  t === tabId);
  });
  const titles = {
    overview: 'Overview',
    policies: 'Policies',
    images:   'Image Manager',
    settings: 'Settings',
  };
  document.getElementById('pageTitle').textContent = titles[tabId] || tabId;
  if (tabId === 'overview') renderOverview();
}

document.querySelectorAll('.sidebar-link[data-tab]').forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();
    switchTab(link.dataset.tab);
  });
});

document.querySelectorAll('.ov-link[data-goto]').forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();
    switchTab(link.dataset.goto);
  });
});

// ─── Logout ────────────────────────────────────
document.getElementById('logoutBtn').addEventListener('click', () => {
  sessionStorage.removeItem('saini_admin_auth');
  window.location.href = 'index.html';
});

// ═══════════════════════════════════════════════
// POLICIES
// ═══════════════════════════════════════════════

let editingPolicyId = null;

function getPolicies() { return getStore(KEYS.policies); }
function savePolicies(p) { setStore(KEYS.policies, p); }

const policyForm = document.getElementById('policyForm');
const policySubmitBtn = document.getElementById('policySubmitBtn');
const cancelPolicyEdit = document.getElementById('cancelPolicyEdit');

policyForm.addEventListener('submit', e => {
  e.preventDefault();

  const policy = {
    id:      editingPolicyId || uid(),
    title:   document.getElementById('policyTitle').value.trim(),
    type:    document.getElementById('policyType').value,
    desc:    document.getElementById('policyDesc').value.trim(),
    content: document.getElementById('policyContent').value.trim(),
    url:     document.getElementById('policyUrl').value.trim(),
    status:  document.getElementById('policyStatus').value,
    date:    document.getElementById('policyDate').value,
    created: editingPolicyId ? undefined : new Date().toISOString(),
    updated: new Date().toISOString(),
  };

  const policies = getPolicies();

  if (editingPolicyId) {
    const idx = policies.findIndex(p => p.id === editingPolicyId);
    if (idx !== -1) {
      policy.created = policies[idx].created;
      policies[idx] = policy;
    }
    showToast('Policy updated successfully', 'ok');
  } else {
    policies.unshift(policy);
    showToast('Policy added successfully', 'ok');
  }

  savePolicies(policies);
  renderPoliciesList();
  resetPolicyForm();
});

cancelPolicyEdit.addEventListener('click', resetPolicyForm);

function resetPolicyForm() {
  editingPolicyId = null;
  policyForm.reset();
  document.getElementById('policyFormTitle').textContent = 'Add New Policy';
  policySubmitBtn.innerHTML = `
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17,21 17,13 7,13 7,21"/><polyline points="7,3 7,8 15,8"/></svg>
    Save Policy`;
  cancelPolicyEdit.style.display = 'none';
}

function startEditPolicy(id) {
  const policy = getPolicies().find(p => p.id === id);
  if (!policy) return;
  editingPolicyId = id;
  document.getElementById('policyTitle').value   = policy.title || '';
  document.getElementById('policyType').value    = policy.type  || 'Other';
  document.getElementById('policyDesc').value    = policy.desc  || '';
  document.getElementById('policyContent').value = policy.content || '';
  document.getElementById('policyUrl').value     = policy.url   || '';
  document.getElementById('policyStatus').value  = policy.status || 'pending';
  document.getElementById('policyDate').value    = policy.date  || '';
  document.getElementById('policyFormTitle').textContent = 'Edit Policy';
  policySubmitBtn.innerHTML = `
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
    Update Policy`;
  cancelPolicyEdit.style.display = 'flex';
  document.querySelector('.form-card').scrollIntoView({ behavior: 'smooth' });
}

function deletePolicy(id) {
  if (!confirmAction('Delete this policy? This cannot be undone.')) return;
  const policies = getPolicies().filter(p => p.id !== id);
  savePolicies(policies);
  renderPoliciesList();
  showToast('Policy deleted', 'ok');
}

function viewPolicyContent(id) {
  const policy = getPolicies().find(p => p.id === id);
  if (!policy) return;
  document.getElementById('modalTitle').textContent = policy.title;
  document.getElementById('modalBody').textContent = policy.content || policy.desc || '(No full content saved)';
  document.getElementById('policyModal').style.display = 'flex';
}

function renderPoliciesList() {
  const policies = getPolicies();
  const container = document.getElementById('policiesList');
  const countEl = document.getElementById('policyCount');
  countEl.textContent = policies.length;

  if (!policies.length) {
    container.innerHTML = `<div class="empty-state"><span>📋</span><p>No policies added yet. Use the form above to add your first policy.</p></div>`;
    return;
  }

  container.innerHTML = policies.map(p => `
    <div class="policy-item">
      <div class="policy-item-icon">📄</div>
      <div class="policy-item-body">
        <div class="policy-item-title">${escHtml(p.title)}</div>
        <div class="policy-item-desc">${escHtml(p.desc)}</div>
        <div class="policy-item-meta">
          <span class="pill ${p.status === 'active' ? 'pill-active' : 'pill-pending'}">${p.status === 'active' ? 'Published' : 'Draft'}</span>
          <span class="pill pill-type">${escHtml(p.type)}</span>
          ${p.date ? `<span class="policy-item-date">${p.date}</span>` : ''}
        </div>
      </div>
      <div class="policy-item-actions">
        ${p.content ? `<button class="btn-act view" onclick="viewPolicyContent('${p.id}')">View</button>` : ''}
        ${p.url ? `<a href="${escHtml(p.url)}" target="_blank" class="btn-act">PDF</a>` : ''}
        <button class="btn-act" onclick="startEditPolicy('${p.id}')">Edit</button>
        <button class="btn-act del" onclick="deletePolicy('${p.id}')">Delete</button>
      </div>
    </div>
  `).join('');
}

// Modal close
document.getElementById('modalClose').addEventListener('click', () => {
  document.getElementById('policyModal').style.display = 'none';
});
document.getElementById('policyModal').addEventListener('click', e => {
  if (e.target === e.currentTarget) e.currentTarget.style.display = 'none';
});

// ═══════════════════════════════════════════════
// IMAGES
// ═══════════════════════════════════════════════

function getImages() { return getStore(KEYS.images); }
function saveImages(imgs) { setStore(KEYS.images, imgs); }

let pendingImageData = null; // base64 of selected image

const dropZone = document.getElementById('dropZone');
const fileInput = document.getElementById('imageFileInput');
const imagePreview = document.getElementById('imagePreview');
const imagePreviewWrap = document.getElementById('imagePreviewWrap');
const imageSubmitBtn = document.getElementById('imageSubmitBtn');
const clearImageBtn = document.getElementById('clearImageBtn');
const imageForm = document.getElementById('imageForm');

// Click zone to open file picker
dropZone.addEventListener('click', () => fileInput.click());

// Drag & Drop
dropZone.addEventListener('dragover', e => {
  e.preventDefault();
  dropZone.classList.add('drag-over');
});
dropZone.addEventListener('dragleave', () => dropZone.classList.remove('drag-over'));
dropZone.addEventListener('drop', e => {
  e.preventDefault();
  dropZone.classList.remove('drag-over');
  const file = e.dataTransfer.files[0];
  if (file) processImageFile(file);
});

fileInput.addEventListener('change', () => {
  if (fileInput.files[0]) processImageFile(fileInput.files[0]);
});

function processImageFile(file) {
  if (!file.type.startsWith('image/')) {
    showToast('Please select a valid image file', 'err');
    return;
  }
  if (file.size > 5 * 1024 * 1024) {
    showToast('Image must be under 5MB', 'err');
    return;
  }
  const reader = new FileReader();
  reader.onload = ev => {
    pendingImageData = ev.target.result;
    imagePreview.src = pendingImageData;
    imagePreviewWrap.style.display = 'block';
    imageSubmitBtn.disabled = false;
    clearImageBtn.style.display = 'inline-flex';
    // Pre-fill label from filename
    if (!document.getElementById('imageLabel').value) {
      document.getElementById('imageLabel').value = file.name.replace(/\.[^.]+$/, '').replace(/[-_]/g, ' ');
    }
  };
  reader.readAsDataURL(file);
}

clearImageBtn.addEventListener('click', clearImageSelection);

function clearImageSelection() {
  pendingImageData = null;
  imagePreview.src = '';
  imagePreviewWrap.style.display = 'none';
  imageSubmitBtn.disabled = true;
  clearImageBtn.style.display = 'none';
  fileInput.value = '';
  document.getElementById('imageLabel').value = '';
  document.getElementById('imageAlt').value = '';
}

imageForm.addEventListener('submit', e => {
  e.preventDefault();
  if (!pendingImageData) {
    showToast('Please select an image first', 'err');
    return;
  }

  const img = {
    id:      uid(),
    data:    pendingImageData,
    label:   document.getElementById('imageLabel').value.trim(),
    section: document.getElementById('imageSection').value,
    alt:     document.getElementById('imageAlt').value.trim() || document.getElementById('imageLabel').value.trim(),
    date:    new Date().toISOString(),
  };

  const images = getImages();
  images.unshift(img);
  saveImages(images);
  renderImageGallery();
  clearImageSelection();
  imageForm.reset();
  showToast('Image uploaded successfully', 'ok');
});

function deleteImage(id) {
  if (!confirmAction('Delete this image? This cannot be undone.')) return;
  const images = getImages().filter(img => img.id !== id);
  saveImages(images);
  renderImageGallery();
  showToast('Image deleted', 'ok');
}

function renderImageGallery() {
  const images = getImages();
  const container = document.getElementById('imageGallery');
  const countEl = document.getElementById('imageCount');
  countEl.textContent = images.length;

  if (!images.length) {
    container.innerHTML = `<div class="empty-state"><span>🖼️</span><p>No images uploaded yet. Use the form above to add your first image.</p></div>`;
    return;
  }

  container.innerHTML = images.map(img => `
    <div class="gallery-item">
      <img src="${img.data}" alt="${escHtml(img.alt)}" loading="lazy">
      <button class="gallery-item-del" onclick="deleteImage('${img.id}')" title="Delete image">✕</button>
      <div class="gallery-item-body">
        <div class="gallery-item-label">${escHtml(img.label)}</div>
        <div class="gallery-item-section">${escHtml(img.section)}</div>
      </div>
    </div>
  `).join('');
}

// ═══════════════════════════════════════════════
// OVERVIEW
// ═══════════════════════════════════════════════

function renderOverview() {
  const policies = getPolicies();
  const images   = getImages();

  // Stats
  const statsEl = document.getElementById('overviewStats');
  const activePolicies = policies.filter(p => p.status === 'active').length;
  statsEl.innerHTML = `
    <div class="stat-card-admin"><div class="s-label">Total Policies</div><div class="s-value">${policies.length}</div></div>
    <div class="stat-card-admin"><div class="s-label">Published</div><div class="s-value">${activePolicies}</div></div>
    <div class="stat-card-admin"><div class="s-label">Draft</div><div class="s-value">${policies.length - activePolicies}</div></div>
    <div class="stat-card-admin"><div class="s-label">Images</div><div class="s-value">${images.length}</div></div>
  `;

  // Recent policies
  const ovPol = document.getElementById('ovPoliciesList');
  if (!policies.length) {
    ovPol.innerHTML = '<p style="color:var(--text-3);font-size:13px;">No policies added yet.</p>';
  } else {
    ovPol.innerHTML = policies.slice(0, 4).map(p => `
      <div style="display:flex;align-items:center;gap:10px;padding:8px 0;border-bottom:1px solid var(--border-2);">
        <span style="font-size:16px;">📄</span>
        <div>
          <div style="font-weight:600;font-size:13px;color:var(--text);">${escHtml(p.title)}</div>
          <div style="font-size:11.5px;color:var(--text-3);">${p.type} · <span style="color:${p.status === 'active' ? '#68d391' : '#f6ad55'}">${p.status}</span></div>
        </div>
      </div>
    `).join('');
  }

  // Recent images
  const ovImg = document.getElementById('ovImagesList');
  if (!images.length) {
    ovImg.innerHTML = '<p style="color:var(--text-3);font-size:13px;">No images uploaded yet.</p>';
  } else {
    ovImg.innerHTML = images.slice(0, 8).map(img =>
      `<img class="ov-img-thumb" src="${img.data}" alt="${escHtml(img.alt)}" title="${escHtml(img.label)}">`
    ).join('');
  }
}

// ═══════════════════════════════════════════════
// SETTINGS
// ═══════════════════════════════════════════════

const DEFAULT_PASS = 'admin';

function getAdminPass() {
  return localStorage.getItem(KEYS.password) || DEFAULT_PASS;
}

document.getElementById('changePassForm').addEventListener('submit', e => {
  e.preventDefault();
  const cur     = document.getElementById('currentPass').value;
  const newP    = document.getElementById('newPass').value;
  const confirm = document.getElementById('confirmPass').value;
  const msgEl   = document.getElementById('passMsg');

  if (cur !== getAdminPass()) {
    msgEl.className = 'setting-msg err';
    msgEl.textContent = 'Current password is incorrect.';
    msgEl.style.display = 'block';
    return;
  }
  if (newP.length < 8) {
    msgEl.className = 'setting-msg err';
    msgEl.textContent = 'New password must be at least 8 characters.';
    msgEl.style.display = 'block';
    return;
  }
  if (newP !== confirm) {
    msgEl.className = 'setting-msg err';
    msgEl.textContent = 'Passwords do not match.';
    msgEl.style.display = 'block';
    return;
  }

  localStorage.setItem(KEYS.password, newP);
  msgEl.className = 'setting-msg ok';
  msgEl.textContent = '✓ Password updated successfully.';
  msgEl.style.display = 'block';
  document.getElementById('changePassForm').reset();
  showToast('Password changed successfully', 'ok');
  setTimeout(() => { msgEl.style.display = 'none'; }, 4000);
});

// Override login to use stored password
// (The login page uses the default password — in a real app this would be server-side)

document.getElementById('clearPoliciesBtn').addEventListener('click', () => {
  if (!confirmAction('Delete ALL policies? This cannot be undone.')) return;
  localStorage.removeItem(KEYS.policies);
  renderPoliciesList();
  showToast('All policies cleared', 'ok');
});

document.getElementById('clearImagesBtn').addEventListener('click', () => {
  if (!confirmAction('Delete ALL images? This cannot be undone.')) return;
  localStorage.removeItem(KEYS.images);
  renderImageGallery();
  showToast('All images cleared', 'ok');
});

document.getElementById('clearAllBtn').addEventListener('click', () => {
  if (!confirmAction('⚠️ This will delete ALL admin data (policies + images + settings). Are you absolutely sure?')) return;
  Object.values(KEYS).forEach(k => localStorage.removeItem(k));
  renderPoliciesList();
  renderImageGallery();
  showToast('All admin data reset', 'ok');
});

// ─── Escape HTML ───────────────────────────────
function escHtml(str) {
  if (!str) return '';
  return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

// ─── Init ──────────────────────────────────────
renderPoliciesList();
renderImageGallery();
renderOverview();
