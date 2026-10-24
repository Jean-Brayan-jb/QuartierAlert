(function () {
  const domain = window.QuartierAlertDomain;
  const demo = window.QuartierAlertDemo;
  const ui = window.QuartierAlertUi;
  const links = window.QuartierAlertLinks;

  const banner = document.getElementById("demo-banner");
  const category = document.getElementById("filtre-categorie");
  const status = document.getElementById("filtre-statut");
  const reset = document.getElementById("reset-filtres");
  const mapStatus = document.getElementById("map-status");
  const mapNode = document.getElementById("problem-map");
  const tileError = document.getElementById("map-tile-error");
  const unlocated = document.getElementById("unlocated");
  const legend = document.getElementById("map-legend");
  let reports = [];
  let view = null;

  legend.innerHTML = window.QuartierAlertMap.legendHtml();
  ui.fillSelect(category, domain.CATEGORIES, "Toutes les catégories");
  ui.fillStatusSelect(status);
  mapStatus.textContent = "Chargement des positions de démonstration…";

  function render() {
    const filtered = domain.applyFilters(reports, {
      category: category.value,
      status: status.value,
    });
    if (!view) {
      ui.showError(
        mapNode,
        "La carte n’a pas pu être affichée : la bibliothèque Leaflet n’est pas disponible.",
      );
      return;
    }
    const missing = view.setMarkers(filtered, (report) => links.detail(report.id));
    if (filtered.length === 0) {
      mapStatus.textContent = "Aucun point à afficher avec ces critères.";
    } else {
      mapStatus.textContent = `${filtered.length - missing.length} point${filtered.length - missing.length > 1 ? "s" : ""} affiché${filtered.length - missing.length > 1 ? "s" : ""}.`;
    }
    if (missing.length === 0) {
      unlocated.innerHTML = "";
      return;
    }
    unlocated.innerHTML = `
      <h2>Signalements sans coordonnées</h2>
      <ul class="plain-list">
        ${missing
          .map(
            (report) =>
              `<li><a href="${ui.escapeHtml(links.detail(report.id))}">${ui.escapeHtml(report.title)}</a> — ${ui.escapeHtml(report.locationText)}</li>`,
          )
          .join("")}
      </ul>`;
  }

  category.addEventListener("change", render);
  status.addEventListener("change", render);
  reset.addEventListener("click", () => {
    category.value = "";
    status.value = "";
    render();
  });

  demo
    .loadReports()
    .then((result) => {
      ui.renderDemoControls(banner);
      reports = result.reports;
      view = window.QuartierAlertMap.createMap(mapNode, () => {
        tileError.hidden = false;
      });
      render();
    })
    .catch((error) => {
      banner.innerHTML = "";
      mapStatus.textContent = "";
      ui.showError(mapNode, error.message, ui.retryHref());
    });
})();
