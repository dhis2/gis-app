import React, { Component } from 'react';
import i18next from 'i18next';
import { connect } from 'react-redux';
import sortBy from 'lodash/fp/sortBy';
import SelectField from 'd2-ui/lib/select-field/SelectField';
import { loadProgramTrackedEntityAttributes, loadProgramStageDataElements } from '../../actions/programs';

export class DataItemSelect extends Component {

    componentDidMount() {
        const {
            program,
            programStage,
            programAttributes,
            dataElements,
            loadProgramTrackedEntityAttributes,
            loadProgramStageDataElements
        } = this.props;

        if (program && !programAttributes[program.id]) {
            loadProgramTrackedEntityAttributes(program.id);
        }

        if (programStage && !dataElements[programStage.id]) {
            loadProgramStageDataElements(programStage.id);
        }
    }

    render() {
        const {
            label,
            value,
            program,
            programStage,
            programAttributes,
            dataElements,
            onChange,
            style,
        } = this.props;


        if (!program && !programStage) {
            return null;
        }
        // Merge data elements and program attributes, filter out items not supported, and sort the result
        const dataItems = sortBy('name', [ ...programAttributes[program.id] || [], ...dataElements[programStage.id] || [] ]
            .filter(item => !['FILE_RESOURCE', 'ORGANISATION_UNIT', 'COORDINATE'].includes(item.valueType))
        );

        return (
            <SelectField
                label={label || i18next.t('Data item')}
                items={dataItems}
                value={value}
                onChange={onChange}
                style={style}
            />
        );
    }
}


export default connect(
    (state) => ({
        programAttributes: state.programTrackedEntityAttributes,
        dataElements: state.programStageDataElements,
    }),
    { loadProgramTrackedEntityAttributes, loadProgramStageDataElements }
)(DataItemSelect);
