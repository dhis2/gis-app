const editOverlay = (state = null, {type, payload}) => {

    switch (type) {

        case 'OVERLAY_EDIT':
            delete payload.img;
            return payload;

        /*
        case 'OVERLAY_UPDATE':
            //console.log('##', 'OVERLAY_UPDATE');


            return state;
        */

        default:
            return state;

    }
};

export default editOverlay;