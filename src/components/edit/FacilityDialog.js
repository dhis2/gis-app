import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import i18next from 'i18next';
import { Tabs, Tab } from 'd2-ui/lib/tabs/Tabs';
import OrgUnitGroupSetSelect from '../orgunits/OrgUnitGroupSetSelect';
import OrgUnitTree from '../orgunits/OrgUnitTree';
import { loadOrgUnitGroupSets } from '../../actions/orgUnits';
import { setOrganisationUnitGroupSet } from '../../actions/layerEdit';

const styles = {
    body: {
        padding: 0,
    },
    title: {
        padding: '8px 16px',
        fontSize: 18,
    },
    content: {
        padding: '0 24px',
        minHeight: 300,
    },
    checkbox: {
        marginTop: 24,
    },
    numberField: {
        display: 'block',
        width: 100,
    }
};

class FacilityDialog extends Component {

    componentDidMount() {
        const {
            orgUnitGroupSets,
            loadOrgUnitGroupSets
        } = this.props;

        // Load programs
        if (!orgUnitGroupSets) {
            console.log('load orgUnitGroupSets');
            loadOrgUnitGroupSets();
        }
    }

    componentDidUpdate(prev) {
        // console.log('componentDidUpdate', this.props.organisationUnitGroupSet ? this.props.organisationUnitGroupSet.name : null);
    }

    load() {

    }

    render() {
        const {
            rows = [],
            orgUnitGroupSets,
            organisationUnitGroupSet,
            setOrganisationUnitGroupSet,
        } = this.props;

        const orgUnits = rows.filter(r => r.dimension === 'ou')[0];

        return (
            <Tabs>
                <Tab label={i18next.t('Group set')}>
                    <div style={styles.content}>
                        {orgUnitGroupSets ?
                            <OrgUnitGroupSetSelect
                                items={orgUnitGroupSets}
                                value={organisationUnitGroupSet ? organisationUnitGroupSet.id : null}
                                onChange={setOrganisationUnitGroupSet}
                            />
                        : null}
                    </div>
                </Tab>
                <Tab label={i18next.t('Organisation units')}>
                    <div style={styles.content}>
                        <OrgUnitTree
                            selected={orgUnits ? orgUnits.items : []}
                        />
                    </div>
                </Tab>
                <Tab label={i18next.t('Style')}>

                </Tab>
            </Tabs>
        );
    }
}

export default connect(
    (state) => ({
        orgUnitGroupSets: state.orgUnitGroupSets,
    }), { loadOrgUnitGroupSets, setOrganisationUnitGroupSet }
)(FacilityDialog);
