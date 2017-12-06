import React, { Component } from 'react';
import PropTypes from 'prop-types';




class EarthEngineDialog extends Component {

    static contextTypes = {
        d2: PropTypes.object,
    };

    render() {
        return (
            <div>EarthEngine</div>
        );
    }

}


export default EarthEngineDialog;