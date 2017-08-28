import React from 'react';
import Option from './Option';

const colors = ['red', 'blue', 'orange', 'purple', 'green'];

const OptionSet = (props) => {
    return (
        <div style={{ marginTop: 20 }}>
            {props.options.map((option, index) => (
                <Option
                    key={option.code}
                    color={colors[index]}
                    {...option}
                />
            ))}
        </div>
    );
};

export default OptionSet;
