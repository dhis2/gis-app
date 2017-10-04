import React, { Component } from 'react';
import DataItemSelect from './DataItemSelect';
import DataItemOperator from './DataItemOperator';
import DataItemValue from './DataItemValue';
import IconButton from 'material-ui/IconButton';
import RemoveIcon from 'material-ui/svg-icons/navigation/close';

// https://react.rocks/example/react-redux-test

const styles = {
    container: {
        height: 64,
        marginTop: 24,
        padding: '0px 8px',
        background: '#f4f4f4',
    },
    removeBtn: {
        top: -16,
    }
};

class FilterItem extends Component {

    constructor(props, context) {
        super(props, context)

        /*
        console.log('props', props);

        this.state = {
            dataItem: null
        };
        */
    }

    onDataItemChange(dataItem) {
        // console.log('onDataItemChange', dataItem)

        // this.setState({ dataItem });
    }

    render() {
        const { dataItems, dimension, filter } = this.props;
        let dataItem;

        if (dataItems && dimension) {
            dataItem = dataItems.filter(d => d.id === dimension)[0];
        }

        // console.log('####', dataItem, this.props);

        return (
            <div style={styles.container}>
                {dataItems ?
                    <DataItemSelect
                        label='Data item'
                        items={dataItems}
                        value={dataItem ? dataItem.id : null}
                        onChange={value => this.onDataItemChange(value)}
                    />
                : null}

                {dataItem ?
                    <DataItemOperator
                        valueType={dataItem.valueType}
                    />
                : null}
                {dataItem ?
                    <DataItemValue />
                : null}
                <IconButton tooltip="Remove filter" style={styles.removeBtn}>
                    <RemoveIcon/>
                </IconButton>
            </div>
        )

    }

}

export default FilterItem;
