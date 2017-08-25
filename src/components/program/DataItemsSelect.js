import React, { Component } from 'react';

import SelectField from '../d2-ui/SelectField';

const DataItemsSelect = (props) => (
    <SelectField
        label='Style by data item' // TODO: i18n
        {...props}
    />
);

export default DataItemsSelect;
