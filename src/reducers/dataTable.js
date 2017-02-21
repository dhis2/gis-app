const defaultState = {
    layerId: null,
    data: [],
    open: false,
};


const dataTable = (state = defaultState, action) => {

    switch (action.type) {

        case 'DATA_TABLE_OPEN_REQUESTED':
            return {
                ...state,
                open: true,
                data: action.data, // TODO: Should the data be copied?
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