/**
 * Sylvan & Soil — Habitat Restoration & Ecological Contracting
 * Interactive Capability Hub Tab Controller & URL Service Param Sync
 */

document.addEventListener('DOMContentLoaded', () => {
  const dockTabs = document.querySelectorAll('.capability-dock-tab');
  const miniCards = document.querySelectorAll('.capability-mini-card');
  const dossiers = document.querySelectorAll('.capability-dossier');

  if (!dockTabs.length || !dossiers.length) return;

  function switchCapability(targetId, shouldScroll = false) {
    if (!targetId) return;

    // Update dock tabs
    dockTabs.forEach(tab => {
      const match = tab.getAttribute('data-target-capability') === targetId;
      tab.classList.toggle('active', match);
      tab.setAttribute('aria-selected', match ? 'true' : 'false');
    });

    // Update mini cards
    miniCards.forEach(card => {
      const match = card.getAttribute('data-target-capability') === targetId;
      card.classList.toggle('active', match);
    });

    // Update dossiers
    let targetDossier = null;
    dossiers.forEach(dossier => {
      if (dossier.id === `capability-${targetId}`) {
        dossier.classList.add('active');
        targetDossier = dossier;
      } else {
        dossier.classList.remove('active');
      }
    });

    if (shouldScroll && targetDossier) {
      const hub = document.getElementById('servicesCatalog');
      if (hub) {
        const topOffset = hub.getBoundingClientRect().top + window.scrollY - 100;
        window.scrollTo({ top: topOffset, behavior: 'smooth' });
      }
    }
  }

  // Click handler for dock tabs
  dockTabs.forEach(tab => {
    tab.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = tab.getAttribute('data-target-capability');
      switchCapability(targetId, false);
    });
  });

  // Click handler for quick deck mini cards
  miniCards.forEach(card => {
    card.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = card.getAttribute('data-target-capability');
      switchCapability(targetId, true);
    });
  });

  // URL Query Param Check (e.g. habitat-restoration.html?service=pollinator)
  const urlParams = new URLSearchParams(window.location.search);
  const serviceParam = urlParams.get('service');
  if (serviceParam) {
    switchCapability(serviceParam, true);
  }
});
