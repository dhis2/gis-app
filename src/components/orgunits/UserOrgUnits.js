import React, { Component } from 'react';
import PropTypes from 'prop-types';
import FirstLevel from './UserOrgUnitsFirstLevel';
import SecondLevel from './UserOrgUnitsSecondLevel';
import ThirdLevel from './UserOrgUnitsThirdLevel';
import Checkbox from '../d2-ui/Checkbox';

const styles = {
    container: {
        marginTop: 24,
        padding: '8px 16px',
        width: 240,
        height: 270,
        boxShadow: '0px 0px 4px 1px rgba(0,0,0,0.2)',
        float: 'right',
    },
    title: {
        marginBottom: 24,
    },
    level: {
        height: 48,
        marginTop: 16,
        clear: 'both',
    },
    checkbox: {
        width: 160,
        paddingTop: 12,
        float: 'left',
    },
    checkboxIcon: {
        fill: 'rgba(0, 0, 0, 0.6)', // TODO: Make theme default?
    },
    checkboxLabel: {
        color: 'rgba(0, 0, 0, 0.6)', // TODO: Make theme default?
    },
};

const levels = [{
    id: 'USER_ORGUNIT',
    label: 'First level',
    icon: FirstLevel,
}, {
    id: 'USER_ORGUNIT_CHILDREN',
    label: 'Second level',
    icon: SecondLevel,
}, {
    id: 'USER_ORGUNIT_GRANDCHILDREN',
    label: 'Third level',
    icon: ThirdLevel,
}];


const UserOrgUnits = ({ selected, onClick }) => (
    <div style={styles.container}>
        <div style={styles.title}>User organisation units</div>
        {levels.map(level => {
            const LevelIcon = level.icon;
            return (
                <div key={level.id} style={styles.level}>
                    <Checkbox
                        label={level.label}
                        checked={selected.some(item => item.id === level.id)}
                        onCheck={isChecked => onClick({
                            id: level.id,
                        })}
                        style={styles.checkbox}
                        labelStyle={styles.checkboxLabel}
                        iconStyle={styles.checkboxIcon}
                    />
                    <LevelIcon />
                </div>
            )
        })}
    </div>
);

UserOrgUnits.propTypes = {
    selected:  PropTypes.array,
    onClick: PropTypes.func,
};

export default UserOrgUnits;
