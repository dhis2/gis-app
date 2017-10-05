import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Button from 'd2-ui/lib/button/Button';
import FilterItem from './FilterItem';

// https://react.rocks/example/react-redux-test

const styles = {
    container: {
        marginTop: 16,
    },
    button: {
        marginTop: 24,
    }
};

class DataItemFilters extends Component {

    static contextTypes = {
        d2: PropTypes.object,
    };

    constructor(props, context) {
        super(props, context);
        this.state = {
            newFilters: [],
        };
    }

    addFilter() {
        const newFilters = this.state.newFilters;

        this.setState({
            newFilters: [
                ...newFilters,
                {
                    new: true,
                    index: newFilters.length,
                },
            ],
        });
    }

    removeFilter(index) {
        // TODO
    }

    removeNewFilter(index) {
        this.setState({
            newFilters: this.state.newFilters.filter((filter, i) => index !== i),
        });
    }

    render() {
        const { filters, dataItems } = this.props;
        const { newFilters } = this.state;

        const d2 = this.context.d2;
        const i18n = d2.i18n.getTranslation.bind(d2.i18n);

        return (
            <div style={styles.container}>
                {filters.map((item, index) => (
                    <FilterItem
                        key={index}
                        dataItems={dataItems}
                        {...item}
                        onChange={() => console.log('filter changed')}
                        onRemove={() => console.log('remove filter', index)}
                    />
                ))}

                {newFilters.length ?
                    newFilters.map((item, index) => (
                        <FilterItem
                            key={index}
                            dataItems={dataItems}
                            {...item}
                            onChange={() => console.log('new filter changed')}
                            onRemove={() => this.removeNewFilter(index)}
                        />
                    ))
                : null}

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
