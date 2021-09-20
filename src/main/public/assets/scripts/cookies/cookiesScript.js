"use strict";
/*\
|*|
|*|  :: cookies.js ::
|*|
|*|  A complete cookies reader/writer framework with full unicode support.
|*|  https://developer.mozilla.org/en-US/docs/Web/API/Document/cookie/Simple_document.cookie_framework
|*|
|*|  Revision #3 - July 13th, 2017
|*|
|*|  https://developer.mozilla.org/en-US/docs/Web/API/document.coaokie
|*|  https://developer.mozilla.org/User:fusionchess
|*|  THIS IS THE ONE : https://github.com/madmurphy/cookies.js
|*|
|*|  This framework is released under the GNU Public License, version 3 or later.
|*|  http://www.gnu.org/licenses/gpl-3.0-standalone.html
|*|
|*|  Syntaxes:
|*|
|*|  * docCookies.setItem(name, value[, end[, path[, domain[, secure]]]])
|*|  * docCookies.getItem(name)
|*|  * docCookies.removeItem(name[, path[, domain]])
|*|  * docCookies.hasItem(name)
|*|  * docCookies.keys()
|*|
\*/ var docCookies = {
    getItem: function getItem(sKey) {
        if (!sKey) {
            return null;
        }
        return decodeURIComponent(document.cookie.replace(new RegExp("(?:(?:^|.*;)\\s*" + encodeURIComponent(sKey).replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\=\\s*([^;]*).*$)|^.*$"), "$1")) || null;
    },
    setItem: function setItem(sKey, sValue, vEnd, sPath, sDomain, bSecure) {
        if (!sKey || /^(?:expires|max\-age|path|domain|secure)$/i.test(sKey)) {
            return false;
        }
        var sExpires = "";
        if (vEnd) {
            switch (vEnd.constructor) {
                case Number:
                    sExpires = vEnd === Infinity ? "; expires=Fri, 31 Dec 9999 23:59:59 GMT" : "; expires=" + (new Date(vEnd * 1e3 + Date.now())).toUTCString();
                    /*
                    Note: Despite officially defined in RFC 6265, the use of `max-age` is not compatible with any
                    version of Internet Explorer, Edge and some mobile browsers. Therefore passing a number to
                    the end parameter might not work as expected. A possible solution might be to convert the the
                    relative time to an absolute time. For instance, replacing the previous line with:
                    */ /*
                    sExpires = vEnd === Infinity ? "; expires=Fri, 31 Dec 9999 23:59:59 GMT" : "; expires=" + (new Date(vEnd * 1e3 + Date.now())).toUTCString();
                    */ break;
                case String:
                    sExpires = "; expires=" + vEnd;
                    break;
                case Date:
                    sExpires = "; expires=" + vEnd.toUTCString();
                    break;
            }
        }
      //  const formattedCookie = encodeURIComponent(sKey) + "=" + sValue +  sExpires + (sDomain ? "; domain=" + sDomain : "") + (sPath ? "; path=" + sPath : "") + (bSecure ? "; secure" : "");
       // document.cookie = formattedCookie.toString();
        const FormattedCookies = encodeURIComponent(sKey) + "=" + sValue +  sExpires ;
        document.cookie = FormattedCookies;
        return true;
    },
    removeItem: function removeItem(sKey, sPath, sDomain) {
        if (!this.hasItem(sKey)) {
            return false;
        }
        document.cookie = encodeURIComponent(sKey) + "=; expires=Thu, 01 Jan 1970 00:00:00 GMT" + (sDomain ? "; domain=" + sDomain : "") + (sPath ? "; path=" + sPath : "");
        return true;
    },
    hasItem: function hasItem(sKey) {
        if (!sKey || /^(?:expires|max\-age|path|domain|secure)$/i.test(sKey)) {
            return false;
        }
        return new RegExp("(?:^|;\\s*)" + encodeURIComponent(sKey).replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\=").test(document.cookie);
    },
    keys: function keys() {
        var aKeys = document.cookie.replace(/((?:^|\s*;)[^\=]+)(?=;|$)|^\s*|\s*(?:\=[^;]*)?(?:\1|$)/g, "").split(/\s*(?:\=[^;]*)?;\s*/);
        for (var nLen = aKeys.length, nIdx = 0; nIdx < nLen; nIdx++) {
            aKeys[nIdx] = decodeURIComponent(aKeys[nIdx]);
        }
        return aKeys;
    },
};
(function () {
    /**
     * The initial cookie preferences
     *
     * We'll use ES5 Template Literals to output these in a more maintainable way
     * @type {*[]}
     */ var initial_cookie_preferences = [
        {
            title: "Cookies that measure website use",
            description:
                "<p>We use Google Analytics to measure how you use the website so we can improve it based on user needs. Google Analytics sets cookies that store anonymised information about:</p><ul><li>how you got to the site</li><li>the pages you visit on Crown Commercial Service (CCS), and how long you spend on each page</li><li>what you click on while you're visiting the site</li></ul><p>We do not allow Google to use or share the data about how you use this site.</p>",
            cookie_type: "usage",
            enabled: null,
            adjustable: true,
            cookies: [{ name: "1P_JAR", path: "/", domain: ".google.com" }],
        },
        {
            title: "Cookies that help with our communications and marketing",
            description: "These cookies may be set by third party websites and do things like measure how you view YouTube videos that are on Crown Commercial Service (CCS).",
            cookie_type: "marketing",
            enabled: null,
            adjustable: true,
            cookies: null,
        },
        {
            title: "Strictly necessary cookies",
            description:
                "<p>These essential cookies do things like:</p><ul><li>remember the notifications you've seen so we do not show them to you again</li><li>remember your progress through a form (for example a licence application)</li></ul><p>They always need to be on.</p>",
            cookie_type: "essential",
            enabled: null,
            adjustable: false,
            cookies: null,
        },
    ]; // Duration variables, in seconds (for easier reuse)
    // https://www.google.com/search?q=1+year+in+seconds&oq=1+year+in+seconds&aqs=chrome..69i57j0.2091j0j7&sourceid=chrome&ie=UTF-8
    var oneyear = 31540000;
    var twodays = 172800; // var onemonth = 2.628e+6;
    // Set the default cookies. This JSON Object is saved as the cookie, but we use `initial_cookie_preferences` to maintain structure and various sanity checks
    var cookie_preferences = { essentials: true, usage: false, marketing: false };
    /**
     * When user accept the cookie, show this
     */ function hideMessage() {
        var cookieConsentContainer = document.getElementById("cookie-consent-container");
        if (cookieConsentContainer) {
            cookieConsentContainer.innerHTML =
                '<div class="cookie-message__inner cookie-message__inner--accepted govuk-width-container"><p>You&rsquo;ve accepted all cookies. You can <a href="/cookie-settings">change your cookie settings</a> at any time.</p></div>';
        }
    }
    /**
     * Opt the user in to certain cookies
     */ function optUserIn() {
        hideMessage();
        updateSeenCookie();
        fireGTM();
    }
    function fireGTM() {
        (function (w, d, s, l, i) {
            w[l] = w[l] || [];
            w[l].push({ "gtm.start": new Date().getTime(), event: "gtm.js" });
            var f = d.getElementsByTagName(s)[0],
                j = d.createElement(s),
                dl = l != "dataLayer" ? "&l=" + l : "";
            j.async = true;
            j.src = "https://www.googletagmanager.com/gtm.js?id=" + i + dl;
            f.parentNode.insertBefore(j, f);
        })(window, document, "script", "dataLayer", "GTM-5NQGRQN");
    }
    function updateSeenCookie() {
        // 1 year = 3.154e+7
        // 1 month = 2.628e+6
        // set the cookie which tells us a user has 'accepted cookies'
        // setItem: function (sKey, sValue, vEnd, sPath, sDomain, bSecure)
        // docCookies.setItem('seen_cookie_message', true, oneyear, '/', '.crowncommercial.gov.uk');
        // the old 'seen' cookie is called `seen-cookie-message` (this should probably be deleted
        // Only set or change the cookies if the user hasn't updated their preferences on the Cookie Settings page
        // This is to check if the method was updateSeenCookie() was called from 'Accept all cookies' or cookie settings page
        // (in which case cookie_preferences_set will be set already)
        if (!docCookies.hasItem("cookie_preferences_set")) {
            var cookie_preferences_accepted = { essentials: true, usage: true, marketing: true };
            docCookies.setItem("cookie_preferences", JSON.stringify(cookie_preferences_accepted), oneyear, "/", ".crowncommercial.gov.uk"); // createCookie('cookie_preferences', JSON.stringify(cookie_preferences), 365, '/');
            // Set the 'cookies_timer_reset' to prevent showing the banner again next time the user visits
            docCookies.setItem("cookies_timer_reset", JSON.stringify(true), oneyear, "/", ".crowncommercial.gov.uk");
            docCookies.setItem("seen_cookie_message", true, oneyear, "/", ".crowncommercial.gov.uk");
        } // this is a case when the user selected cookies on the cookie settings page â€“ the cookie_preferences array
        // will be updated with this user's choices
        else {
            // console.log('cookie_preferences', cookie_preferences);
            var cookie_timer = cookie_preferences["marketing"] === false && cookie_preferences["usage"] === false ? twodays : oneyear;
            docCookies.setItem("cookie_preferences", JSON.stringify(cookie_preferences), cookie_timer, "/", ".crowncommercial.gov.uk"); // Set the 'cookies_timer_reset' to prevent showing the banner again next time the user visits
            docCookies.setItem("cookies_timer_reset", JSON.stringify(true), cookie_timer, "/", ".crowncommercial.gov.uk");
            docCookies.setItem("seen_cookie_message", true, cookie_timer, "/", ".crowncommercial.gov.uk");
        }
    }
    function deleteDisabledCookies(cookie_type) {
        // Loop through each cookie group
        initial_cookie_preferences.forEach(function (cookieGroup, idx) {
            // Check if the loop cookie type matches the selected cookie_type
            if (cookieGroup.cookie_type === cookie_type && cookieGroup.cookies !== null) {
                // console.log({cookieGroup});
                // Loop through each cookie in the selected cookie_type
                cookieGroup.cookies.forEach(function (cookie, idx) {
                    docCookies.removeItem(cookie.name, cookie.path, cookie.domain); // console.log("delteted: " + cookie.name);
                });
            }
        });
    }
    function UpdateCookiePreferences() {
        // update the cookie references based on user selection
        initial_cookie_preferences.forEach(function (datarecord, idx) {
            if (datarecord.adjustable) {
                var cookieElement = document.getElementById(datarecord.cookie_type);
                if (cookieElement.checked) {
                    cookie_preferences[datarecord.cookie_type] = cookieElement.value === "true";
                } else {
                    cookie_preferences[datarecord.cookie_type] = false; // send the cookie type
                    deleteDisabledCookies(datarecord.cookie_type);
                }
            }
        });
        var cookie_timer = cookie_preferences["usage"] === false && cookie_preferences["marketing"] === false ? twodays : oneyear;
        docCookies.setItem("cookie_preferences", JSON.stringify(cookie_preferences), cookie_timer, "/", ".crowncommercial.gov.uk"); // createCookie('cookie_preferences', JSON.stringify(cookie_preferences), 365, '/');
        // check if cookie_preferences_set is set, if not, set it
        // we're checking this first because we don't want to reset to today every time
        if (!docCookies.hasItem("cookie_preferences_set")) {
            // set the cookie which tells us that a user has saved their cookie preferences
            docCookies.setItem("cookie_preferences_set", true, cookie_timer, "/", ".crowncommercial.gov.uk"); // createCookie('cookie_preferences_set', 'true', 365, '/');
        }
        var SettingsUpdatedArea = document.getElementsByClassName("js-live-area");
        SettingsUpdatedArea[0].innerHTML = "<p>Your cookie settings were saved.</p>";
    }
    function generateCookieSettingsPageContent(appendTo) {
        var CookieSettingsPageContent = document.createDocumentFragment();
        var cookie_preferences = JSON.parse(docCookies.getItem("cookie_preferences")); // console.log({cookie_preferences});
        // loop through the data
        initial_cookie_preferences.forEach(function (datarecord, idx) {
            // If the cookie has already been set, match the key value to the
            // if (cookie_preferences !== null) {
            if (cookie_preferences !== null) {
                datarecord.enabled = cookie_preferences[datarecord.cookie_type];
            } // for each record we call out to a function to create the template
            var markup = createSeries(datarecord, idx); // We make a div to contain the resultant string
            var container = document.createElement("div");
            container.classList.add("govuk-form-group"); // We make the contents of the container be the result of the function
            container.innerHTML = markup; // Append the created markup to the fragment
            CookieSettingsPageContent.appendChild(container);
        });
        function createSeries(datarecord, idx) {
            if (datarecord.adjustable === true) {
                return '\n<fieldset class="govuk-fieldset" aria-describedby="'
                    .concat(datarecord.cookie_type, '-hint">\n    <legend class="govuk-fieldset__legend govuk-fieldset__legend--xl">\n      <h3 class="govuk-fieldset__heading">\n        ')
                    .concat(datarecord.title, '\n      </h3>\n    </legend>\n    <span id="')
                    .concat(datarecord.cookie_type, '-hint" class="govuk-hint">\n      ')
                    .concat(datarecord.description, '\n    </span>\n    <div class="govuk-radios govuk-radios--inline">\n      <div class="govuk-radios__item">\n                <input class="govuk-radios__input" id="')
                    .concat(datarecord.cookie_type, '" name="')
                    .concat(datarecord.cookie_type, '" type="radio"\n                ')
                    .concat(datarecord.enabled === true ? "checked" : "", '\n                value="true">\n                <label class="govuk-label govuk-radios__label" for="')
                    .concat(datarecord.cookie_type, '">\n          On\n        </label>\n      </div>\n      <div class="govuk-radios__item">\n        <input class="govuk-radios__input" id="')
                    .concat(datarecord.cookie_type, '-2" name="')
                    .concat(datarecord.cookie_type, '" type="radio"\n        ')
                    .concat(datarecord.enabled === true ? "" : "checked", '\n                value="false">\n                <label class="govuk-label govuk-radios__label" for="')
                    .concat(datarecord.cookie_type, '-2">\n          Off\n        </label>\n      </div>\n    </div>\n  </fieldset>\n            ');
            }
            if (datarecord.adjustable === false) {
                return '\n                <h3 class="heading size--xl">'.concat(datarecord.title, "</h3>\n                <div>").concat(datarecord.description, "</div>\n                ");
            }
        } // var buttonContainer = document.createElement('p');
        var CookieSettingsSubmitButton = document.createElement("button");
        CookieSettingsSubmitButton.classList.add("govuk-!-font-size-18", "govuk-!-font-weight-bold", "govuk-button", "gtm--accept-cookies-in-banner");
        CookieSettingsSubmitButton.innerHTML = "Save changes";
        CookieSettingsSubmitButton.addEventListener("click", function () {
            UpdateCookiePreferences();
            updateSeenCookie();
        });
        var CookieSettingsLiveArea = document.createElement("div");
        CookieSettingsLiveArea.classList.add("cookie-updated-notice", "js-live-area");
        CookieSettingsLiveArea.setAttribute("aria-label", "Notice");
        CookieSettingsLiveArea.setAttribute("aria-live", "polite");
        CookieSettingsLiveArea.setAttribute("role", "region"); // we put the elements in the fragment
        CookieSettingsPageContent.appendChild(CookieSettingsSubmitButton);
        CookieSettingsPageContent.appendChild(CookieSettingsLiveArea); // clear the innerHTML of the container, incase we are regenerating
        // the message (in which case, there will be innacurate content in there)
        appendTo.innerHTML = "";
        appendTo.appendChild(CookieSettingsPageContent);
    }
    /**
     * Programatically creates the cookie message notification
     */ function createCookieMessage() {
        // create the cookie message container
        var cookieMessageContainer = document.createElement("div");
        cookieMessageContainer.classList.add("cookie-message");
        cookieMessageContainer.setAttribute("id", "cookie-consent-container");
        cookieMessageContainer.setAttribute("aria-label", "Cookie Policy");
        cookieMessageContainer.setAttribute("aria-live", "polite"); // create the inner contents of the cookie message
        var cookieMessageInner = document.createElement("div");
        cookieMessageInner.classList.add("cookie-message__inner", "govuk-width-container");
        cookieMessageInner.classList.add("site-container");
        cookieMessageInner.innerHTML =
            '<h2 class="govuk-heading-m">Cookies on crowncommercial.gov.uk</h2><div class="cookie-message__intro"><p>We use cookies to collect information about how you use crowncommercial.gov.uk.<br><br> We use this information to make the website work as well as possible and improve government services.</p></div>';
        var optInButton = document.createElement("button");
        optInButton.classList.add("govuk-!-font-size-18", "govuk-!-font-weight-bold", "govuk-button", "gtm--accept-cookies-in-banner");
        optInButton.innerHTML = "Accept all cookies";
        optInButton.addEventListener("click", optUserIn);
        var settingsButton = document.createElement("a");
        settingsButton.classList.add("govuk-!-font-size-18", "govuk-!-font-weight-bold", "govuk-button");
        settingsButton.setAttribute("href", "/cookie-settings");
        settingsButton.innerHTML = "Set cookie preferences"; // optOutButton.classList.add('button');
        // optOutButton.classList.add('button--tight');
        // optOutButton.classList.add('button--deny');
        // optOutButton.addEventListener('click', optUserOut);
        var cookieMessageButtons = document.createElement("div");
        cookieMessageButtons.classList.add("cookie-message__actions");
        cookieMessageButtons.appendChild(optInButton);
        cookieMessageButtons.appendChild(settingsButton);
        cookieMessageInner.appendChild(cookieMessageButtons); // append the inner contents to the cookie message container
        cookieMessageContainer.appendChild(cookieMessageInner); // add the cookie message to the start of the document body
        //document.body.prepend(cookieMessageContainer);
        var toContent = document.getElementById("skiplink-container");
        document.body.insertBefore(cookieMessageContainer, toContent);
        cookieMessageContainer.style.display = "block";
    }
    /**
     * Only show the cookie message if the user hasn't previously dismissed it (and we're NOT on the cookie-settings page, matches based on the slug)
     */ if (!docCookies.hasItem("seen_cookie_message") && window.location.href.indexOf("cookie-settings") === -1) {
        createCookieMessage();
    } // Only set the default cookies if they haven't been set
    if (!docCookies.hasItem("cookie_preferences")) {
        docCookies.setItem("cookie_preferences", JSON.stringify(cookie_preferences), twodays, "/", ".crowncommercial.gov.uk"); // docCookies.setItem('cookies_timer_reset', JSON.stringify(cookie_preferences), oneyear, '/', '.crowncommercial.gov.uk');
        // createCookie('cookie_preferences', JSON.stringify(cookie_preferences), 365, '/');
    }
    /** ---------- RESET COOKIE TIMERS ----------
     * 'seen_cookie_message' determines if the current user has previously seen the banner and accepted cookies
     * 'cookies_timer_reset' determines if user has an old version of cookie timers
     * If the user has previously accepted cookies but has an old version of the timers, show the banner again
     */ if (docCookies.hasItem("seen_cookie_message") && !docCookies.hasItem("cookies_timer_reset")) {
        // If not on the cookie settings page, show the banner;
        if (window.location.href.indexOf("cookie-settings") === -1) {
            createCookieMessage();
        }
    }
    /**
     * Run JavaScript for the component (component-cookie-consent) that displays
     * the current user opt-in/out status, with a toggle button
     */ var cookieConsentAreas = document.getElementsByClassName("cookie-consent-information");
    for (var i = 0; i < cookieConsentAreas.length; i++) {
        // generateStatusMessage(cookieConsentAreas[i]);
        generateCookieSettingsPageContent(cookieConsentAreas[i]);
    }
})();
