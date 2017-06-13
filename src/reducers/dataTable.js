const dataTable = (state = null, action) => {

    switch (action.type) {

        case 'DATA_TABLE_OPEN':
            return action.id;

        case 'DATA_TABLE_CLOSE':
            return null;

        case 'DATA_TABLE_TOGGLE':
            return state ? null : action.id;

        default:
            return state;

    }
};

export default dataTable;