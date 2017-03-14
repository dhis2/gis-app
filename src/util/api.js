const headers = {
    'Authorization': 'Basic ' + btoa('admin:district'), // TODO
};

export function apiFetch(url) {
    return fetch(encodeURI(gis.init.analyticsPath + url), { headers }); // TODO
}