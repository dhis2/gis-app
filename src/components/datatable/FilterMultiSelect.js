import React, {Component} from 'react';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import './FilterMultiSelect.css';

const names = [
    'Low',
    'Medium',
    'Medium Pl.',
    'High',
    'High Plus',
    'Great',
    'Invalid',
];

const styles = {
  root: {
      width: '100%',
      height: 24,
      background: '#fff',
  },
  underline: {
      display: 'none',
  },
  hint: {
      textTransform: 'none',
      color: '#ddd',
      fontSize: 12,
      fontWeight: 'normal',
      bottom: -1,
      left: 5,
  },
  label: {
      top: -1,
      left: 5,
      height: 24,
      width: 120,
      lineHeight: '24px',
      textTransform: 'none',
      fontWeight: 'normal',
      fontSize: 12,
  },
  icon: {
      width: 24,
      height: 24,
      right: 45,
      marginTop: -6,
  },
  menu: {
      width: 140,
  },
  list: {
      paddingTop: 4,
      paddingBottom: 4,
  },
  menuItem: {
      fontSize: 12,
      lineHeight: '24px',
      minHeight: 24,
  },
};



// http://www.material-ui.com/#/components/select-field
class FilterMultiSelect extends Component {

    constructor(props) {
        super(props);

        this.state = {
            values: [],
        };

    }

    handleChange = (event, index, values) => this.setState({values});

    menuItems(values) {
        return names.map((name) => (
            <MenuItem
                className='FilterMultiSelect-item'
                key={name}
                insetChildren={true}
                checked={values && values.indexOf(name) > -1}
                value={name}
                primaryText={name}
            />
        ));
    }

    render() {
        const {values} = this.state;

        return (
            <SelectField
                hintText='Select'
                value={values}
                onChange={this.handleChange}
                className='FilterMultiSelect'
                style={styles.root}
                hintStyle={styles.hint}
                underlineStyle={styles.underline}
                labelStyle={styles.label}
                iconStyle={styles.icon}
                menuStyle={styles.menu}
                menuItemStyle={styles.menuItem}
                listStyle={styles.list}
                multiple={true}
                onClick={evt => evt.stopPropagation()}
            >
                {this.menuItems(values)}
            </SelectField>
        )
    }
}

export default FilterMultiSelect;
