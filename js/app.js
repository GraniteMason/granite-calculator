// Config
let config = {};

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  loadConfig();
  setupListeners();
  populatePortfolio();
  populateMonuments();
  populateCemeteries();
  updateCalculator();
  updateGraniteCalc();
});

// Load config
function loadConfig() {
  fetch('js/config.json')
    .then(r => r.json())
    .then(data => {
      config = data;
    })
    .catch(e => console.error('Error:', e));
}

// Setup listeners
function setupListeners() {
  document.getElementById('contactForm')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('contactName').value;
    const phone = document.getElementById('contactPhone').value;
    const comment = document.getElementById('contactComment').value;
    alert(`Дякуємо! Ми зв'яжемось з вами на ${phone}`);
    closeContactForm();
  });
}

// Portfolio
function populatePortfolio() {
  const grid = document.getElementById('portfolioGrid');
  if (!grid || !config.portfolio) return;

  grid.innerHTML = config.portfolio.map(item => `
    <div class="portfolio-item">
      <div class="portfolio-item-image">
        <div style="font-size: 4rem; opacity: 0.3;">🏛️</div>
      </div>
      <div class="portfolio-item-content">
        <h3>${item.title}</h3>
        <p><strong>Кладовище:</strong> ${item.cemetery}</p>
        <p><strong>Тип:</strong> ${getMonumentTypeName(item.type)}</p>
        <p>${item.description}</p>
        <p style="color: #999; font-size: 0.9rem; margin-top: 0.5rem;">${item.year}</p>
      </div>
    </div>
  `).join('');
}

// Monument Types
function populateMonuments() {
  const grid = document.getElementById('monumentTypesGrid');
  if (!grid || !config.monumentTypes) return;

  grid.innerHTML = config.monumentTypes.map(type => `
    <div class="monument-card">
      <div class="monument-image">${type.icon}</div>
      <div class="monument-content">
        <h3>${type.name}</h3>
        <p>${type.description}</p>
        <p style="color: #D4AF37; font-weight: bold; margin-top: 0.5rem;">Від ${type.basePrice.toLocaleString('uk-UA')} грн</p>
      </div>
    </div>
  `).join('');
}

// Cemeteries
function populateCemeteries() {
  const grid = document.getElementById('cemeteriesGrid');
  if (!grid || !config.cemeteries) return;

  grid.innerHTML = config.cemeteries.map(cem => `
    <div class="cemetery-card">
      <div class="cemetery-content">
        <h3>${cem.name}</h3>
        <p><strong>Адреса:</strong> ${cem.address}</p>
        <p><strong>Район:</strong> ${cem.district}</p>
        <p>${cem.description}</p>
      </div>
    </div>
  `).join('');
}

// Monument name helper
function getMonumentTypeName(type) {
  const types = {
    'plyta': 'Плита',
    'stela': 'Стела',
    'hrest': 'Хрест',
    'memorial': 'Меморіал'
  };
  return types[type] || type;
}

// Calculator update
function updateCalculator() {
  const material = document.getElementById('calcMaterial')?.value || 'granite';
  const height = parseFloat(document.getElementById('calcHeight')?.value || 200);
  const width = parseFloat(document.getElementById('calcWidth')?.value || 100);
  const fenceType = document.getElementById('calcFenceType')?.value || 'metal';
  const fenceLen = parseFloat(document.getElementById('calcFenceLength')?.value || 0);
  const fenceWid = parseFloat(document.getElementById('calcFenceWidth')?.value || 0);
  const lamps = parseInt(document.getElementById('calcLamps')?.value || 0);

  // Monument price
  const matData = config.monuments?.materials?.[material] || {};
  const area = (height * width) / 10000;
  const monumentPrice = (matData.basePrice || 50000) + (area * (matData.pricePerSqm || 8000));

  // Fence price
  const fenceData = config.monuments?.fences?.[fenceType] || { pricePerMeter: 800 };
  const perimeter = (fenceLen + fenceWid) * 2;
  const fencePrice = perimeter * fenceData.pricePerMeter;

  // Lamps price
  const lampPrice = lamps === 0 ? 0 : (lamps * 2500);

  // Total
  const total = monumentPrice + fencePrice + lampPrice;

  // Update displays
  document.getElementById('calcMonumentPrice').textContent = Math.round(monumentPrice).toLocaleString('uk-UA') + ' грн';
  document.getElementById('calcFencePrice').textContent = Math.round(fencePrice).toLocaleString('uk-UA') + ' грн';
  document.getElementById('calcLampsPrice').textContent = Math.round(lampPrice).toLocaleString('uk-UA') + ' грн';
  document.getElementById('summaryMonument').textContent = Math.round(monumentPrice).toLocaleString('uk-UA') + ' грн';
  document.getElementById('summaryFence').textContent = Math.round(fencePrice).toLocaleString('uk-UA') + ' грн';
  document.getElementById('summaryLamps').textContent = Math.round(lampPrice).toLocaleString('uk-UA') + ' грн';
  document.getElementById('summaryTotal').textContent = Math.round(total).toLocaleString('uk-UA') + ' грн';
}

// Granite calc
function updateGraniteCalc() {
  const matType = document.getElementById('graniteMatType')?.value || 'polished';
  const length = parseFloat(document.getElementById('graniteL')?.value || 100);
  const width = parseFloat(document.getElementById('graniteW')?.value || 50);

  const matData = config.graniteTypes?.[matType] || { priceMsq: 150 };
  const area = (length * width) / 10000;
  const price = area * matData.priceMsq;

  document.getElementById('graniteProductPrice').textContent = Math.round(price).toLocaleString('uk-UA') + ' грн';
}

// Contact form
function showContactForm() {
  document.getElementById('contactModal').classList.add('show');
}

function closeContactForm() {
  document.getElementById('contactModal').classList.remove('show');
  document.getElementById('contactForm').reset();
}

// Close modal on bg click
window.addEventListener('click', (e) => {
  const modal = document.getElementById('contactModal');
  if (e.target === modal) {
    closeContactForm();
  }
});
