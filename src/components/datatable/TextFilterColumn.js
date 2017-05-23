import React, { Component } from 'react';
// import PropTypes from 'prop-types';
import { Column } from 'react-virtualized';

class TextFilterColumn extend Column {
    console.log('TextFilterColumn', props);

    return (
        <Column
            {...props}
            label='ABC'
        />
    );
};

export default TextFilterColumn;
