/**
 * Sylvan & Soil — Native Plant Nursery & Habitat Restoration
 * Interactive Product Grid, Synchronized Multi-Filter System & Provenance Console
 */

document.addEventListener('DOMContentLoaded', () => {
  const filterForm = document.getElementById('plantFilterForm');
  const searchInput = document.getElementById('plantSearch');
  const typeFilter = document.getElementById('filterType');
  const regionFilter = document.getElementById('filterRegion');
  const sunFilter = document.getElementById('filterSun');
  const moistureFilter = document.getElementById('filterMoisture');
  const habitatFilter = document.getElementById('filterHabitat');
  const resetBtn = document.getElementById('resetFiltersBtn');
  const resultCount = document.getElementById('filterResultCount');
  const emptyState = document.getElementById('filterEmptyState');
  const productCards = document.querySelectorAll('[data-product-card]');
  const quickTypePills = document.querySelectorAll('[data-quick-type]');

  let currentSelectedType = 'all';

  function syncTypePills(selectedType) {
    currentSelectedType = selectedType || 'all';
    quickTypePills.forEach(p => {
      if (p.getAttribute('data-quick-type') === currentSelectedType) {
        p.classList.add('active');
        const checkIcon = p.querySelector('.type-filter-check');
        if (checkIcon) {
          checkIcon.className = 'bi bi-check2 type-filter-check';
        }
      } else {
        p.classList.remove('active');
        const checkIcon = p.querySelector('.type-filter-check');
        if (checkIcon) {
          checkIcon.className = 'bi bi-arrow-right type-filter-check';
        }
      }
    });

    if (typeFilter && typeFilter.value !== currentSelectedType) {
      typeFilter.value = currentSelectedType;
    }
  }

  function applyFilters() {
    const searchVal = searchInput ? searchInput.value.toLowerCase().trim() : '';
    const typeVal = currentSelectedType || (typeFilter ? typeFilter.value.toLowerCase() : 'all');
    const regionVal = regionFilter ? regionFilter.value.toLowerCase() : 'all';
    const sunVal = sunFilter ? sunFilter.value.toLowerCase() : 'all';
    const moistureVal = moistureFilter ? moistureFilter.value.toLowerCase() : 'all';
    const habitatVal = habitatFilter ? habitatFilter.value.toLowerCase() : 'all';

    let visibleCount = 0;

    productCards.forEach(card => {
      const name = (card.getAttribute('data-name') || '').toLowerCase();
      const botanical = (card.getAttribute('data-botanical') || '').toLowerCase();
      const type = (card.getAttribute('data-type') || '').toLowerCase();
      const region = (card.getAttribute('data-region') || '').toLowerCase();
      const sun = (card.getAttribute('data-sun') || '').toLowerCase();
      const moisture = (card.getAttribute('data-moisture') || '').toLowerCase();
      const habitat = (card.getAttribute('data-habitat') || '').toLowerCase();

      // Check matches
      const matchesSearch = !searchVal || name.includes(searchVal) || botanical.includes(searchVal);
      const matchesType = typeVal === 'all' || type === typeVal || type.includes(typeVal);
      const matchesRegion = regionVal === 'all' || region.includes(regionVal);
      const matchesSun = sunVal === 'all' || sun.includes(sunVal);
      const matchesMoisture = moistureVal === 'all' || moisture.includes(moistureVal);
      const matchesHabitat = habitatVal === 'all' || habitat.includes(habitatVal);

      if (matchesSearch && matchesType && matchesRegion && matchesSun && matchesMoisture && matchesHabitat) {
        card.style.display = 'flex';
        visibleCount++;
      } else {
        card.style.display = 'none';
      }
    });

    // Update count display
    if (resultCount) {
      resultCount.textContent = `Showing ${visibleCount} of ${productCards.length} native plant varieties`;
    }

    // Toggle empty state
    if (emptyState) {
      if (visibleCount === 0) {
        emptyState.classList.remove('d-none');
      } else {
        emptyState.classList.add('d-none');
      }
    }
  }

  // Event Listeners for Filters
  if (searchInput) searchInput.addEventListener('input', applyFilters);

  if (typeFilter) {
    typeFilter.addEventListener('change', (e) => {
      syncTypePills(e.target.value);
      applyFilters();
    });
  }

  if (regionFilter) regionFilter.addEventListener('change', applyFilters);
  if (sunFilter) sunFilter.addEventListener('change', applyFilters);
  if (moistureFilter) moistureFilter.addEventListener('change', applyFilters);
  if (habitatFilter) habitatFilter.addEventListener('change', applyFilters);

  if (quickTypePills.length) {
    quickTypePills.forEach(pill => {
      pill.addEventListener('click', (e) => {
        const selectedType = pill.getAttribute('data-quick-type');
        syncTypePills(selectedType);
        applyFilters();

        // If clicked from top categories section, smooth scroll down to catalog
        if (pill.closest('#productCategories')) {
          const inv = document.getElementById('plantInventory');
          if (inv) inv.scrollIntoView({ behavior: 'smooth' });
        }
      });
    });
  }

  function resetAll() {
    if (searchInput) searchInput.value = '';
    if (typeFilter) typeFilter.value = 'all';
    if (regionFilter) regionFilter.value = 'all';
    if (sunFilter) sunFilter.value = 'all';
    if (moistureFilter) moistureFilter.value = 'all';
    if (habitatFilter) habitatFilter.value = 'all';

    syncTypePills('all');
    applyFilters();
  }

  if (resetBtn) resetBtn.addEventListener('click', resetAll);
  const emptyResetBtn = document.getElementById('emptyResetBtn');
  if (emptyResetBtn) emptyResetBtn.addEventListener('click', resetAll);

  // Parse URL query parameters for deep linking
  const urlParams = new URLSearchParams(window.location.search);
  const qType = urlParams.get('type');
  const qRegion = urlParams.get('region');
  const qHabitat = urlParams.get('habitat');
  const qSun = urlParams.get('sun');
  const qMoisture = urlParams.get('moisture');
  const qSearch = urlParams.get('search');

  if (qType) syncTypePills(qType);
  if (qRegion && regionFilter) regionFilter.value = qRegion;
  if (qHabitat && habitatFilter) habitatFilter.value = qHabitat;
  if (qSun && sunFilter) sunFilter.value = qSun;
  if (qMoisture && moistureFilter) moistureFilter.value = qMoisture;
  if (qSearch && searchInput) searchInput.value = qSearch;

  // Initial calculation
  applyFilters();

  // ================= NEW SECTION 1: PROVENANCE ZONE SWITCHER =================
  const zoneBtns = document.querySelectorAll('.provenance-zone-btn');
  const zoneData = {
    'glacial': {
      title: 'Zone 5a-6b: Glacial Drift & Till (Midwest)',
      radius: '< 45 Miles from Parent Colony',
      purity: '100% Open-Pollinated Wild Ecotype',
      resilience: '99.4% Genetic Diversity Score',
      fungi: 'Glomus intraradices & Funneliformis',
      batch: 'BATCH: ECO-2026-GLACIAL-TILL'
    },
    'alluvial': {
      title: 'Zone 6a-7b: River Basin & Alluvial Plain (Northeast)',
      radius: '< 55 Miles from Riparian Corridor',
      purity: '100% High-Water Adaptable Wildstock',
      resilience: '98.9% Genetic Diversity Score',
      fungi: 'Pisolithus tinctorius & Rhizophagus',
      batch: 'BATCH: ECO-2026-ALLUVIAL-BASIN'
    },
    'coastal': {
      title: 'Zone 7a-8b: Coastal Plain & Sandhill (Southeast)',
      radius: '< 60 Miles from Pine Savanna',
      purity: '100% Drought & Salt Spray Resilient',
      resilience: '99.1% Genetic Diversity Score',
      fungi: 'Acaulospora scrobiculata Inoculated',
      batch: 'BATCH: ECO-2026-COASTAL-SAND'
    },
    'montane': {
      title: 'Zone 4b-5b: Northern Valley & Forest Margin',
      radius: '< 50 Miles from Climax Hardwood Ecotone',
      purity: '100% Sub-Zero Frost Hardy Stock',
      resilience: '99.7% Genetic Diversity Score',
      fungi: 'Rhizophagus clarus & Suillus',
      batch: 'BATCH: ECO-2026-MONTANE-VALLEY'
    }
  };

  if (zoneBtns.length) {
    zoneBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        zoneBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const key = btn.getAttribute('data-zone-key');
        const data = zoneData[key];
        if (!data) return;

        const titleEl = document.getElementById('zoneDisplayTitle');
        const radiusEl = document.getElementById('zoneDisplayRadius');
        const purityEl = document.getElementById('zoneDisplayPurity');
        const resilienceEl = document.getElementById('zoneDisplayResilience');
        const fungiEl = document.getElementById('zoneDisplayFungi');
        const batchEl = document.getElementById('zoneDisplayBatch');

        if (titleEl) titleEl.textContent = data.title;
        if (radiusEl) radiusEl.textContent = data.radius;
        if (purityEl) purityEl.textContent = data.purity;
        if (resilienceEl) resilienceEl.textContent = data.resilience;
        if (fungiEl) fungiEl.textContent = data.fungi;
        if (batchEl) batchEl.textContent = data.batch;
      });
    });
  }
});
