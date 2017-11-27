import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import i18next from 'i18next';
import sortBy from 'lodash/fp/sortBy';
import Button from 'd2-ui/lib/button/Button';
import FilterRow from './FilterRow';
import { loadProgramTrackedEntityAttributes, loadProgramStageDataElements } from '../../actions/programs';
import { addFilter, removeFilter, changeFilter } from '../../actions/layerEdit';

const styles = {
    container: {
        width: '100%',
        padding: 12,
    },
    button: {
        marginTop: 8,
    },
    note: {
        padding: 12,
    },
};

class FilterGroup extends Component {

    componentDidUpdate() {
        const {
            program,
            programStage,
            programAttributes,
            dataElements,
            loadProgramTrackedEntityAttributes,
            loadProgramStageDataElements
        } = this.props;

        if (program && programAttributes[program.id]) {
            loadProgramTrackedEntityAttributes(program.id);
        }

        if (programStage && !dataElements[programStage.id]) {
            loadProgramStageDataElements(programStage.id);
        }
    }

    render() {
        const {
            filters = [],
            program,
            programStage,
            programAttributes,
            dataElements,
            addFilter,
            removeFilter,
            changeFilter,
        } = this.props;

        if (!programStage) {
            return (
                <div style={styles.note}>
                    {i18next.t('Filtering is available after selecting a program stage.')}
                </div>
            );
        }

        // Merge data elements and program attributes, filter out items not supported, and sort the result
        const dataItems = sortBy('name', [ ...programAttributes[program.id] || [], ...dataElements[programStage.id] || [] ]
            .filter(item => !['FILE_RESOURCE', 'ORGANISATION_UNIT', 'COORDINATE'].includes(item.valueType))
        );

        return (
            <div style={styles.container}>
                {filters.map((item, index) => (
                    <FilterRow
                        key={index}
                        index={index}
                        dataItems={dataItems}
                        onChange={changeFilter}
                        onRemove={removeFilter}
                        {...item}
                    />
                ))}
                <Button
                    raised color='accent'
                    onClick={() => addFilter()}
                    style={styles.button}
                >{i18next.t('Add filter')}</Button>
            </div>
        );
    }

}

export default connect(
    (state) => {
        return {
            programAttributes: state.programTrackedEntityAttributes,
            dataElements: state.programStageDataElements,
        };
    },
    { addFilter, removeFilter, changeFilter, loadProgramTrackedEntityAttributes, loadProgramStageDataElements }
)(FilterGroup);



