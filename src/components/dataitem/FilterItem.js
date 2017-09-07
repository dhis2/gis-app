import React, { Component } from 'react';
import DataItemSelect from './DataItemSelect';

// https://react.rocks/example/react-redux-test

const style = {
    marginTop: 24,
    padding: 8,
    border: '1px solid #ddd'
};

class FilterItem extends Component {

    constructor(props, context) {
        super(props, context)

        this.state = {
            dataItem: null
        };
    }

    onDataItemChange(dataItem) {
        console.log('onDataItemChange', dataItem)

        this.setState({ dataItem });
    }

    render() {
        const { dataItems } = this.props;
        const { dataItem } = this.state;

        return (
            <div style={style}>
                {dataItems ?
                    <DataItemSelect
                        label='Select data item'
                        items={dataItems}
                        value={dataItem ? dataItem.id : null}
                        onChange={value => this.onDataItemChange(value)}
                    />
                : null}
                {dataItem ? <div>{dataItem.valueType}</div> : null}
            </div>
        )

    }

}

export default FilterItem;
