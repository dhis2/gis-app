import { connect } from 'react-redux';
import DataItemFilters from '../components/dataitem/DataItemFilters';
import { addDataElementFilter, removeDataElementFilter, changeDataElementFilter } from '../actions/layerEdit';

export default connect(
    null,
    { addDataElementFilter, removeDataElementFilter, changeDataElementFilter }
)(DataItemFilters);