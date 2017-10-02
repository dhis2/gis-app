import * as types from '../constants/actionTypes';

const layerEdit = (state = null, action) => {

    switch (action.type) {

        case types.OVERLAY_EDIT:
            delete action.payload.img;
            return action.payload;

        case types.OVERLAY_CANCEL:
            return null;

        case types.LAYER_EDIT_PROGRAM_SET:
            return {
                ...state,
                program: {
                    ...action.program,
                },
                programStage: null,
                styleDataElement: null,
            };

        case types.LAYER_EDIT_PROGRAM_STAGE_SET:
            return {
                ...state,
                programStage: {
                    ...action.programStage,
                },
                styleDataElement: null,
            };

        case types.LAYER_EDIT_STYLE_DATA_ELEMENT_SET:
            return {
                ...state,
                styleDataElement: action.dataElement,
            };

        // Set options to data element option set
        case types.LAYER_EDIT_STYLE_DATA_ELEMENT_OPTIONS_SET:
            return {
                ...state,
                styleDataElement: {
                    ...state.styleDataElement,
                    optionSet: {
                        ...state.styleDataElement.optionSet,
                        options: action.options,
                    },
                },
            };

            return state;

        case types.LAYER_EDIT_EVENT_POINT_RADIUS_SET:
            return {
                ...state,
                eventPointRadius: action.radius,
            };

        case types.LAYER_EDIT_EVENT_POINT_COLOR_SET:
            return {
                ...state,
                eventPointColor: action.color,
            };

        case types.LAYER_EDIT_ORGANISATION_UNIT_GROUP_SET:
            return {
                ...state,
                organisationUnitGroupSet: {
                    ...action.organisationUnitGroupSet,
                },
            };

        case types.LAYER_EDIT_ORGANISATIOM_UNIT_TOGGLE:
            if (state.rows) {
                const items = state.rows.filter(r => r.dimension === 'ou')[0];

                console.log('reducer items', items);

            } else {
                return {
                    ...state,
                    rows: [{
                        dimension: 'ou',
                        items: [action.orgUnit]
                    }]
                }
            }



            // console.log('action', action.orgUnit, state.rows);


            return state;


        default:
            return state;

    }
};

export default layerEdit;