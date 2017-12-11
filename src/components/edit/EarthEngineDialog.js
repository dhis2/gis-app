import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import i18next from 'i18next';
import ColorScaleSelect from '../d2-ui/ColorScaleSelect';
import { Tabs, Tab } from 'd2-ui/lib/tabs/Tabs';
import TextField from 'd2-ui/lib/text-field/TextField';
import Collection from '../earthengine/Collection';
import LegendItem from '../layers/legend/LegendItem';
import { setParams, setFilter } from '../../actions/layerEdit';
import { getColorScale, getColorPalette } from '../../util/colorscale';
import { createLegend } from '../../loaders/earthEngineLoader';
import '../layers/legend/Legend.css';

const styles = {
    tabs: {
        height: 376,
    },
    flex: {
        display: 'flex',
        flexFlow: 'row wrap',
        justifyContent: 'space-between',
        alignContent: 'flex-start',
        padding: 12,
    },
    flexColumn: {
        flex: '50%',
        display: 'flex',
        flexFlow: 'row wrap',
        justifyContent: 'space-between',
        alignContent: 'flex-start',
        boxSizing: 'border-box',
    },
    flexFull: {
        flex: '100%',
        boxSizing: 'border-box',
        borderLeft: '12px solid #fff',
        borderRight: '12px solid #fff',
    },
    flexThird: {
        flex: '33%',
        boxSizing: 'border-box',
        borderLeft: '12px solid #fff',
        borderRight: '12px solid #fff',
    },
    legend: {
        borderLeft: '12px solid #fff',
        borderRight: '12px solid #fff',
    },
    legendTitle: {
        padding: '16px 0 16px 32px',
        fontWeight: 'bold',
    },
};

class EarthEngineDialog extends Component {

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
            const newPalette = getColorPalette(scale, classes);

            if (newPalette) {
                this.props.setParams(min, max, newPalette.join());
            }
        }
    }

    // TODO: Create a d2-ui number field that returns numbers (not text) and controls min and max
    render() {
        const { id, params, filter, setParams, setFilter } = this.props;
        const { min, max, palette } = params;
        const steps = this.state ? this.state.steps : this.getStepsFromParams();
        const legend = createLegend(params);

        return (
            <Tabs style={styles.tabs}>
                <Tab label={i18next.t('Style')}>
                    <div style={styles.flex}>
                        <div style={styles.flexColumn}>
                            {id !== 'USGS/SRTMGL1_003' && // If not elevation
                                <Collection
                                    id={id}
                                    filter={filter}
                                    onChange={setFilter}
                                    style={styles.flexFull}
                                />
                            }
                            <TextField
                                type='number'
                                label={i18next.t('Min')}
                                value={min}
                                onChange={min => setParams(parseInt(min), parseInt(max), palette)}
                                style={styles.flexThird}
                            />
                            <TextField
                                type='number'
                                label={i18next.t('Max')}
                                value={max}
                                onChange={max => setParams(parseInt(min), parseInt(max), palette)}
                                style={styles.flexThird}
                            />
                            <TextField
                                type='number'
                                label={i18next.t('Steps')}
                                value={steps || ''}
                                onChange={steps => this.onStepsChange(parseInt(steps))}
                                style={styles.flexThird}
                            />
                            <ColorScaleSelect
                                palette={palette}
                                onChange={palette => setParams(min, max, palette.join())}
                            />
                        </div>
                        <div style={styles.flexColumn}>
                            <div style={styles.legend}>
                                <div style={styles.legendTitle}>{i18next.t('Legend preview')}</div>
                                <dl className='Legend'>
                                    {legend.map((item, index) => (
                                        <LegendItem
                                            {...item}
                                            key={`item-${index}`}
                                        />
                                    ))}
                                </dl>
                            </div>
                        </div>
                    </div>
                </Tab>
            </Tabs>
        );
    }
}

export default connect(null, { setParams, setFilter })(EarthEngineDialog);
