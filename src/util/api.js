export function apiFetch(url, method, body) {
    const options = {
        headers: {
            ...gis.init.defaultHeaders,
        }
    };

    if (!gis.init.defaultHeaders['Authorization']) {
        options.credentials = 'include';
    }

    if (method && body) {
        options.method = method;
        options.headers['Content-Type'] = 'application/json';
        options.body = JSON.stringify(body);
    }

    return fetch(encodeURI(gis.init.apiPath + url), options)
        .then(res => res.json())
        .catch(error => console.log('Error: ', error)); // TODO: Better error handling
}

export function urlFetch(url, method, body) {
    const options = {
        headers: {
            ...gis.init.defaultHeaders,
        }
    };

    if (!gis.init.defaultHeaders['Authorization']) {
        options.credentials = 'include';
    }

    if (method && body) {
        options.method = method;
        options.headers['Content-Type'] = 'application/json';
        options.body = JSON.stringify(body);
    }

    return fetch(encodeURI(url), options)
        .then(res => res.json())
        .catch(error => console.log('Error: ', error)); // TODO: Better error handling
}
