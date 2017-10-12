import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Tabs, Tab } from 'material-ui/Tabs';
import OrgUnitGroupSetSelect from '../orgunits/OrgUnitGroupSetSelect';
import OrgUnitTree from '../../containers/OrgUnits';

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

    static contextTypes = {
        d2: PropTypes.object,
    };

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
        const d2 = this.context.d2;
        const i18n = d2.i18n.getTranslation.bind(d2.i18n);

        return (
            <Tabs>
                <Tab label={i18n('group_set')}>
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
                <Tab label={i18n('organisation_units')}>
                    <div style={styles.content}>
                        <OrgUnitTree
                            selected={orgUnits ? orgUnits.items : []}
                        />
                    </div>
                </Tab>
                <Tab label={i18n('style')}>

                </Tab>
            </Tabs>
        );
    }
}


export default FacilityDialog;
