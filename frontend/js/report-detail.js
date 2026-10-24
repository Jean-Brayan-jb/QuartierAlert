(function () {
  const domain = window.QuartierAlertDomain;
  const demo = window.QuartierAlertDemo;
  const ui = window.QuartierAlertUi;
  const links = window.QuartierAlertLinks;

  const root = document.getElementById("detail");
  ui.showLoading(root, "Chargement de la fiche de démonstration…");

  demo
    .loadReports()
    .then((result) => {
      const id = new URLSearchParams(window.location.search).get("id");
      if (!id) {
        ui.showError(root, "Aucun signalement n’est sélectionné.");
        return;
      }
      const report = result.reports.find((item) => item.id === id);
      if (!report) {
        ui.showEmpty(
          root,
          "Ce signalement est introuvable dans les données de démonstration actuellement affichées.",
        );
        return;
      }
      render(report);
    })
    .catch((error) => {
      ui.showError(root, error.message, ui.retryHref());
    });

  function render(report) {
    const image = report.image
      ? `<img class="detail-image" src="${ui.escapeHtml(links.asset(report.image))}" alt="Illustration fictive : ${ui.escapeHtml(report.category)}">`
      : `<p class="fine">Aucune image n’est associée à cette fiche.</p>`;
    const position = domain.hasCoordinates(report)
      ? `<p>Position approximative fictive : ${report.latitude.toFixed(2)}, ${report.longitude.toFixed(2)}. Elle ne correspond pas à un domicile.</p>
         <div id="detail-map" class="map map-short" role="region" aria-label="Carte du signalement fictif"></div>`
      : `<p>Ce signalement n’a pas de coordonnées. Le lieu textuel reste consultable, et il n’apparaît pas sur la carte.</p>`;

    root.innerHTML = `
      <p class="banner" role="note">${ui.escapeHtml(demo.DEMO_NOTICE)}</p>
      <p><a href="${ui.escapeHtml(links.reports)}">Retour aux signalements</a></p>
      <p class="card-category">${ui.escapeHtml(report.category)}</p>
      <h1>${ui.escapeHtml(report.title)}</h1>
      ${ui.statusBadge(report.status)}
      <p><time datetime="${ui.escapeHtml(report.createdAt)}">${ui.escapeHtml(domain.formatDate(report.createdAt))}</time></p>
      <p class="card-location">${ui.escapeHtml(report.locationText)}</p>
      ${image}
      <h2>Description</h2>
      <p>${ui.escapeHtml(report.description)}</p>
      <h2>Localisation</h2>
      ${position}
      <p id="map-tile-error" class="state state-error" role="alert" hidden>Les tuiles de la carte n’ont pas pu être chargées. Le service public OpenStreetMap n’est pas garanti.</p>`;

    if (!domain.hasCoordinates(report)) {
      return;
    }
    const mapNode = document.getElementById("detail-map");
    const errorNode = document.getElementById("map-tile-error");
    const view = window.QuartierAlertMap.createMap(mapNode, () => {
      errorNode.hidden = false;
    });
    if (!view) {
      errorNode.hidden = false;
      errorNode.textContent = "La carte n’a pas pu être affichée : la bibliothèque Leaflet n’est pas disponible.";
      return;
    }
    view.setMarkers([report], () => links.detail(report.id));
  }
})();
