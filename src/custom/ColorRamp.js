import isArray from 'd2-utilizr/lib/isArray';
import colorbrewer from '../custom/colorbrewer';

const createColorRamp = function(value, model) {
    const classes = model.get('classes');
    const colors = colorbrewer[model.getId()][classes];
    const ramp = colors.map(color => '<li style="background:' + color + '" />').join('');
    return '<ul class="color-ramp-' + classes +'">' + ramp + '</ul>';
};

const colorStore = Ext.create('Ext.data.Store', {
    fields: ['id', 'classes', {name: 'ramp', persist: false, convert: createColorRamp}],
    data: [
        {id: 'YlGn',    classes: 5},
        {id: 'BuGn',    classes: 5},
        {id: 'PuBu',    classes: 5},
        {id: 'BuPu',    classes: 5},
        {id: 'RdPu',    classes: 5},
        {id: 'PuRd',    classes: 5},
        {id: 'YlOrBr',  classes: 5},
        {id: 'Blues',   classes: 5},
        {id: 'Greens',  classes: 5},
        {id: 'Oranges', classes: 5},
        {id: 'Reds',    classes: 5},
        {id: 'Greys',   classes: 5}
    ]
});

// ColorRamp
// http://docs.sencha.com/extjs/4.0.7/#!/api/Ext.form.field.ComboBox
Ext.define('Ext.ux.field.ColorRamp', {
    extend: 'Ext.form.field.ComboBox',
    alias: 'widget.colorramp',
    cls: 'gis-combo',
    //fieldLabel: 'Select color scale', // TODO: i18n
    editable: false,
    valueField: 'id',
    displayField: 'ramp',
    queryMode: 'local',
    forceSelection: true,
    // 220,
    //labelAlign: 'top',
    //labelCls: 'gis-form-item-label-top',
    //style: 'padding-bottom:10px;',
    tpl: '<tpl for="."><div class="x-boundlist-item color-ramp">{ramp}</div></tpl>',
    store: colorStore,
    classes: 5, // Default
    listeners: {
        afterRender: function() {
            this.setClasses(this.classes);
            this.reset();
        }
    },
    reset: function() { // Set first ramp
        this.setValue(this.store.getAt(0).data.id, true);
    },
    getValue: function() {
        //const value = this.self.superclass.getValue.call(this);

        if (this.scheme) {

            return colorbrewer[this.scheme][this.findRecordByValue(this.scheme).get('classes')];
        }

        //return value;
    },
    setValue: function(value, doSelect) {
        this.self.superclass.setValue.call(this, value, doSelect);

        if (value) {
            if (!this.colorEl) {
                this.colorEl = document.createElement('div');
                this.colorEl.className = 'color-ramp';
                this.colorEl.style.width = this.inputEl.getWidth() + 'px';
                this.inputEl.insertSibling(this.colorEl);
            }

            if (isArray(value)) {
                value = value[0];
            }

            if (typeof value !== 'string') {
                value = value.getId();
            }

            this.scheme = value;
            this.colorEl.innerHTML = this.findRecordByValue(value).get('ramp');
        }

        return this;
    },
    setClasses: function (classes) {
        this.store.each(function(model){
            model.set('classes', classes);
            model.set('ramp', ''); // Triggers createColorRamp convert function
        });

        if (this.colorEl) {
            this.colorEl.innerHTML = this.findRecordByValue(this.scheme).get('ramp');
        }
    }
});
