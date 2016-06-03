import isArray from 'd2-utilizr/lib/isArray';
import colorbrewer from '../custom/colorbrewer';

const createColorRamp = function(value, model) {
    const classes = model.get('classes');
    const colors = colorbrewer[model.getId()][classes];
    const ramp = colors.map(color => '<li style="background:' + color + '" />').join('');
    return '<ul class="color-ramp-' + classes +'">' + ramp + '</ul>';
};

const colorStore = Ext.create('Ext.data.Store', {
    fields: ['id', 'classes', {name: 'ramp', convert: createColorRamp}],
    data: [{
        id: 'YlGn',
        classes: 7
    },{
        id: 'BuGn',
        classes: 7
    },{
        id: 'PuBu',
        classes: 7
    },{
        id: 'BuPu',
        classes: 7
    },{
        id: 'RdPu',
        classes: 7
    },{
        id: 'PuRd',
        classes: 7
    },{
        id: 'YlOrBr',
        classes: 7
    },{
        id: 'Blues',
        classes: 7
    },{
        id: 'Greens',
        classes: 7
    },{
        id: 'Oranges',
        classes: 7
    },{
        id: 'Reds',
        classes: 7
    },{
        id: 'Greys',
        classes: 7
    }]
})

// ColorRamp
// http://docs.sencha.com/extjs/4.0.7/#!/api/Ext.form.field.ComboBox
Ext.define('Ext.ux.field.ColorRamp', {
    extend: 'Ext.form.field.ComboBox',
    alias: 'widget.colorramp',
    cls: 'gis-combo',
    fieldLabel: 'Select color scale', // TODO: i18n
    editable: false,
    valueField: 'id',
    displayField: 'ramp',
    queryMode: 'local',
    forceSelection: true,
    width: 220,
    labelAlign: 'top',
    labelCls: 'gis-form-item-label-top',
    style: 'padding-bottom:10px;',
    tpl: '<tpl for="."><div class="x-boundlist-item color-ramp">{ramp}</div></tpl>',
    store: colorStore,
    listeners: {
        afterRender: function() {
            this.reset();
        }
    },
    reset: function() { // Set first ramp
        this.setValue(this.store.getAt(0).data.id, true);
    },
    getValue: function() {
        const value = this.self.superclass.getValue.call(this);

        if (value) {
            return colorbrewer[value][this.findRecordByValue(value).get('classes')];
        }

        return value;
    },
    setValue: function(value, doSelect) {
        this.self.superclass.setValue.call(this, value, doSelect);

        if (value) {
            if (!this.colorEl) {
                this.colorEl = document.createElement('div');
                this.colorEl.className = 'color-ramp';
                this.colorEl.style.width = (this.getWidth() - 18) + 'px';
                this.inputEl.insertSibling(this.colorEl);
            }

            if (isArray(value)) {
                value = value[0];
            }

            if (typeof value !== 'string') {
                value = value.getId();
            }

            this.colorEl.innerHTML = this.findRecordByValue(value).get('ramp');
        }

        return this;
    }
});
