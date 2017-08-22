import React, {Component} from 'react';
// import PropTypes from 'prop-types';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';

class ProgramSelect extends Component {
    state = {
        value: null,
    };

    handleChange = (event, index, value) => this.setState({value});

    render() {
        const programs = this.props.programs;
        console.log('#', programs);

        return (
            <SelectField
                floatingLabelText="Program"
                onChange={this.handleChange}
                value={this.state.value}
            >
                {programs.map((program, index) => (
                    <MenuItem
                        key={program.id}
                        value={program.id}
                        primaryText={program.name}
                    />
                ))}
            </SelectField>
        );
    }
};

export default ProgramSelect;
