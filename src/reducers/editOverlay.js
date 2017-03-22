const editOverlay = (state = null, {type, payload}) => {

    switch (type) {

        case 'OVERLAY_EDIT':
            delete payload.img;
            return payload;

        default:
            return state;

    }
};

export default editOverlay;