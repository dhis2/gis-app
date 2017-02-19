const defaultState = {
    layerId: null,
    data: [],
    open: false,
};


const dataTable = (state = defaultState, action) => {

    switch (action.type) {

        case 'DATA_TABLE_OPEN_REQUESTED':
            console.log('DATA_TABLE_OPEN_REQUESTED', action.layer);

            return {
                ...state,
                open: true,
            };

        case 'DATA_TABLE_CLOSE_REQUESTED':
            return {
                ...state,
                open: false,
            };

        default:
            return state;

    }
};

export default dataTable;