import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import i18next from 'i18next';
import Button from 'd2-ui/lib/button/Button';
import FilterRow from './FilterRow';
import { addFilter, removeFilter, changeFilter } from '../../actions/layerEdit';
import { loadProgramTrackedEntityAttributes, loadProgramStageDataElements } from '../../actions/programs';

const styles = {
    container: {
        width: '100%',
        padding: 12,
    },
    button: {
        marginTop: 8,
    }
};

class FilterGroup extends Component {

    // https://daveceddia.com/where-fetch-data-componentwillmount-vs-componentdidmount/




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

        return (
            (programStage ?
                <div style={styles.container}>
                    {filters.map((item, index) => (
                        <FilterRow
                            key={index}
                            index={index}
                            dataElements={dataElements}
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
            :
                <div>
                    {i18next.t('Filtering is available after selecting a program stage.')}
                </div>
            )
        );
    }

}


/*
export const FilterGroup = ({
    filters = [],
    program,
    programStage,
    programAttributes,
    dataElements,
    addFilter,
    removeFilter,
    changeFilter,
    loadProgramTrackedEntityAttributes,
    loadProgramStageDataElements,
}) => {
    console.log('FilterGroup', program && program.id, programStage && programStage.id, programAttributes, dataElements );

    // TODO: Make sure it only load once - move out of render function?
    if (program && !dataElements) {
        loadProgramTrackedEntityAttributes(program.id);
    }

    // TODO: Make sure it only load once - move out of render function?
    if (programStage && !programAttributes) {
        loadProgramStageDataElements(programStage.id);
    }
};
*/

export default connect(
    (state) => {


        console.log('connect');

        return {
            filters: (state.layerEdit.columns || []).filter(c => c.filter !== undefined),
                programAttributes: state.layerEdit.program && state.programTrackedEntityAttributes[state.layerEdit.program.id],
            dataElements: state.layerEdit.programStage && state.programStageDataElements[state.layerEdit.programStage.id],
            program: state.layerEdit.program,
            programStage: state.layerEdit.programStage,
        };
    },
    { addFilter, removeFilter, changeFilter, loadProgramTrackedEntityAttributes, loadProgramStageDataElements }
)(FilterGroup);



