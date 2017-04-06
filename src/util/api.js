const headers = {
    'Authorization': 'Basic ' + btoa('admin:district'), // TODO
};

export function apiFetch(url, method, body) {
    const options = {
        headers: {
            ...headers,
        },
    };

    if (method && body) {
        options.method = method;
        options.headers['Content-Type'] = 'application/json';
        options.body = JSON.stringify(body);
    }

    return fetch(encodeURI(gis.init.analyticsPath + url), options); // TODO
}