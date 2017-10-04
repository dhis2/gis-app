import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Button from 'd2-ui/lib/button/Button';
import FilterItem from './FilterItem';
import TextField from 'material-ui/TextField';

// https://react.rocks/example/react-redux-test


const styles = {
    button: {
        marginTop: 24,
    }
};

class DataItemFilters extends Component {

    static contextTypes = {
        d2: PropTypes.object,
    };

    addFilter() {
        console.log('Add filter');
    }

    render() {
        const {filters, dataItems} = this.props;

        const d2 = this.context.d2;
        const i18n = d2.i18n.getTranslation.bind(d2.i18n);

        return (
            <div>
                {filters.map((item, index) => (
                    <FilterItem
                        key={index}
                        dataItems={dataItems}
                        {...item}
                    />
                ))}

                <Button
                    raised color='accent'
                    onClick={() => this.addFilter()}
                    style={styles.button}
                >{i18n('add_filter')}</Button>
            </div>
        )
    }

}

export default DataItemFilters;
