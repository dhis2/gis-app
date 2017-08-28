const editOverlay = (state = null, {type, payload}) => {

    switch (type) {

        case 'OVERLAY_EDIT':
            delete payload.img;
            return payload;

        case 'OVERLAY_CANCEL':
            return null;

        default:
            return state;

    }
};

export default editOverlay;