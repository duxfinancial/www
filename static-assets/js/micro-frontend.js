function addMFScripts(serverPath, filename, timeStamp) {
    var script = document.createElement('script');

    script.src = serverPath + filename + '?t=' + timeStamp;
    script.defer = true;

    document.body.appendChild(script);
}

function addMFStyles(serverPath, filename, timeStamp) {
    var link = document.createElement('link');
    link.href = serverPath + filename + '?t=' + timeStamp;
    link.type = 'text/css';
    link.rel = 'stylesheet';
    document.body.appendChild(link);
}

function addMircoFrontend(envPath, appContext, appName, cssFiles, jsFiles) {
    var timeStamp = (new Date()).getTime();
    var serverPath = envPath + '/'
        + (appContext ? appContext + '/' : '')
        + (appName ? appName + '/' : '')

    // Add styling
    for (var index = 0; index < cssFiles.length; index++) {
        addMFStyles(serverPath, cssFiles[index], timeStamp);
    }

    // Add scripts
    for (var index = 0; index < jsFiles.length; index++) {
        addMFScripts(serverPath, jsFiles[index], timeStamp);
    }
}
