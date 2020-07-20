function getSign(url, requestParams, signingKey) {
    var signString = signingKey;
    var urlParams = parseQueryString(url);
    var requestBody = sortObject(mergeObject(urlParams, requestParams));
    for (var i in requestBody) {
        if (requestBody[i] != null && requestBody[i] !== undefined && requestBody[i] !== "") {
            signString += i + requestBody[i]
        }
    }
    signString = signString + signingKey;
    return md5(signString).toUpperCase()
}

function parseQueryString(url) {
    var urlReg = /^[^?]+\?([\w\W]+)$/,
        paramReg = /([^&=]+)=([\w\W]*?)(&|$|#)/g,
        urlArray = urlReg.exec(url),
        result = {};
    if (urlArray && urlArray[1]) {
        var paramString = urlArray[1],
            paramResult;
        while ((paramResult = paramReg.exec(paramString)) != null) {
            result[paramResult[1]] = paramResult[2]
        }
    }
    return result
}

function sortObject(object) {
    var objectKeys = Object.keys(object).sort();
    var result = {};
    for (var i in objectKeys) {
        result[objectKeys[i]] = object[objectKeys[i]]
    }
    return result
}

function mergeObject(objectOne, objectTwo) {
    if (objectTwo != null) {
        for (var key in objectTwo) {
            objectOne[key] = objectTwo[key]
        }
    }
    return objectOne
};

export {
    getSign,
    parseQueryString,
    sortObject,
    mergeObject
};