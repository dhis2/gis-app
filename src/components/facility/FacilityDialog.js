import React, { Component } from 'react';
// import PropTypes from 'prop-types';
import { Tabs, Tab } from 'material-ui/Tabs';
import OrgUnitGroupSetSelect from '../orgunits/OrgUnitGroupSetSelect';

const styles = {
    body: {
        padding: 0,
    },
    title: {
        padding: '8px 16px',
        fontSize: 18,
    },
    content: {
        padding: '0 24px 16px',
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
        console.log('componentDidMount');

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
            orgUnitGroupSets,
            organisationUnitGroupSet,
            setOrganisationUnitGroupSet,
        } = this.props;

        return (
            <Tabs>
                <Tab label='Group set'>
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
                <Tab label='Organisation units'>

                </Tab>
                <Tab label='Style'>

                </Tab>
            </Tabs>
        );
    }
}


export default FacilityDialog;
