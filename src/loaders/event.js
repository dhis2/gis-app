
// TODO: How to share headers for all fetch requests?
const headers = {
    'Authorization': 'Basic ' + btoa('admin:district'),
};

// Load events for map display
const eventLoader = (layer, callback) =>  {

    console.log('eventLloader', layer);

};

export default eventLoader;