import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import i18next from 'i18next';
import SelectField from 'd2-ui/lib/select-field/SelectField';
import { loadEarthEngineCollection } from '../../actions/earthEngine';

// Select collection (periods) for EarthEnigne layers
export class CollectionSelect extends Component {

    static propTypes = {
        collections: PropTypes.object,
        onChange: PropTypes.func.isRequired,
        style: PropTypes.object,
    };

    componentDidMount() {
        const { id, collections, loadEarthEngineCollection } = this.props;

        if (id && !collections[id]) {
            loadEarthEngineCollection(id);
        }
    }

    render() {
        const { id, collections, onChange, style } = this.props;

        if (!id && !collections[id]) {
            return null;
        }

        console.log('## collection', collections[id]);

        return (
            <SelectField
                label={i18next.t('Add')}
                items={collections[id]}
                //value={programStage ? programStage.id : null}
                onChange={onChange}
                style={style}
            />
        );
    }
}

export default connect(
    (state) => ({
        collections: state.earthEngine,
    }),
    { loadEarthEngineCollection }
)(CollectionSelect);
