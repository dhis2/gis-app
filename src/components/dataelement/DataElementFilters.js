import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Button from 'd2-ui/lib/button/Button';
import DataElementFilterRow from './DataElementFilterRow';

// https://react.rocks/example/react-redux-test
// https://docs.dhis2.org/master/en/developer/html/webapi_metadata_object_filter.html

const styles = {
    container: {
        marginTop: 24,
    },
    button: {
        marginTop: 16,
    }
};

class DataElementFilters extends Component {

    static contextTypes = {
        d2: PropTypes.object,
    };

    render() {
        const d2 = this.context.d2;
        const i18n = d2.i18n.getTranslation.bind(d2.i18n);
        const {
            filters,
            dataElements,
            addDataElementFilter,
            removeDataElementFilter,
            changeDataElementFilter,
        } = this.props;

        return (
            <div style={styles.container}>
                {filters.map((item, index) => (
                    <DataElementFilterRow
                        key={index}
                        index={index}
                        dataElements={dataElements}
                        onChange={changeDataElementFilter}
                        onRemove={removeDataElementFilter}
                        {...item}
                    />
                ))}

                <Button
                    raised color='accent'
                    onClick={() => addDataElementFilter()}
                    style={styles.button}
                >{i18n('add_filter')}</Button>
            </div>
        )
    }

}

export default DataElementFilters;
