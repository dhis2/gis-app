import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import ProgramSelect from '../program/ProgramSelect';
import { loadPrograms } from '../../actions/programs';
import { setProgram } from '../../actions/layerEdit';

const styles = {
    container: {
        flex: '100%',
        display: 'flex',
        flexFlow: 'row wrap',
        justifyContent: 'space-between',
        alignContent: 'flex-start',
    },
};

class ThematicProgramIndicatorSelect extends Component {

    static propTypes = {
        program: PropTypes.object,
        programs: PropTypes.array,
    };

    componentDidMount() {
        const { programs, loadPrograms } = this.props;

        if (!programs) {
            loadPrograms();
        }
    }

    render() {
        const {
            program,
            programs,
            setProgram,
            style,
        } = this.props;

        console.log('program inndicator select');

        return (
            <div style={styles.container}>
                {programs &&
                    <ProgramSelect
                        program={program}
                        programs={programs}
                        setProgram={setProgram}
                        style={style}
                    />
                }
            </div>
        );
    }
}

export default connect(
    ({ layerEdit, programs }) => ({
        program: layerEdit.program,
        programs,
    }),
    { loadPrograms, setProgram  }
)(ThematicProgramIndicatorSelect);
