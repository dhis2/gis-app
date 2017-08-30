import React, { Component } from 'react';
import ColorPicker from './ColorPicker';

const styles = {
    label: {
        display: 'inline-block',
        height: 24,
        lineHeight: '24px',
        verticalAlign: 'top',
    }
};

class OptionStyle extends Component {

    /*
    constructor(props, context) {
        super(props, context);

        this.state = {
            color: props.color || '#333333',
        };
    }
    */

    // onChange={color => this.setState({ color })}

    render() {
        const { code, name, color } = this.props;

        // console.log(this.props);

        return (
            <div>
                <ColorPicker color={color} onChange={newColor => onChange(code, newColor)}/>
                <span style={styles.label}>{name}</span>
            </div>
        );
    }
}

export default OptionStyle;
