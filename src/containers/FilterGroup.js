import { connect } from 'react-redux';
import FilterGroup from '../components/filter/FilterGroup';
import { addFilter, removeFilter, changeFilter } from '../actions/layerEdit';

export default connect(
    null,
    { addFilter, removeFilter, changeFilter }
)(FilterGroup);
