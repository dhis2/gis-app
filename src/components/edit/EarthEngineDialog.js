import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import i18next from 'i18next';
import ColorScaleSelect from 'd2-ui/lib/legend/ColorScaleSelect.component';
import { Tabs, Tab } from 'd2-ui/lib/tabs/Tabs';
import TextField from 'd2-ui/lib/text-field/TextField';
import Collection from '../earthengine/Collection';
import { setMin, setMax, setSteps, setColors } from '../../actions/layerEdit';

const styles = {};

class EarthEngineDialog extends Component {

    getConfig(id) {
        switch (id) {

            case 'USGS/SRTMGL1_003':
                return {
                    id: 'USGS/SRTMGL1_003',
                    name: GIS.i18n.elevation,
                    description: 'Elevation above sea-level. You can adjust the min and max values so it better representes the terrain in your region.',
                    valueLabel: GIS.i18n.min_max_elevation,
                    min: 0,
                    max: 1500,
                    minValue: 0,
                    maxValue: 8848,
                    steps: 5,
                    colors: 'YlOrBr',
                };

            default:
                return null; // TODO: Error

      }
    }

    render() {
        const { id, min, max, steps, setMin, setMax, setSteps, setColors } = this.props;

        // console.log('render', id, min, max, steps);

        return (
            <Tabs>
                <Tab label={i18next.t('Style')}>
                    {id !== 'USGS/SRTMGL1_003' && // If not elevation
                        <Collection
                            id={id}
                            onChange={console.log}
                        />
                    }
                    <TextField
                        type='number'
                        label={i18next.t('Min')}
                        value={min}
                        onChange={setMin}
                        // style={styles.flexHalf}
                    />
                    <TextField
                        type='number'
                        label={i18next.t('Max')}
                        value={max}
                        onChange={setMax}
                      // style={styles.flexHalf}
                    />
                    <TextField
                        type='number'
                        label={i18next.t('Steps')}
                        value={steps}
                        onChange={setSteps}
                      // style={styles.flexHalf}
                    />
                    <ColorScaleSelect
                        key='scale'
                        label={i18next.t('Classes')}
                        // onChange={colorScale => setColorScale(colorScale)}
                        onChange={console.log}
                        style={styles.colorScaleSelect}
                        classesStyle={styles.classes}
                    />
                </Tab>
            </Tabs>
        );
    }

}

export default connect(
  null, {
    setMin,
    setMax,
    setSteps,
    setColors,
  }
)(EarthEngineDialog);
