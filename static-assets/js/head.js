// (function () {
//     if (i$.isIE) {
//         document.createElement('article');
//         document.createElement('aside');
//         document.createElement('footer');
//         document.createElement('header');
//         document.createElement('hgroup');
//         document.createElement('nav');
//         document.createElement('section');
//     }
//     if (i$.isIE == 7) {
//         document.getElementsByTagName('html')[0].className += ' wptheme_ie7';
//     }
//     if (i$.isIE == 8) {
//         document.getElementsByTagName('html')[0].className += ' wptheme_ie8';
//     }
//     if (i$.isIE == 9) {
//         document.getElementsByTagName('html')[0].className += ' wptheme_ie9';
//     }
//     if (i$.isIE == 10) {
//         document.getElementsByTagName('html')[0].className += ' wptheme_ie10';
//     }
//     if (i$.isIE == 11) {
//         document.getElementsByTagName('html')[0].className += ' wptheme_ie11';
//     }
// })();

function getDomain() {
    if (window.contentEndpoint) {
        return 'https://' + window.contentEndpoint;
    } else {
        return undefined;
    }
}

function generateUrl(name, path) {
    var names = document.getElementsByName(name);
    for (var iterator = 0; iterator < names.length; iterator++) {
        names[iterator].src = getDomain() + '/' + path;
    }
}

function encodeSpace(value) {
    value = value ? value.trim() : '';
    return value.replace(/\s/g, '%20');
}


function logoutPortalUser(logoutUrl) {

    if (isIE()) {
        invalidateClientSession(logoutUrl);
    } else {
        getGenexSurveyURL(window.firstName, window.surname, window.email, window.cell, 'Portfolio', 'Channel',
            'using your Momentum portfolio', 'your Momentum portfolio')
            .then(function(surveyUrl) {
                if (surveyUrl) {
                    document.getElementById('genex_survey_iframe_url').src = "https://" + surveyUrl;
                    showSurveyPromptModal(false);
                }
                else {
                    invalidateClientSession(logoutUrl);
                }
            })
            .catch(function(error) {
                console.error('An error occurred while getting survey URL:', error);
                invalidateClientSession(logoutUrl);
            });
    }
}



function invalidateClientSession(logoutUrl) {
    sessionStorage.clear();
    deleteCookie('CIF_TOKEN');
    deleteCookie('USER_ROLES');
    deleteCookie('USER_GUID');
    deleteCookie('CLIENT_CIF_TOKEN');
    deleteCookie('CLIENT_USER_ROLES');
    deleteCookie('CLIENT_USER_GUID');
    deleteCookie('ACCESS_TOKEN');
    deleteCookie('LtpaToken2');
    deleteCookie('JSESSIONID');
    deleteCookie('USER_SESSION');

    if (logoutUrl) {
        window.location.href = logoutUrl;
    }
}

function setCookie(c_name, value, exdays) {
    var exdate = new Date();
    exdate.setDate(exdate.getDate() + exdays);
    var c_value = escape(value) + ((exdays == null) ? '' : '; expires=' + exdate.toUTCString());
    document.cookie = c_name + '=' + c_value + ';path=/';
}

function deleteCookie(c_name) {
    document.cookie = c_name + '=;expires=' + new Date(0).toUTCString();
}

function getCookie(cname) {
    var name = cname + '=';
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) === ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) === 0) {
            return c.substring(name.length, c.length);
        }
    }
    return '';
}

// (function() {
//     var currentEnvironment = window.currentEnvironment;
//     window.recaptchaSiteKey = window.recaptchaSiteKey = '6Le97FcUAAAAAAjCq5T9secxQfDMKoXet0JEhuN8';

//     if (currentEnvironment !== 'prod') {
//         window.recaptchaSiteKey = '6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI';
//     }
// })(); 

(function() {
    var observer = new MutationObserver(function() {
        if (typeof window.currentEnvironment !== 'undefined') {
            // currentEnvironment is set, now run your function
            var currentEnvironment = window.currentEnvironment;
            window.recaptchaSiteKey = '6Le97FcUAAAAAAjCq5T9secxQfDMKoXet0JEhuN8';

            if (currentEnvironment !== 'prod') {
                window.recaptchaSiteKey = '6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI';
            }
            observer.disconnect(); // Stop observing once the variable is set
        }
    });

    // Start observing the document or window for changes
    observer.observe(document, { childList: true, subtree: true });
})();


// start of testing of chatbot
(function() {
    let currentUrl = window.location.href;
    if(currentUrl.includes('personal/medical-aid')){
 

        var embedScript = document.createElement('script');
        embedScript.id = 'ze-snippet';
        // embedScript.async = true;
        embedScript.src = 'https://static.zdassets.com/ekr/snippet.js?key=500d53bf-93c7-43c8-b715-60fc13263264';
        document.head.appendChild(embedScript);   
    }
})();

