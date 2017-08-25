import React from 'react';
import Option from './Option';

const OptionSet = (props) => {
    // console.log(props);

    return (
        <div>
            {props.options.map(option => (
                <Option
                    key={option.code}
                    {...option}
                />
            ))}
        </div>
    );
};

export default OptionSet;
