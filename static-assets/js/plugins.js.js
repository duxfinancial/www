document.addEventListener("DOMContentLoaded", function () {

    if (document.querySelector('#motion-main-drawer__list > .mdc-list-item').textContent != 'Administration' && dataLayer[0].loggedIn == 'Y') {
        document.querySelector('#motion-main-drawer__list .mdc-drawer__close').nextElementSibling.style.display = 'none';
    }

});

// COOKIES Scripts
function cookiesShowNotificationForGa() {
    if (sessionStorage.getItem('cookie_consent') == null) {
        window.ga('send', 'event', {
            eventCategory: 'Cookies',
            eventAction: 'Show',
            eventLabel: 'Notification',
            transport: 'beacon',
            nonInteraction: true
        });
        dataLayer.push({
            'event': 'generic.theme.event',
            eventCategory: 'custom_value',
            eventAction: 'Show',
            eventLabel: 'Notification'
        });
    }
}

function cookiesShowHideNotificationForGa() {
    window.ga('send', 'event', 'Cookies', 'Show', 'Notification', {nonInteraction: true});
    window.ga('send', 'event', 'Cookies', 'Hide', 'Notification');
}

function checkCookieConsent() {
    // if (sessionStorage.getItem('cookie_consent') == null) {
    //     window.setTimeout(cookiePopup, 3000);
    // }

    if (getCookie('cookie_consent') == "") {
        window.setTimeout(cookiePopup, 500);
    }

}

function setSessionExpiration() {
    //sessionStorage.setItem('cookie_consent', 'accepted');
    document.cookie = "cookie_consent=accepted;expires="+new Date(new Date().getTime()+1000*60*60*24*365).toGMTString()+";"
}


function cookiePopup() {
    document.querySelector('.motion-cookies').classList.add('slidein-up');
}

document.querySelector('#motion-cookies-btn').addEventListener('click', function () {
    setSessionExpiration();
    document.querySelector('#motion-cookies-notice').classList.remove('slidein-up');
});

/* IE browser and Cookie Notifications */
function siteNotificationChecks() {
    if (checkOldIE()) {
        oldIEPopup();
    } else if (checkCookieEnabled()) {
        checkCookieConsent();
    } else {
        cookiesDisabledPopup();
    }
}

function checkOldIE() {
    var browser = navigator.userAgent;
    var isOldIE = /MSIE|Trident|Edge|Edg/.test(browser);
    return isOldIE;
}

function oldIEPopup() {
    document.querySelector('#motion-browser-notice').classList.add('slidein-up');
}

function cookiesDisabledPopup() {
    document.querySelector('#motion-cookies-disabled-notice').classList.add('slidein-up');
}

function checkEdge() {
    var browser = navigator.userAgent;
    var isEdge = /Edg/.test(browser);
    return isEdge;
}

function checkCookieEnabled() {
    var cookieEnabled = navigator.cookieEnabled;
    if (checkEdge()) {
        cookieEnabled = checkCookieEnabledEdge();
    }
    return cookieEnabled;
}

function checkCookieEnabledEdge() {
    document.cookie = "testcookie";
    var cookieEnabled = document.cookie.indexOf("testcookie") !== -1;
    return (cookieEnabled);
}

/* Add click event for oldIE pop close to check if cookies are enabled to trigger any further notification if required */
document.querySelector('#motion-browser-notice-btn').addEventListener('click', function () {
    document.querySelector('#motion-browser-notice').classList.remove('slidein-up');
    if (checkCookieEnabled()) {
        /* display cookie policy */
        checkCookieConsent();
    } else {
        cookiesDisabledPopup();
    }
});

/* Add click event for Cookies disabled close to check if cookies are enabled to trigger any further notification if required */
document.querySelector('#motion-cookies-disabled-notice-btn').addEventListener('click', function () {
    document.querySelector('#motion-cookies-disabled-notice').classList.remove('slidein-up');
});

siteNotificationChecks();

window.addEventListener('beforeunload', function() {
    // cookiesShowNotificationForGa();
});
