import React from 'react';
import BooleanStyle from './BooleanStyle';
import OptionSetStyle from '../../containers/OptionSetStyle';
import Classification from '../../containers/Classification';

const style = {
    marginTop: -24,
};

const DataElementStyle = ({ method, classes, colorScale, id, valueType, name, optionSet }) => (
    <div style={style}>
        {valueType === 'INTEGER' ?
            <Classification
                method={method}
                classes={classes}
                colorScale={colorScale}
            />
        : null}

        {valueType === 'BOOLEAN' ?
            <BooleanStyle />
        : null}

        {optionSet ?
            <OptionSetStyle
                {...optionSet}
            />
        : null}
    </div>
);

export default DataElementStyle;
