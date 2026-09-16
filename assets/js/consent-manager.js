(function () {
  "use strict";

  var analyticsId = "G-QDDGF2YJVT";
  var language = (document.documentElement.lang || "en").toLowerCase().split("-")[0];

  var translations = {
    en: {
      prompt: "We use optional analytics cookies to understand how Feature Space's website is used. Analytics stays off unless you accept it.",
      accept: "Accept analytics",
      reject: "Reject non-essential",
      preferences: "Preferences",
      settings: "Cookie settings",
      title: "Cookie preferences",
      description: "Choose whether Feature Space may use Google Analytics on this website. Necessary browser storage keeps your cookie preference.",
      save: "Save and close",
      necessary: "Necessary",
      necessaryDescription: "Required to remember your cookie choice and keep the website working as expected.",
      analytics: "Analytics",
      analyticsDescription: "Google Analytics helps us understand visits and improve the website. It loads only after you accept.",
      credit: "Powered by the free Silktide Consent Manager"
    },
    sv: {
      prompt: "Vi använder valfria analyscookies för att förstå hur Feature Spaces webbplats används. Analys är avstängd tills du godkänner den.",
      accept: "Godkänn analys",
      reject: "Avvisa icke-nödvändiga",
      preferences: "Inställningar",
      settings: "Cookieinställningar",
      title: "Cookieinställningar",
      description: "Välj om Feature Space får använda Google Analytics på den här webbplatsen. Nödvändig webbläsarlagring kommer ihåg ditt cookieval.",
      save: "Spara och stäng",
      necessary: "Nödvändiga",
      necessaryDescription: "Krävs för att komma ihåg ditt cookieval och hålla webbplatsen fungerande som väntat.",
      analytics: "Analys",
      analyticsDescription: "Google Analytics hjälper oss förstå besök och förbättra webbplatsen. Det läses in först när du godkänner.",
      credit: "Drivs av kostnadsfria Silktide Consent Manager"
    }
  };

  var copy = translations[language] || translations.en;

  window.dataLayer = window.dataLayer || [];
  window.gtag = window.gtag || function () {
    window.dataLayer.push(arguments);
  };

  window.gtag("consent", "default", {
    analytics_storage: "denied",
    ad_storage: "denied",
    ad_user_data: "denied",
    ad_personalization: "denied",
    functionality_storage: "granted",
    security_storage: "granted"
  });

  function clearAnalyticsCookies() {
    document.cookie.split(";").forEach(function (entry) {
      var name = entry.split("=")[0].trim();
      if (name !== "_ga" && name.indexOf("_ga_") !== 0) return;

      var expiry = "=; Max-Age=0; path=/; SameSite=Lax";
      document.cookie = name + expiry;
      document.cookie = name + expiry + "; domain=" + window.location.hostname;

      var rootDomain = window.location.hostname.split(".").slice(-2).join(".");
      if (rootDomain && rootDomain !== window.location.hostname) {
        document.cookie = name + expiry + "; domain=." + rootDomain;
      }
    });
  }

  function hasAnalyticsId() {
    return analyticsId && analyticsId.indexOf("TODO_") !== 0;
  }

  function grantAnalytics() {
    if (!hasAnalyticsId()) return;
    window.gtag("consent", "update", { analytics_storage: "granted" });
    window.gtag("js", new Date());
    window.gtag("config", analyticsId, { anonymize_ip: true });
  }

  function rejectAnalytics() {
    window.gtag("consent", "update", { analytics_storage: "denied" });
    clearAnalyticsCookies();
  }

  if (!window.silktideConsentManager) return;

  window.silktideConsentManager.init({
    namespace: "feature-space",
    backdrop: { show: false },
    prompt: { position: "bottomCenter" },
    icon: { position: "bottomLeft" },
    consentTypes: [
      {
        id: "necessary",
        label: copy.necessary,
        description: copy.necessaryDescription,
        required: true,
        defaultValue: true
      },
      {
        id: "analytics",
        label: copy.analytics,
        description: copy.analyticsDescription,
        defaultValue: false,
        scripts: hasAnalyticsId() ? [
          {
            url: "https://www.googletagmanager.com/gtag/js?id=" + analyticsId,
            load: "async",
            type: "text/javascript"
          }
        ] : [],
        onAccept: grantAnalytics,
        onReject: rejectAnalytics
      }
    ],
    text: {
      prompt: {
        description: "<p>" + copy.prompt + " <a href=\"/privacy/\">" + copy.title + "</a>.</p>",
        acceptAllButtonText: copy.accept,
        acceptAllButtonAccessibleLabel: copy.accept,
        rejectNonEssentialButtonText: copy.reject,
        rejectNonEssentialButtonAccessibleLabel: copy.reject,
        preferencesButtonText: copy.preferences,
        preferencesButtonAccessibleLabel: copy.preferences
      },
      preferences: {
        title: copy.title,
        description: "<p>" + copy.description + "</p>",
        saveButtonText: copy.save,
        saveButtonAccessibleLabel: copy.save,
        creditLinkText: copy.credit,
        creditLinkAccessibleLabel: copy.credit
      }
    }
  });

  document.querySelectorAll(".site-footer .footer-links").forEach(function (links) {
    if (links.querySelector("[data-cookie-settings]")) return;

    var button = document.createElement("button");
    button.className = "cookie-settings-button";
    button.type = "button";
    button.textContent = copy.settings;
    button.setAttribute("data-cookie-settings", "");
    button.addEventListener("click", function () {
      var consentIcon = document.getElementById("stcm-icon");
      if (consentIcon) consentIcon.click();
    });
    links.appendChild(button);
  });
})();
