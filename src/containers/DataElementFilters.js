import { connect } from 'react-redux';
import DataElementFilters from '../components/dataelement/DataElementFilters';
import { addDataElementFilter, removeDataElementFilter, changeDataElementFilter } from '../actions/layerEdit';

export default connect(
    null,
    { addDataElementFilter, removeDataElementFilter, changeDataElementFilter }
)(DataElementFilters);