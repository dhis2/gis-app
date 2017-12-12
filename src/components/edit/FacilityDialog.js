import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import i18next from 'i18next';
import { Tabs, Tab } from 'd2-ui/lib/tabs/Tabs';
import OrgUnitGroupSetSelect from '../orgunits/OrgUnitGroupSetSelect';
import OrgUnitTree from '../orgunits/OrgUnitTree';
import OrgUnitGroupSelect from '../orgunits/OrgUnitGroupSelect';
import OrgUnitLevelSelect from '../orgunits/OrgUnitLevelSelect';
import UserOrgUnitsSelect from '../orgunits/UserOrgUnitsSelect';
import Checkbox from '../d2-ui/Checkbox';
import FontStyle from '../d2-ui/FontStyle';

import {
    setOrganisationUnitGroupSet,
    setOrgUnitLevels,
    setOrgUnitGroups,
    setUserOrgUnits,
    toggleOrganisationUnit,
    setLabels,
    setLabelFontColor,
    setLabelFontSize,
    setLabelFontWeight,
    setLabelFontStyle,
} from '../../actions/layerEdit';

import {
    getOrgUnitNodesFromRows,
    getOrgUnitLevelsFromRows,
    getOrgUnitGroupsFromRows,
    getUserOrgUnitsFromRows,
} from '../../util/analytics';

const styles = {
    content: { // TODO: reuse styles
        display: 'flex',
        flexFlow: 'row wrap',
        justifyContent: 'space-between',
        alignContent: 'flex-start',
        padding: 12,
        height: 330,
        overflowY: 'auto',
    },
    flexHalf: {
        flex: '50%',
        minWidth: 230,
        boxSizing: 'border-box',
        borderLeft: '12px solid #fff',
        borderRight: '12px solid #fff',
    },
    flexFull: {
        flex: '100%',
        display: 'flex',
        flexFlow: 'row wrap',
        justifyContent: 'space-between',
        alignContent: 'flex-start',
    },
    labelWrapper: {
        width: '100%',
        clear: 'both',
    },
    labelCheckbox: {
        float: 'left',
        margin: '24px 0 0 12px',
        width: 180,
    },
    font: {
        float: 'left',
        marginTop: -8,
    }
};

class FacilityDialog extends Component {

    render() {
        const {
            rows = [],
            organisationUnitGroupSet,
            labels,
            labelFontColor,
            labelFontSize,
            labelFontWeight,
            labelFontStyle,
            setOrganisationUnitGroupSet,
            setOrgUnitLevels,
            setOrgUnitGroups,
            setUserOrgUnits,
            toggleOrganisationUnit,
            setLabels,
            setLabelFontColor,
            setLabelFontSize,
            setLabelFontWeight,
            setLabelFontStyle,
        } = this.props;

        const selectedUserOrgUnits = getUserOrgUnitsFromRows(rows);

        return (
            <Tabs>
                <Tab label={i18next.t('Group set')}>
                    <div style={styles.content}>
                        <OrgUnitGroupSetSelect
                            value={organisationUnitGroupSet}
                            onChange={setOrganisationUnitGroupSet}
                            style={styles.flexHalf}
                        />
                    </div>
                </Tab>
                <Tab label={i18next.t('Organisation units')}>
                    <div style={styles.content}>
                        <div style={styles.flexHalf}>
                            <OrgUnitTree
                                selected={getOrgUnitNodesFromRows(rows)}
                                onClick={toggleOrganisationUnit}
                                disabled={selectedUserOrgUnits.length ? true : false}
                            />
                        </div>
                        <div style={styles.flexHalf}>
                            <OrgUnitLevelSelect
                                orgUnitLevel={getOrgUnitLevelsFromRows(rows)}
                                onChange={setOrgUnitLevels}
                            />
                            <OrgUnitGroupSelect
                                orgUnitGroup={getOrgUnitGroupsFromRows(rows)}
                                onChange={setOrgUnitGroups}

                            />
                            <UserOrgUnitsSelect
                                selected={selectedUserOrgUnits}
                                onChange={setUserOrgUnits}
                            />
                        </div>
                    </div>
                </Tab>
                <Tab label={i18next.t('Style')}>
                    <div style={styles.content}>
                        <div style={styles.labelWrapper}>
                            <Checkbox
                                label='Show labels'
                                checked={labels}
                                onCheck={setLabels}
                                style={styles.labelCheckbox}
                            />
                            {labels &&
                                <FontStyle
                                    color={labelFontColor}
                                    size={labelFontSize}
                                    weight={labelFontWeight}
                                    fontStyle={labelFontStyle}
                                    onColorChange={setLabelFontColor}
                                    onSizeChange={setLabelFontSize}
                                    onWeightChange={setLabelFontWeight}
                                    onStyleChange={setLabelFontStyle}
                                    style={styles.font}
                                />
                            }
                        </div>
                    </div>
                </Tab>
            </Tabs>
        );
    }
}

export default connect(
    null, {
        setOrganisationUnitGroupSet,
        setOrgUnitLevels,
        setOrgUnitGroups,
        setUserOrgUnits,
        toggleOrganisationUnit,
        setLabels,
        setLabelFontColor,
        setLabelFontSize,
        setLabelFontWeight,
        setLabelFontStyle,
    }
)(FacilityDialog);
