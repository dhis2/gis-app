const eventLayerTest = {
    type: 'event',
    preview: true,
    title: 'Events Preview',
    opacity: 0.95,
    program: {
        id: "eBAyeGv0exc",
        name: "Inpatient morbidity and mortality",
    },
};

// const layerEdit = (state = eventLayerTest, action) => {
const layerEdit = (state = null, action) => {

    switch (action.type) {

        case 'OVERLAY_EDIT':
            delete action.payload.img;
            return action.payload;

        case 'OVERLAY_CANCEL':
            return null;

        case 'LAYER_EDIT_PROGRAM_SET':
            return {
                ...state,
                program: {
                    ...action.program,
                },
                programStage: null,
                styleDataElement: null,
            };

        case 'LAYER_EDIT_PROGRAM_STAGE_SET':
            return {
                ...state,
                programStage: {
                    ...action.programStage,
                },
                styleDataElement: null,
            };

        case 'LAYER_EDIT_STYLE_DATA_ELEMENT_SET':
            return {
                ...state,
                styleDataElement: action.dataElement,
            };

        default:
            return state;

    }
};

export default layerEdit;