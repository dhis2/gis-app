import React from 'react';
import PropTypes from 'prop-types';
import MuiTextField from 'material-ui/TextField';

const TextField = ({ label, type, value, onChange, style }) => (
    <MuiTextField
        floatingLabelText={label}
        type={type}
        value={typeof value !== 'undefined' ? value : ''}
        onChange={(event, value) => onChange(value)}
        style={style}
    />
);

TextField.propTypes = {
    label: PropTypes.string.isRequired,
    type: PropTypes.oneOf(['text', 'number']),
    value: PropTypes.string,
    onChange: PropTypes.func.isRequired,
    style: PropTypes.object,
};

export default TextField;
