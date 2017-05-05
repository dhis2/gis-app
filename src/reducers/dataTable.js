const dataTable = (state = null, action) => {

    switch (action.type) {

        case 'DATA_TABLE_OPEN_REQUESTED':
            return action.id;

        case 'DATA_TABLE_CLOSE_REQUESTED':
            return null;

        default:
            return state;

    }
};

export default dataTable;