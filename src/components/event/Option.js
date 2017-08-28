import React, { Component } from 'react';
import Checkbox from 'material-ui/Checkbox';
import Visibility from 'material-ui/svg-icons/action/visibility';
import VisibilityOff from 'material-ui/svg-icons/action/visibility-off';
import ColorPicker from './ColorPicker';

const styles = {
    checkbox: {
        width: 32,
        float: 'left',
        clear: 'both',
    },
    color: {
        width: 32,
        height: 24,
        border: '1px solid #555',
        background: 'yellow',
        display: 'inline-block',
        marginRight: 12,
    },
    label: {
        display: 'inline-block',
        height: 24,
        lineHeight: '24px',
        verticalAlign: 'top',
    }
};

class Option extends Component {

    constructor(props, context) {
        super(props, context);

        this.state = {
            color: props.color || '#333333',
        };
    }

    render() {
        return (
            <div>
                <Checkbox
                    checked={true}
                    checkedIcon={<Visibility />}
                    uncheckedIcon={<VisibilityOff />}
                    style={styles.checkbox}
                />
                <ColorPicker color={this.state.color} onChange={color => this.setState({ color })}/>
                <span style={styles.label}>{this.props.name}</span>
            </div>
        );
    }
};

export default Option;
