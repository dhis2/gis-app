import React, { Component } from 'react';
import PropTypes from 'prop-types';
import i18next from 'i18next';
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

    render() {
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
                >{i18next.t('Add filter')}</Button>
            </div>
        )
    }

}

export default DataElementFilters;
