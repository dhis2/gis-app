import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import i18next from 'i18next';
import ColorScaleSelect from '../d2-ui/ColorScaleSelect';
import { Tabs, Tab } from 'd2-ui/lib/tabs/Tabs';
import TextField from 'd2-ui/lib/text-field/TextField';
import Collection from '../earthengine/Collection';
import { setParams, setFilter } from '../../actions/layerEdit';
import { getColorScale, getColorPalette } from '../../util/colorscale';

const styles = {};

class EarthEngineDialog extends Component {
    constructor(...args) {
        super(...args);

        this.state = {
            steps: 5,
        };
    }

    // Steps are less as we also have colors for above and below (not below if min = 0)
    getStepsFromParams() {
        const { palette, min } = this.props.params;
        return palette.split(',').length - (min === 0 ? 1 : 2);
    }

    // Always set state to update text field, but only store if valid
    onStepsChange(steps) {
        const { min, max, palette } = this.props.params;

        this.setState({ steps });

        if (steps > 0 && steps < 8) { // Valid steps: 1-7
            const scale = getColorScale(palette);
            const classes = (steps == 1 && min == 0 ? 2 : steps) + (min == 0 ? 1 : 2);
            const palette = getColorPalette(scale, classes);

            if (palette) {
                this.props.setParams(min, max, palette.join());
            }
        }
    }

    render() {
        const { id, params, filter, setParams, setFilter } = this.props;
        const { min, max, palette } = params;

        return (
            <Tabs>
                <Tab label={i18next.t('Style')}>
                    {id !== 'USGS/SRTMGL1_003' && // If not elevation
                        <Collection
                            id={id}
                            filter={filter}
                            onChange={setFilter}
                        />
                    }
                    <TextField
                        type='number'
                        label={i18next.t('Min')}
                        value={min}
                        onChange={min => setParams(min, max, palette)}
                    />
                    <TextField
                        type='number'
                        label={i18next.t('Max')}
                        value={max}
                        onChange={max => setParams(min, max, palette)}
                    />
                    <TextField
                        type='number'
                        label={i18next.t('Steps')}
                        value={this.state.steps || ''}
                        onChange={steps => this.onStepsChange(parseInt(steps))}
                    />
                    <ColorScaleSelect
                        palette={palette}
                        onChange={console.log}
                    />
                </Tab>
            </Tabs>
        );
    }
}

export default connect(null, { setParams, setFilter })(EarthEngineDialog);
