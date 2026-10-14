/**
 * Sylvan & Soil — Restoration Projects
 * Interactive GIS Field Telemetry & Empirical Habitat Recovery Dashboard
 */

document.addEventListener('DOMContentLoaded', () => {
  const siteButtons = document.querySelectorAll('.telemetry-site-btn');
  if (!siteButtons.length) return;

  const siteData = {
    cedar: {
      title: 'Cedar Creek Stream Bank & Hydric Basin',
      badge: 'Riparian Stabilization Protocol',
      coords: '41°42\'18"N · 73°55\'44"W',
      acreage: '14.2 Acres',
      watershed: 'Hudson Basin',
      soil: 'Fluvaquent Silt',
      desc: 'Live stake bioengineering with native willow and silky dogwood. Stream bank shear strength restored, completely eliminating sediment runoff into downstream trout waters.',
      image: 'assets/images/projects/project-cedar-creek.jpg',
      g1Val: '3.8 in/hr (+1160%)', g1Width: '88%', g1Base: '0.3 in/hr (Compacted)',
      g2Val: '48 Native Species', g2Width: '92%', g2Base: '3 Invasive Grasses',
      g3Val: '52 Visits / hr', g3Width: '85%', g3Base: '2 Visits / hr',
      g4Val: '6.2 NTU (-94%)', g4Width: '94%', g4Base: '145 NTU (Heavy Silt)'
    },
    pine: {
      title: 'Pine Ridge High-Density Native Meadow',
      badge: 'Prairie Conversion Protocol',
      coords: '42°15\'33"N · 73°22\'10"W',
      acreage: '28.0 Acres',
      watershed: 'Housatonic Upper',
      soil: 'Glacial Sandy Loam',
      desc: 'Converted 28 acres of continuous-mow turf into a multi-tiered native matrix. Zero supplemental irrigation required after initial germination, eliminating 45,000 gallons/week of municipal water draw.',
      image: 'assets/images/projects/project-pine-ridge.jpg',
      g1Val: '4.4 in/hr (+1360%)', g1Width: '94%', g1Base: '0.3 in/hr (Turf Pan)',
      g2Val: '42 Native Forbs', g2Width: '88%', g2Base: '2 Lawn Grasses',
      g3Val: '68 Visits / hr (17x gain)', g3Width: '96%', g3Base: '4 Visits / hr',
      g4Val: '4.1 NTU (-96%)', g4Width: '96%', g4Base: '110 NTU (Mower Slough)'
    },
    oak: {
      title: 'Heritage Oak Savanna Understory Renewal',
      badge: 'Woodland Savanna Protocol',
      coords: '41°48\'05"N · 73°11\'29"W',
      acreage: '18.5 Acres',
      watershed: 'Farmington Valley',
      soil: 'Upland Till Complex',
      desc: 'Eradicated 12 acres of dense invasive buckthorn and honeysuckle beneath 150-year-old bur oaks. Re-seeded with light-adapted savanna sedges and mycorrhizal woodland ephemerals.',
      image: 'assets/images/projects/project-oak-savanna.jpg',
      g1Val: '3.2 in/hr (+950%)', g1Width: '82%', g1Base: '0.3 in/hr (Crusted)',
      g2Val: '36 Woodland Ephemerals', g2Width: '85%', g2Base: '1 Monoculture Brush',
      g3Val: '39 Visits / hr', g3Width: '78%', g3Base: '1 Visit / hr',
      g4Val: '3.5 NTU (-97%)', g4Width: '97%', g4Base: '130 NTU (Forest Erosion)'
    },
    highland: {
      title: 'Highland Monarch Ridge & Pollinator Belt',
      badge: 'Migratory Habitat Protocol',
      coords: '41°29\'50"N · 74°02\'15"W',
      acreage: '9.8 Acres',
      watershed: 'Wallkill Sub-Basin',
      soil: 'Channery Silt Loam',
      desc: 'High-density installation of 4 regional milkweed species and late autumn goldenrods along migratory ridge lines, creating vital fuel stations for southbound monarch butterfly generations.',
      image: 'assets/images/projects/project-monarch-way.png',
      g1Val: '2.9 in/hr (+860%)', g1Width: '78%', g1Base: '0.3 in/hr (Pasture)',
      g2Val: '54 Pollinator Stars', g2Width: '95%', g2Base: '4 Pasture Weeds',
      g3Val: '84 Visits / hr (21x boost)', g3Width: '98%', g3Base: '4 Visits / hr',
      g4Val: '5.0 NTU (-95%)', g4Width: '95%', g4Base: '98 NTU (Gully Wash)'
    }
  };

  const titleEl = document.getElementById('telemetryTitle');
  const badgeEl = document.getElementById('telemetryBadge');
  const coordsEl = document.getElementById('telemetryCoords');
  const acreageEl = document.getElementById('telemetryAcreage');
  const watershedEl = document.getElementById('telemetryWatershed');
  const soilEl = document.getElementById('telemetrySoil');
  const descEl = document.getElementById('telemetryDesc');
  const imgEl = document.getElementById('telemetryImage');

  const g1ValEl = document.getElementById('gaugeVal1');
  const g1BarEl = document.getElementById('gaugeBar1');
  const g1BaseEl = document.getElementById('gaugeBase1');

  const g2ValEl = document.getElementById('gaugeVal2');
  const g2BarEl = document.getElementById('gaugeBar2');
  const g2BaseEl = document.getElementById('gaugeBase2');

  const g3ValEl = document.getElementById('gaugeVal3');
  const g3BarEl = document.getElementById('gaugeBar3');
  const g3BaseEl = document.getElementById('gaugeBase3');

  const g4ValEl = document.getElementById('gaugeVal4');
  const g4BarEl = document.getElementById('gaugeBar4');
  const g4BaseEl = document.getElementById('gaugeBase4');

  function updateSite(key) {
    const data = siteData[key];
    if (!data) return;

    siteButtons.forEach(btn => {
      btn.classList.toggle('active', btn.getAttribute('data-site') === key);
    });

    if (titleEl) titleEl.textContent = data.title;
    if (badgeEl) badgeEl.textContent = data.badge;
    if (coordsEl) coordsEl.textContent = data.coords;
    if (acreageEl) acreageEl.textContent = data.acreage;
    if (watershedEl) watershedEl.textContent = data.watershed;
    if (soilEl) soilEl.textContent = data.soil;
    if (descEl) descEl.textContent = data.desc;
    if (imgEl) {
      imgEl.style.opacity = '0.3';
      setTimeout(() => {
        imgEl.src = data.image;
        imgEl.style.opacity = '1';
      }, 180);
    }

    if (g1ValEl) g1ValEl.textContent = data.g1Val;
    if (g1BarEl) g1BarEl.style.width = data.g1Width;
    if (g1BaseEl) g1BaseEl.textContent = data.g1Base;

    if (g2ValEl) g2ValEl.textContent = data.g2Val;
    if (g2BarEl) g2BarEl.style.width = data.g2Width;
    if (g2BaseEl) g2BaseEl.textContent = data.g2Base;

    if (g3ValEl) g3ValEl.textContent = data.g3Val;
    if (g3BarEl) g3BarEl.style.width = data.g3Width;
    if (g3BaseEl) g3BaseEl.textContent = data.g3Base;

    if (g4ValEl) g4ValEl.textContent = data.g4Val;
    if (g4BarEl) g4BarEl.style.width = data.g4Width;
    if (g4BaseEl) g4BaseEl.textContent = data.g4Base;
  }

  siteButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const siteKey = btn.getAttribute('data-site');
      updateSite(siteKey);
    });
  });
});
