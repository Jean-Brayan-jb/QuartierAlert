(function (root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) {
    module.exports = api;
  }
  root.QuartierAlertDomain = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  const CATEGORIES = [
    "Déchets",
    "Eau et assainissement",
    "Routes",
    "Éclairage public",
    "Environnement",
    "Inondation",
    "Autre",
  ];

  const STATUSES = ["submitted", "under_review", "in_progress", "resolved", "rejected"];

  const STATUS_LABELS = {
    submitted: "Soumis",
    under_review: "En examen",
    in_progress: "En cours",
    resolved: "Résolu",
    rejected: "Rejeté",
  };

  const IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];
  const IMAGE_EXTENSIONS = [".jpg", ".jpeg", ".png", ".webp"];
  const MAX_IMAGE_BYTES = 5 * 1024 * 1024;

  function validateReport(input) {
    const source = input || {};
    const errors = {};
    const title = String(source.title ?? "").trim();
    const description = String(source.description ?? "").trim();
    const category = String(source.category ?? "").trim();
    const locationText = String(source.locationText ?? "").trim();
    const latRaw = String(source.latitude ?? "").trim();
    const lngRaw = String(source.longitude ?? "").trim();

    if (title.length < 8 || title.length > 120) {
      errors.title = "Le titre doit contenir entre 8 et 120 caractères.";
    }
    if (description.length < 20 || description.length > 2000) {
      errors.description = "La description doit contenir entre 20 et 2 000 caractères.";
    }
    if (!CATEGORIES.includes(category)) {
      errors.category = "Choisissez une catégorie de la liste.";
    }
    if (locationText.length < 3 || locationText.length > 200) {
      errors.locationText =
        "Indiquez un lieu en 3 à 200 caractères. Les coordonnées GPS ne sont pas obligatoires.";
    }

    let latitude = null;
    let longitude = null;
    if (latRaw !== "" || lngRaw !== "") {
      if (latRaw === "" || lngRaw === "") {
        errors.coordinates = "Renseignez la latitude et la longitude, ou laissez les deux vides.";
      } else {
        latitude = Number(latRaw);
        longitude = Number(lngRaw);
        if (!Number.isFinite(latitude) || latitude < -90 || latitude > 90) {
          errors.latitude = "La latitude doit être un nombre entre -90 et 90.";
        }
        if (!Number.isFinite(longitude) || longitude < -180 || longitude > 180) {
          errors.longitude = "La longitude doit être un nombre entre -180 et 180.";
        }
      }
    }

    if (!source.accuracyConfirmed) {
      errors.accuracyConfirmed = "Confirmez que les informations sont exactes, à votre connaissance.";
    }

    const file = source.photo || null;
    if (file) {
      const name = String(file.name || "").toLowerCase();
      const extension = name.includes(".") ? name.slice(name.lastIndexOf(".")) : "";
      const type = String(file.type || "");
      if (!IMAGE_TYPES.includes(type) || !IMAGE_EXTENSIONS.includes(extension)) {
        errors.photo = "La photo doit être un fichier JPEG, PNG ou WebP.";
      } else if (typeof file.size === "number" && file.size > MAX_IMAGE_BYTES) {
        errors.photo = "La photo dépasse 5 Mo.";
      }
    }

    return {
      ok: Object.keys(errors).length === 0,
      errors,
      value: {
        title,
        description,
        category,
        locationText,
        latitude: errors.latitude || errors.coordinates ? null : latitude,
        longitude: errors.longitude || errors.coordinates ? null : longitude,
        accuracyConfirmed: Boolean(source.accuracyConfirmed),
      },
    };
  }

  function computeStats(reports) {
    const list = Array.isArray(reports) ? reports : [];
    const byStatus = {
      submitted: 0,
      under_review: 0,
      in_progress: 0,
      resolved: 0,
      rejected: 0,
    };
    const byCategory = Object.fromEntries(CATEGORIES.map((category) => [category, 0]));

    for (const report of list) {
      if (Object.prototype.hasOwnProperty.call(byStatus, report.status)) {
        byStatus[report.status] += 1;
      }
      if (Object.prototype.hasOwnProperty.call(byCategory, report.category)) {
        byCategory[report.category] += 1;
      }
    }

    return {
      total: list.length,
      open: byStatus.submitted + byStatus.under_review,
      inProgress: byStatus.in_progress,
      resolved: byStatus.resolved,
      byStatus,
      byCategory,
    };
  }

  function applyFilters(reports, filters) {
    const category = filters && filters.category ? filters.category : "";
    const status = filters && filters.status ? filters.status : "";
    return (Array.isArray(reports) ? reports : []).filter((report) => {
      const categoryOk = category === "" || report.category === category;
      const statusOk = status === "" || report.status === status;
      return categoryOk && statusOk;
    });
  }

  function formatDate(iso) {
    const date = new Date(iso);
    if (Number.isNaN(date.getTime())) {
      return "Date inconnue";
    }
    return new Intl.DateTimeFormat("fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(date);
  }

  function hasCoordinates(report) {
    return Number.isFinite(report.latitude) && Number.isFinite(report.longitude);
  }

  return {
    CATEGORIES,
    STATUSES,
    STATUS_LABELS,
    IMAGE_TYPES,
    IMAGE_EXTENSIONS,
    MAX_IMAGE_BYTES,
    validateReport,
    computeStats,
    applyFilters,
    formatDate,
    hasCoordinates,
  };
});
