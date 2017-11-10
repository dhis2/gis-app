import React, { Component } from 'react';
import DataItemSelect from '../dataitem/DataItemSelect';
import FilterSelect from '../../containers/FilterSelect';
import IconButton from 'material-ui/IconButton';
import RemoveIcon from 'material-ui/svg-icons/navigation/close';

// https://react.rocks/example/react-redux-test

const styles = {
    container: {
        height: 64,
        marginBottom: 8,
        padding: '0 56px 0 8px',
        background: '#f4f4f4',
        position: 'relative',
        clear: 'both',
    },
    select: {
        top: -8,
        marginRight: 24,
        float: 'left',
        width: 'calc((100% - 48px) / 7 * 3)',
    },
    removeBtn: {
        position: 'absolute',
        top: 8,
        right: 8,
    }
};

class FilterRow extends Component {

    onChange(dimension, filter) {
        const { index, dataElements, onChange } = this.props;
        const name = dataElements.filter(d => d.id === dimension)[0].name;

        if (dimension !== this.props.dimension) { // New dimension
            onChange(index, {
                dimension,
                name,
                filter: null,
            });
        } else {
            onChange(index, {
                dimension,
                name,
                filter,
            });
        }
    }

    render() {
        const { dataElements, dimension, filter, index, onRemove } = this.props;
        let dataElement;

        if (dataElements && dimension) {
            dataElement = dataElements.filter(d => d.id === dimension)[0];
        }

        return (
            <div style={styles.container}>
                {dataElements ?
                    <DataItemSelect
                        label='Data item'
                        items={dataElements}
                        value={dataElement ? dataElement.id : null}
                        onChange={dimension => this.onChange(dimension.id, filter)}
                        style={styles.select}
                    />
                : null}

                {dataElement ?
                    <FilterSelect
                        {...dataElement}
                        filter={filter}
                        onChange={filter => this.onChange(dimension, filter)}
                    />
                : null}
                <IconButton
                    tooltip="Remove filter"
                    style={styles.removeBtn}
                    onClick={() => onRemove(index)}
                >
                    <RemoveIcon/>
                </IconButton>
            </div>
        )

    }

}

export default FilterRow;
