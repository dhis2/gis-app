import React from 'react';
import SelectField from '../d2-ui/SelectField';

const ProgramStageSelect = (props) => (
    <SelectField
        label='Stage' // TODO: i18n
        {...props}
    />
);

export default ProgramStageSelect;
