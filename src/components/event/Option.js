import React from 'react';
import Checkbox from 'material-ui/Checkbox';
import Visibility from 'material-ui/svg-icons/action/visibility';
import VisibilityOff from 'material-ui/svg-icons/action/visibility-off';

const styles = {
    checkbox: {
        marginBottom: 16,
    },
};

const Option = (props) => {
    // console.log(props);

    return (
        <Checkbox
            checked={true}
            checkedIcon={<Visibility />}
            uncheckedIcon={<VisibilityOff />}
            label={props.name}
            style={styles.checkbox}
        />
    );
};

export default Option;
