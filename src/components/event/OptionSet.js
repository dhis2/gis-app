import React from 'react';
import Option from './Option';

const colors = ['red', 'blue', 'orange', 'purple', 'green'];

const OptionSet = ({ options, onChange }) => {
    return (
        <div style={{ marginTop: 20 }}>
            {options.map((option, index) => (
                <Option
                    key={option.code}
                    color={colors[index]}
                    {...option}
                    onChange={onChange}
                />
            ))}
        </div>
    );
};

export default OptionSet;
