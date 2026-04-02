/**
 * SalesBot Chatbot Loader
 *
 * Usage:
 *   <script src="https://cdn.salesbot.com/loader.js" data-bot-id="YOUR_BOT_ID"></script>
 *
 * Optional attributes:
 *   data-widget-url  — override chatbot.js CDN URL
 *   data-api-url     — override API base URL
 *
 * The script is intentionally tiny, non-blocking, and conflict-free.
 * It dynamically loads chatbot.js and calls window.SalesBotWidget.init().
 */
(function (window, document) {
  "use strict";

  var WIDGET_CDN = "https://cdn.salesbot.com/chatbot.js";
  var SCRIPT_ID = "salesbot-widget-script";
  var NAMESPACE = "__salesBotLoader__";

  // Prevent double-init
  if (window[NAMESPACE]) return;
  window[NAMESPACE] = true;

  // Find the current <script> tag to read data attributes
  var currentScript =
    document.currentScript ||
    (function () {
      var scripts = document.getElementsByTagName("script");
      return scripts[scripts.length - 1];
    })();

  var botId = currentScript && currentScript.getAttribute("data-bot-id");
  var widgetUrl =
    (currentScript && currentScript.getAttribute("data-widget-url")) ||
    WIDGET_CDN;
  var apiUrl =
    (currentScript && currentScript.getAttribute("data-api-url")) || "";

  if (!botId) {
    console.warn("[SalesBot Loader] data-bot-id attribute is required.");
    return;
  }

  function onWidgetReady() {
    if (
      typeof window.SalesBotWidget === "undefined" ||
      typeof window.SalesBotWidget.init !== "function"
    ) {
      console.error("[SalesBot Loader] Widget failed to load.");
      return;
    }
    window.SalesBotWidget.init({
      botId: botId,
      apiBaseUrl: apiUrl || undefined,
    });
  }

  function loadScript(src, onLoad, onError) {
    if (document.getElementById(SCRIPT_ID)) {
      onLoad();
      return;
    }
    var script = document.createElement("script");
    script.id = SCRIPT_ID;
    script.src = src;
    script.async = true;
    script.defer = true;
    script.onload = onLoad;
    script.onerror = onError;
    document.head.appendChild(script);
  }

  function init() {
    loadScript(
      widgetUrl,
      onWidgetReady,
      function () {
        console.error("[SalesBot Loader] Failed to load widget script from", widgetUrl);
      }
    );
  }

  // Wait for DOM ready
  if (
    document.readyState === "complete" ||
    document.readyState === "interactive"
  ) {
    // Use setTimeout to yield to current execution context
    setTimeout(init, 0);
  } else {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  }
})(window, document);
