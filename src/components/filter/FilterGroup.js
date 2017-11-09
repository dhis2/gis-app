import React, { Component } from 'react';
import PropTypes from 'prop-types';
import i18next from 'i18next';
import Button from 'd2-ui/lib/button/Button';
import FilterRow from './FilterRow';

const styles = {
    button: {
        marginTop: 8,
    }
};

class FilterGroup extends Component {

    render() {
        const {
            filters,
            dataElements,
            addFilter,
            removeFilter,
            changeFilter,
        } = this.props;

        return (
            <div>
                {filters.map((item, index) => (
                    <FilterRow
                        key={index}
                        index={index}
                        dataElements={dataElements}
                        onChange={changeFilter}
                        onRemove={removeFilter}
                        {...item}
                    />
                ))}

                <Button
                    raised color='accent'
                    onClick={() => addFilter()}
                    style={styles.button}
                >{i18next.t('Add filter')}</Button>
            </div>
        )
    }

}

export default FilterGroup;
