import isArray from 'd2-utilizr/lib/isArray';
import isBoolean from 'd2-utilizr/lib/isBoolean';
import isFunction from 'd2-utilizr/lib/isFunction';
import isObject from 'd2-utilizr/lib/isObject';
import isString from 'd2-utilizr/lib/isString';
import arrayClean from 'd2-utilizr/lib/arrayClean';
import arrayContains from 'd2-utilizr/lib/arrayContains';
import arrayMax from 'd2-utilizr/lib/arrayMax';
import arraySort from 'd2-utilizr/lib/arraySort';
import arrayFrom from 'd2-utilizr/lib/arrayFrom';
import arrayPluck from 'd2-utilizr/lib/arrayPluck';

export default function LayerWidgetThematic(gis, layer) {
    const accordionPanels = [];
    const dimConf = gis.conf.finals.dimension;

    // Stores

    const indicatorsByGroupStore = Ext.create('Ext.data.Store', {
        fields: ['id', 'name', 'legendSet'],
        proxy: {
            type: 'ajax',
            url: '',
            reader: {
                type: 'json',
                root: 'indicators'
            }
        },
        isLoaded: false,
        loadFn(fn) {
            if (isFunction(fn)) {
                if (this.isLoaded) {
                    fn.call();
                }
                else {
                    this.load({
                        callback: fn
                    });
                }
            }
        },
        listeners: {
            load: function() {
                if (!this.isLoaded) {
                    this.isLoaded = true;
                }
                this.sort('name', 'ASC');
            }
        }
    });

    const dataElementsByGroupStore = Ext.create('Ext.data.Store', {
        fields: ['id', 'name'],
        proxy: {
            type: 'ajax',
            url: '',
            reader: {
                type: 'json',
                root: 'dataElements'
            }
        },
        isLoaded: false,
        loadFn(fn) {
            if (this.isLoaded) {
                fn.call();
            }
            else {
                this.load(fn);
            }
        },
        sortStore() {
            this.sort('name', 'ASC');
        },
        setTotalsProxy(uid, preventLoad, callbackFn) {
            let path;

            if (isString(uid)) {
                path = '/dataElements.json?fields=dimensionItem|rename(id),' + gis.init.namePropertyUrl + '&domainType=aggregate&paging=false&filter=dataElementGroups.id:eq:' + uid;
            }
            else if (uid === 0) {
                path = '/dataElements.json?fields=dimensionItem|rename(id),' + gis.init.namePropertyUrl + '&domainType=aggregate&paging=false';
            }

            if (!path) {
                alert(GIS.i18n.invalid_parameter);
                return;
            }

            this.setProxy({
                type: 'ajax',
                url: encodeURI(gis.init.contextPath + '/api' + path),
                reader: {
                    type: 'json',
                    root: 'dataElements'
                }
            });

            if (!preventLoad) {
                this.load({
                    scope: this,
                    callback: function() {
                        this.sortStore();

                        if (isFunction(callbackFn)) {
                            callbackFn();
                        }
                    }
                });
            }
        },
        setDetailsProxy(uid, preventLoad, callbackFn) {
            if (isString(uid)) {
                this.setProxy({
                    type: 'ajax',
                    url: encodeURI(gis.init.apiPath + 'dataElementOperands.json?fields=id,' + gis.init.namePropertyUrl + '&paging=false&filter=dataElement.dataElementGroups.id:eq:' + uid),
                    reader: {
                        type: 'json',
                        root: 'dataElementOperands'
                    }
                });

                if (!preventLoad) {
                    this.load({
                        scope: this,
                        callback() {
                            this.sortStore();

                            if (isFunction(callbackFn)) {
                                callbackFn();
                            }
                        }
                    });
                }
            }
            else {
                alert(GIS.i18n.invalid_parameter);
            }
        },
        listeners: {
            load
                () {
                if (!this.isLoaded) {
                    this.isLoaded = true;
                }
                this.sort('name', 'ASC');
            }
        }
    });

    const dataSetStore = Ext.create('Ext.data.Store', {
        fields: ['id', 'name'],
        proxy: {
            type: 'ajax',
            url: encodeURI(gis.init.apiPath + 'dataSets.json?fields=dimensionItem|rename(id),' + gis.init.namePropertyUrl + '&paging=false'),
            reader: {
                type: 'json',
                root: 'dataSets'
            }
        },
        sortStore() {
            this.sort('name', 'ASC');
        },
        isLoaded: false,
        listeners: {
            load(s) {
                this.isLoaded = true;
            }
        }
    });

    const programStore = Ext.create('Ext.data.Store', {
        fields: ['id', 'name'],
        proxy: {
            type: 'ajax',
            url: encodeURI(gis.init.apiPath + 'programs.json?fields=id,displayName|rename(name)&paging=false'),
            reader: {
                type: 'json',
                root: 'programs'
            },
            pageParam: false,
            startParam: false,
            limitParam: false
        }
    });

    const eventDataItemAvailableStore = Ext.create('Ext.data.Store', {
        fields: ['id', 'name'],
        data: [],
        sortStore() {
            this.sort('name', 'ASC');
        },
        loadDataAndUpdate(data, append) {
            this.clearFilter(); // work around
            this.loadData(data, append);
            this.updateFilter();
        },
        getRecordsByIds(ids) {
            const records = [];

            ids = arrayFrom(ids);

            for (let i = 0, index; i < ids.length; i++) {
                index = this.findExact('id', ids[i]);

                if (index !== -1) {
                    records.push(this.getAt(index));
                }
            }

            return records;
        },
        updateFilter() {
            const selectedStoreIds = dataSelectedStore.getIds();

            this.clearFilter();
            this.filterBy(record => !arrayContains(selectedStoreIds, record.data.id));
        }
    });

    const programIndicatorAvailableStore = Ext.create('Ext.data.Store', {
        fields: ['id', 'name'],
        data: [],
        sortStore() {
            this.sort('name', 'ASC');
        },
        loadDataAndUpdate(data, append) {
            this.clearFilter(); // work around
            this.loadData(data, append);
            this.updateFilter();
        },
        getRecordsByIds(ids) {
            const records = [];

            ids = arrayFrom(ids);

            for (let i = 0, index; i < ids.length; i++) {
                index = this.findExact('id', ids[i]);

                if (index !== -1) {
                    records.push(this.getAt(index));
                }
            }

            return records;
        },
        updateFilter() {
            const selectedStoreIds = dataSelectedStore.getIds();

            this.clearFilter();
            this.filterBy(record => !arrayContains(selectedStoreIds, record.data.id));
        }
    });

    const periodsByTypeStore = Ext.create('Ext.data.Store', {
        fields: ['id', 'name', 'index'],
        data: [],
        setIndex(periods) {
            for (let i = 0; i < periods.length; i++) {
                periods[i].index = i;
            }
        },
        sortStore: function() {
            this.sort('index', 'ASC');
        }
    });

    const infrastructuralDataElementValuesStore = Ext.create('Ext.data.Store', {
        fields: ['name', 'value'],
        sorters: [{
            property: 'name',
            direction: 'ASC'
        }]
    });

    const legendsByLegendSetStore = Ext.create('Ext.data.Store', {
        fields: ['id', 'name', 'startValue', 'endValue', 'color'],
        proxy: {
            type: 'ajax',
            url: '',
            reader: {
                type: 'json',
                root: 'legends'
            }
        },
        isLoaded: false,
        loadFn(fn) {
            if (this.isLoaded) {
                fn.call();
            }
            else {
                this.load(fn);
            }
        },
        listeners: {
            load() {
                if (!this.isLoaded) {
                    this.isLoaded = true;
                }
                this.sort('name', 'ASC');
            }
        }
    });

    // Togglers

    const valueTypeToggler = function(valueType) {
        if (valueType === dimConf.indicator.objectName) {
            indicatorGroup.show();
            indicator.show();
            dataElementGroup.hide();
            dataElementPanel.hide();
            dataSet.hide();
            eventDataItemProgram.hide();
            eventDataItem.hide();
            programIndicatorProgram.hide();
            programIndicator.hide();
        }
        else if (valueType === dimConf.dataElement.objectName || valueType === dimConf.operand.objectName) {
            indicatorGroup.hide();
            indicator.hide();
            dataElementGroup.show();
            dataElementPanel.show();
            dataSet.hide();
            eventDataItemProgram.hide();
            eventDataItem.hide();
            programIndicatorProgram.hide();
            programIndicator.hide();
        }
        else if (valueType === dimConf.dataSet.objectName) {
            indicatorGroup.hide();
            indicator.hide();
            dataElementGroup.hide();
            dataElementPanel.hide();
            dataSet.show();
            eventDataItemProgram.hide();
            eventDataItem.hide();
            programIndicatorProgram.hide();
            programIndicator.hide();
        }
        else if (valueType === dimConf.eventDataItem.objectName) {
            indicatorGroup.hide();
            indicator.hide();
            dataElementGroup.hide();
            dataElementPanel.hide();
            dataSet.hide();
            eventDataItemProgram.show();
            eventDataItem.show();
            programIndicatorProgram.hide();
            programIndicator.hide();
        }
        else if (valueType === dimConf.programIndicator.objectName) {
            indicatorGroup.hide();
            indicator.hide();
            dataElementGroup.hide();
            dataElementPanel.hide();
            dataSet.hide();
            eventDataItemProgram.hide();
            eventDataItem.hide();
            programIndicatorProgram.show();
            programIndicator.show();
        }
    };

    const legendTypeToggler = function(legendType) {
        if (legendType === 'automatic') {
            methodPanel.show();
            method.setValue(2); // Equal counts as default
            colorScale.show();
            colorLow.enable();
            lowPanelLabel.update(GIS.i18n.low_color_size + ':');
            colorHigh.enable();
            highPanelLabel.update(GIS.i18n.high_color_size + ':');
            legendSet.hide();
        }
        else if (legendType === 'predefined') {
            methodPanel.hide();
            colorScale.hide();
            colorLow.disable();
            lowPanelLabel.update(GIS.i18n.low_size + ':');
            colorHigh.disable();
            highPanelLabel.update(GIS.i18n.high_size + ':');
            legendSet.show();
        }
    };

    // Components

    const valueType = Ext.create('Ext.form.field.ComboBox', {
        cls: 'gis-combo',
        fieldLabel: GIS.i18n.item_type,
        editable: false,
        valueField: 'id',
        displayField: 'name',
        queryMode: 'local',
        forceSelection: true,
        width: gis.conf.layout.widget.item_width,
        labelWidth: gis.conf.layout.widget.itemlabel_width,
        value: dimConf.indicator.objectName,
        store: Ext.create('Ext.data.ArrayStore', {
            fields: ['id', 'name'],
            data: [
                [dimConf.indicator.objectName, GIS.i18n.indicator],
                [dimConf.dataElement.objectName, GIS.i18n.dataelement],
                [dimConf.dataSet.objectName, GIS.i18n.reporting_rates],
                [dimConf.eventDataItem.objectName, GIS.i18n.event_data_items],
                [dimConf.programIndicator.objectName, GIS.i18n.program_indicators]
            ]
        }),
        listeners: {
            select() {
                valueTypeToggler(this.getValue());
            }
        }
    });

    const indicatorGroup = Ext.create('Ext.form.field.ComboBox', {
        cls: 'gis-combo',
        fieldLabel: GIS.i18n.indicator_group,
        editable: false,
        valueField: 'id',
        displayField: 'name',
        forceSelection: true,
        queryMode: 'local',
        width: gis.conf.layout.widget.item_width,
        labelWidth: gis.conf.layout.widget.itemlabel_width,
        store: {
            fields: ['id', 'name'],
            data: gis.init.indicatorGroups
        },
        listeners: {
            select() {
                indicator.clearValue();

                indicator.store.proxy.url = encodeURI(gis.init.apiPath + 'indicators.json?fields=dimensionItem|rename(id),' + gis.init.namePropertyUrl + '&paging=false&filter=indicatorGroups.id:eq:' + this.getValue());
                indicator.store.load();
            }
        }
    });

    const indicator = Ext.create('Ext.form.field.ComboBox', {
        cls: 'gis-combo',
        fieldLabel: GIS.i18n.indicator,
        editable: false,
        valueField: 'id',
        displayField: 'name',
        queryMode: 'local',
        forceSelection: true,
        width: gis.conf.layout.widget.item_width,
        labelWidth: gis.conf.layout.widget.itemlabel_width,
        listConfig: {loadMask: false},
        store: indicatorsByGroupStore,
        listeners: {
            select(cb) {
                Ext.Ajax.request({
                    url: encodeURI(gis.init.apiPath + 'indicators.json?fields=legendSet[id]&paging=false&filter=id:eq:' + this.getValue()),
                    success: function(r) {
                        const set = JSON.parse(r.responseText).indicators[0].legendSet;

                        if (isObject(set) && set.id) {
                            legendType.setValue(gis.conf.finals.widget.legendtype_predefined);
                            legendTypeToggler(gis.conf.finals.widget.legendtype_predefined);

                            if (gis.store.legendSets.isLoaded) {
                                legendSet.setValue(set.id);
                            }
                            else {
                                gis.store.legendSets.loadFn( function() {
                                    legendSet.setValue(set.id);
                                });
                            }
                        }
                        else {
                            legendType.setValue(gis.conf.finals.widget.legendtype_automatic);
                            legendTypeToggler(gis.conf.finals.widget.legendtype_automatic);
                        }
                    }
                });
            }
        }
    });

    const dataElementGroup = Ext.create('Ext.form.field.ComboBox', {
        cls: 'gis-combo',
        fieldLabel: GIS.i18n.group,
        editable: false,
        valueField: 'id',
        displayField: 'name',
        forceSelection: true,
        hidden: true,
        width: gis.conf.layout.widget.item_width,
        labelWidth: gis.conf.layout.widget.itemlabel_width,
        store: {
            fields: ['id', 'name'],
            data: gis.init.dataElementGroups
        },
        loadAvailable(preventLoad) {
            const store = dataElementsByGroupStore;
            const detailLevel = dataElementDetailLevel.getValue();
            const value = this.getValue();

            if (value) {
                if (detailLevel === gis.conf.finals.dimension.dataElement.objectName) {
                    store.setTotalsProxy(value, preventLoad);
                }
                else {
                    store.setDetailsProxy(value, preventLoad);
                }
            }
        },
        listeners: {
            select(cb) {
                dataElement.clearValue();
                cb.loadAvailable();
            }
        }
    });

    const dataElement = Ext.create('Ext.form.field.ComboBox', {
        cls: 'gis-combo',
        fieldLabel: GIS.i18n.dataelement,
        editable: false,
        valueField: 'id',
        displayField: 'name',
        queryMode: 'local',
        forceSelection: true,
        width: gis.conf.layout.widget.item_width - 65,
        labelWidth: gis.conf.layout.widget.itemlabel_width,
        listConfig: {
            loadMask: false,
            minWidth: 188
        },
        store: dataElementsByGroupStore,
        listeners: {
            select() {
                let id = this.getValue();
                let index = id.indexOf('.');

                if (index !== -1) {
                    id = id.substr(0, index);
                }

                Ext.Ajax.request({
                    url: encodeURI(gis.init.apiPath + 'dataElements.json?fields=legendSet[id]&paging=false&filter=id:eq:' + id),
                    success: function(r) {
                        const set = JSON.parse(r.responseText).dataElements[0].legendSet;

                        if (isObject(set) && set.id) {
                            legendType.setValue(gis.conf.finals.widget.legendtype_predefined);
                            legendTypeToggler(gis.conf.finals.widget.legendtype_predefined);

                            if (gis.store.legendSets.isLoaded) {
                                legendSet.setValue(set.id);
                            }
                            else {
                                gis.store.legendSets.loadFn( function() {
                                    legendSet.setValue(set.id);
                                });
                            }
                        }
                        else {
                            legendType.setValue(gis.conf.finals.widget.legendtype_automatic);
                            legendTypeToggler(gis.conf.finals.widget.legendtype_automatic);
                        }
                    }
                });
            }
        }
    });

    const dataElementDetailLevel = Ext.create('Ext.form.field.ComboBox', {
        cls: 'gis-combo',
        style: 'margin-left:1px',
        queryMode: 'local',
        editable: false,
        valueField: 'id',
        displayField: 'text',
        width: 65 - 1,
        value: dimConf.dataElement.objectName,
        onSelect() {
            dataElementGroup.loadAvailable();
            dataElement.clearValue();
        },
        store: {
            fields: ['id', 'text'],
            data: [
                {id: dimConf.dataElement.objectName, text: GIS.i18n.totals},
                {id: dimConf.operand.objectName, text: GIS.i18n.details}
            ]
        },
        listeners: {
            select(cb) {
                cb.onSelect();
            }
        }
    });

    const dataElementPanel = Ext.create('Ext.container.Container', {
        layout: 'column',
        bodyStyle: 'border:0 none',
        hidden: true,
        items: [
            dataElement,
            dataElementDetailLevel
        ]
    });

    const dataSet = Ext.create('Ext.form.field.ComboBox', {
        cls: 'gis-combo',
        fieldLabel: GIS.i18n.dataset,
        editable: false,
        valueField: 'id',
        displayField: 'name',
        forceSelection: true,
        hidden: true,
        width: gis.conf.layout.widget.item_width,
        labelWidth: gis.conf.layout.widget.itemlabel_width,
        listConfig: {loadMask: false},
        store: dataSetStore,
        listeners: {
            select(cb) {
                Ext.Ajax.request({
                    url: encodeURI(gis.init.apiPath + 'dataSets.json?fields=legendSet[id]&paging=false&filter=id:eq:' + this.getValue()),
                    success: function(r) {
                        const set = JSON.parse(r.responseText).dataSets[0].legendSet;

                        if (isObject(set) && set.id) {
                            legendType.setValue(gis.conf.finals.widget.legendtype_predefined);
                            legendTypeToggler(gis.conf.finals.widget.legendtype_predefined);

                            if (gis.store.legendSets.isLoaded) {
                                legendSet.setValue(set.id);
                            }
                            else {
                                gis.store.legendSets.loadFn( function() {
                                    legendSet.setValue(set.id);
                                });
                            }
                        }
                        else {
                            legendType.setValue(gis.conf.finals.widget.legendtype_automatic);
                            legendTypeToggler(gis.conf.finals.widget.legendtype_automatic);
                        }
                    }
                });
            }
        }
    });

    const onEventDataItemProgramSelect = function(programId) {
        eventDataItem.clearValue();

        Ext.Ajax.request({
            url: encodeURI(gis.init.apiPath + 'programDataElements.json?program=' + programId + '&fields=dimensionItem|rename(id),' + gis.init.namePropertyUrl + ',valueType&paging=false'),
            disableCaching: false,
            success(r) {
                const types = gis.conf.valueType.aggregateTypes;
                const elements = Ext.decode(r.responseText).programDataElements.filter(function(item) {
                    return arrayContains(types, (item || {}).valueType);
                });

                Ext.Ajax.request({
                    url: encodeURI(gis.init.apiPath + 'programs.json?filter=id:eq:' + programId + '&fields=programTrackedEntityAttributes[dimensionItem|rename(id),' + gis.init.namePropertyUrl + ',valueType]&paging=false'),
                    disableCaching: false,
                    success: function(r) {
                        const attributes = ((Ext.decode(r.responseText).programs[0] || {}).programTrackedEntityAttributes || []).filter(function(item) {
                            return arrayContains(types, (item || {}).valueType);
                        });
                        const data = arraySort(arrayClean([].concat(elements, attributes))) || [];

                        eventDataItemAvailableStore.loadData(data);
                    }
                });
            }
        });
    };

    const eventDataItemProgram = Ext.create('Ext.form.field.ComboBox', {
        cls: 'gis-combo',
        fieldLabel: GIS.i18n.program,
        editable: false,
        valueField: 'id',
        displayField: 'name',
        forceSelection: true,
        hidden: true,
        width: gis.conf.layout.widget.item_width,
        labelWidth: gis.conf.layout.widget.itemlabel_width,
        store: programStore,
        listeners: {
            select(cb) {
                onEventDataItemProgramSelect(cb.getValue());
            }
        }
    });

    const eventDataItem = Ext.create('Ext.form.field.ComboBox', {
        cls: 'gis-combo',
        fieldLabel: GIS.i18n.event_data_item,
        editable: false,
        valueField: 'id',
        displayField: 'name',
        queryMode: 'local',
        forceSelection: true,
        hidden: true,
        width: gis.conf.layout.widget.item_width,
        labelWidth: gis.conf.layout.widget.itemlabel_width,
        listConfig: {loadMask: false},
        store: eventDataItemAvailableStore
    });

    const onProgramIndicatorProgramSelect = function(programId) {
        programIndicator.clearValue();

        Ext.Ajax.request({
            url: encodeURI(gis.init.apiPath + 'programs.json?paging=false&fields=programIndicators[dimensionItem|rename(id),displayName|rename(name)]&filter=id:eq:' + programId),
            success(r) {
                r = JSON.parse(r.responseText);

                const isA = isArray;
                const isO = isObject;
                const program = isA(r.programs) && r.programs.length ? r.programs[0] : null;
                const programIndicators = isO(program) && isA(program.programIndicators) && program.programIndicators.length ? program.programIndicators : [];
                const data = gis.util.array.sort(arrayClean(programIndicators)) || [];

                programIndicatorAvailableStore.loadData(data);
            }
        });

    };

    const programIndicatorProgram = Ext.create('Ext.form.field.ComboBox', {
        cls: 'gis-combo',
        fieldLabel: GIS.i18n.program,
        editable: false,
        valueField: 'id',
        displayField: 'name',
        forceSelection: true,
        hidden: true,
        width: gis.conf.layout.widget.item_width,
        labelWidth: gis.conf.layout.widget.itemlabel_width,
        store: programStore,
        listeners: {
            select(cb) {
                onProgramIndicatorProgramSelect(cb.getValue());
            }
        }
    });

    const programIndicator = Ext.create('Ext.form.field.ComboBox', {
        cls: 'gis-combo',
        fieldLabel: GIS.i18n.event_data_item,
        editable: false,
        valueField: 'id',
        displayField: 'name',
        queryMode: 'local',
        forceSelection: true,
        hidden: true,
        width: gis.conf.layout.widget.item_width,
        labelWidth: gis.conf.layout.widget.itemlabel_width,
        listConfig: {loadMask: false},
        store: programIndicatorAvailableStore
    });

    const onPeriodTypeSelect = function() {
        const type = periodType.getValue();
        const periodOffset = periodType.periodOffset;
        const generator = gis.init.periodGenerator;

        if (type === 'relativePeriods') {
            periodsByTypeStore.loadData(gis.conf.period.relativePeriods);

            periodPrev.disable();
            periodNext.disable();
        }
        else {
            const periods = generator.generateReversedPeriods(type, type === 'Yearly' ? periodOffset - 5 : periodOffset);

            for (let i = 0; i < periods.length; i++) {
                periods[i].id = periods[i].iso;
            }

            periodsByTypeStore.setIndex(periods);
            periodsByTypeStore.loadData(periods);

            periodPrev.enable();
            periodNext.enable();
        }

        period.selectFirst();
    };

    const periodType = Ext.create('Ext.form.field.ComboBox', {
        cls: 'gis-combo',
        editable: false,
        valueField: 'id',
        displayField: 'name',
        forceSelection: true,
        queryMode: 'local',
        width: 142,
        store: gis.store.periodTypes,
        periodOffset: 0,
        listeners: {
            select() {
                periodType.periodOffset = 0;
                onPeriodTypeSelect();
            }
        }
    });

    const period = Ext.create('Ext.form.field.ComboBox', {
        cls: 'gis-combo',
        fieldLabel: GIS.i18n.period,
        editable: false,
        valueField: 'id',
        displayField: 'name',
        queryMode: 'local',
        forceSelection: true,
        width: gis.conf.layout.widget.item_width,
        labelWidth: gis.conf.layout.widget.itemlabel_width,
        store: periodsByTypeStore,
        selectFirst() {
            this.setValue(this.store.getAt(0).data.id);
        }
    });

    const periodPrev = Ext.create('Ext.button.Button', {
        xtype: 'button',
        text: '<',
        width: 22,
        height: 24,
        style: 'margin-left: 1px',
        handler() {
            if (periodType.getValue()) {
                periodType.periodOffset--;
                onPeriodTypeSelect();
            }
        }
    });

    const periodNext = Ext.create('Ext.button.Button', {
        xtype: 'button',
        text: '>',
        width: 22,
        height: 24,
        style: 'margin-left: 1px',
        scope: this,
        handler() {
            if (periodType.getValue()) {
                periodType.periodOffset++;
                onPeriodTypeSelect();
            }
        }
    });

    const periodTypePanel = Ext.create('Ext.panel.Panel', {
        layout: 'hbox',
        bodyStyle: 'border:0 none',
        items: [
            {
                html: GIS.i18n.period_type + ':',
                width: 100,
                bodyStyle: 'border:0 none',
                style: 'padding: 3px 0 0 4px'
            },
            periodType,
            periodPrev,
            periodNext
        ]
    });

    const data = Ext.create('Ext.panel.Panel', {
        title: '<div class="ns-panel-title-data">' + GIS.i18n.data_and_periods + '</div>',
        hideCollapseTool: true,
        items: [
            valueType,
            indicatorGroup,
            indicator,
            dataElementGroup,
            dataElementPanel,
            dataSet,
            eventDataItemProgram,
            eventDataItem,
            programIndicatorProgram,
            programIndicator,
            periodTypePanel,
            period,
        ],
        listeners: {
            added() {
                accordionPanels.push(this);
            }
        }
    });


    const treePanel = Ext.create('Ext.tree.Panel', {
        cls: 'gis-tree',
        height: 304,
        style: 'border-top: 1px solid #ddd; padding-top: 1px',
        displayField: 'name',
        width: gis.conf.layout.widget.item_width,
        rootVisible: false,
        autoScroll: false, // https://www.sencha.com/forum/archive/index.php/t-144780.html?s=b3a72bbd82e5cc20417f0b5779439b97
        scroll:false,
        viewConfig: {
            style: 'overflow-y:auto'
        },
        multiSelect: true,
        rendered: false,
        reset() {
            const rootNode = this.getRootNode().findChild('id', gis.init.rootNodes[0].id);
            this.collapseAll();
            this.expandPath(rootNode.getPath());
            this.getSelectionModel().select(rootNode);
        },
        selectRootIf() {
            if (this.getSelectionModel().getSelection().length < 1) {
                const node = this.getRootNode().findChild('id', gis.init.rootNodes[0].id);
                if (this.rendered) {
                    this.getSelectionModel().select(node);
                }
                return node;
            }
        },
        isPending: false,
        recordsToSelect: [],
        recordsToRestore: [],
        multipleSelectIf(map, doUpdate) {
            if (this.recordsToSelect.length === gis.util.object.getLength(map)) {
                this.getSelectionModel().select(this.recordsToSelect);
                this.recordsToSelect = [];
                this.isPending = false;

                if (doUpdate) {
                    update();
                }
            }
        },
        multipleExpand(id, map, doUpdate) {
            const that = this;
            const rootId = gis.conf.finals.root.id;
            let path = map[id];

            if (path.substr(0, rootId.length + 1) !== ('/' + rootId)) {
                path = '/' + rootId + path;
            }

            that.expandPath(path, 'id', '/', function() {
                const record = Ext.clone(that.getRootNode().findChild('id', id, true));
                if (record) { // Can be null
                    that.recordsToSelect.push(record);
                }
                that.multipleSelectIf(map, doUpdate);
            });
        },
        select(url, params) {
            if (!params) {
                params = {};
            }
            Ext.Ajax.request({
                url: encodeURI(url),
                method: 'GET',
                params: params,
                scope: this,
                success: function(r) {
                    const a = JSON.parse(r.responseText).organisationUnits;
                    this.numberOfRecords = a.length;
                    for (let i = 0; i < a.length; i++) {
                        this.multipleExpand(a[i].id, a[i].path);
                    }
                }
            });
        },
        getParentGraphMap() {
            const selection = this.getSelectionModel().getSelection();
            const map = {};

            if (isArray(selection) && selection.length) {
                for (let i = 0, pathArray; i < selection.length; i++) {
                    pathArray = selection[i].getPath().split('/');
                    map[pathArray.pop()] = pathArray.join('/');
                }
            }

            return map;
        },
        selectGraphMap(map, update) {
            if (!gis.util.object.getLength(map)) {
                return;
            }

            this.isPending = true;

            for (let key in map) {
                if (map.hasOwnProperty(key)) {
                    treePanel.multipleExpand(key, map, update);
                }
            }
        },
        store: Ext.create('Ext.data.TreeStore', {
            fields: ['id', 'name', 'hasChildren'],
            proxy: {
                type: 'rest',
                format: 'json',
                noCache: false,
                extraParams: {
                    fields: 'children[id,' + gis.init.namePropertyUrl + ',children::isNotEmpty|rename(hasChildren)&paging=false'
                },
                url: encodeURI(gis.init.apiPath + 'organisationUnits'),
                reader: {
                    type: 'json',
                    root: 'children'
                },
                sortParam: false
            },
            sorters: [{
                property: 'name',
                direction: 'ASC'
            }],
            root: {
                id: gis.conf.finals.root.id,
                expanded: true,
                children: gis.init.rootNodes
            },
            listeners: {
                beforeload(store, operation) {
                    if (!store.proxy._url) {
                        store.proxy._url = store.proxy.url;
                    }
                    
                    store.proxy.url = store.proxy._url + '/' + operation.node.data.id;
                },
                load(store, node, records) {
                    records.forEach(function(record){
                        if (isBoolean(record.data.hasChildren)) {
                            record.set('leaf', !record.data.hasChildren);
                        }
                    });
                }
            }
        }),
        xable(values) {
            for (let i = 0; i < values.length; i++) {
                if (!!values[i]) {
                    this.disable();
                    return;
                }
            }

            this.enable();
        },
        getDimension() {
            const r = treePanel.getSelectionModel().getSelection();
            const config = {
                dimension: gis.conf.finals.dimension.organisationUnit.objectName,
                items: []
            };

            if (toolMenu.menuValue === 'orgunit') {
                if (userOrganisationUnit.getValue() || userOrganisationUnitChildren.getValue() || userOrganisationUnitGrandChildren.getValue()) {
                    if (userOrganisationUnit.getValue()) {
                        config.items.push({
                            id: 'USER_ORGUNIT',
                            name: ''
                        });
                    }
                    if (userOrganisationUnitChildren.getValue()) {
                        config.items.push({
                            id: 'USER_ORGUNIT_CHILDREN',
                            name: ''
                        });
                    }
                    if (userOrganisationUnitGrandChildren.getValue()) {
                        config.items.push({
                            id: 'USER_ORGUNIT_GRANDCHILDREN',
                            name: ''
                        });
                    }
                }
                else {
                    for (let i = 0; i < r.length; i++) {
                        config.items.push({id: r[i].data.id});
                    }
                }
            }
            else if (toolMenu.menuValue === 'level') {
                const levels = organisationUnitLevel.getValue();
                const maxLevel = arrayMax(levels);

                for (let i = 0; i < levels.length; i++) {
                    config.items.push({
                        id: 'LEVEL-' + levels[i],
                        name: ''
                    });
                }

                for (let i = 0, item; i < r.length; i++) {
                    item = r[i].data;

                    if (maxLevel && item.depth > maxLevel) {
                        gis.alert(GIS.i18n.you_can_not_select_organisation_units_below_the_selected_level + ' (' + item.name + ')');
                        return null;
                    }

                    config.items.push({
                        id: item.id,
                        name: ''
                    });
                }
            }
            else if (toolMenu.menuValue === 'group') {
                const groupIds = organisationUnitGroup.getValue();

                for (let i = 0; i < groupIds.length; i++) {
                    config.items.push({
                        id: 'OU_GROUP-' + groupIds[i],
                        name: ''
                    });
                }

                for (let i = 0; i < r.length; i++) {
                    config.items.push({
                        id: r[i].data.id,
                        name: ''
                    });
                }
            }

            return config.items.length ? config : null;
        },
        listeners: {
            beforeitemexpand() {
                if (!treePanel.isPending) {
                    treePanel.recordsToRestore = treePanel.getSelectionModel().getSelection();
                }
            },
            itemexpand() {
                if (!treePanel.isPending && treePanel.recordsToRestore.length) {
                    treePanel.getSelectionModel().select(treePanel.recordsToRestore);
                    treePanel.recordsToRestore = [];
                }
            },
            render() {
                this.rendered = true;
            },
            afterrender() {
                if (this.getRootNode().getChildAt(0)) {
                    this.getSelectionModel().select(0);
                }
            },
            itemcontextmenu(v, r, h, i, e) {
                e.stopEvent();

                v.getSelectionModel().select(r, false);

                if (v.menu) {
                    v.menu.destroy();
                }
                v.menu = Ext.create('Ext.menu.Menu', {
                    showSeparator: false,
                    shadow: false
                });
                if (!r.data.leaf) {
                    v.menu.add({
                        text: GIS.i18n.select_sub_units,
                        icon: 'images/node-select-child.png',
                        handler: function() {
                            r.expand(false, function() {
                                v.getSelectionModel().select(r.childNodes, true);
                                v.getSelectionModel().deselect(r);
                            });
                        }
                    });
                }
                else {
                    return;
                }

                v.menu.showAt(e.xy);
            }
        }
    });

    const userOrganisationUnit = Ext.create('Ext.form.field.Checkbox', {
        columnWidth: 0.3,
        style: 'padding-top: 2px; padding-left: 3px; margin-bottom: 0',
        boxLabelCls: 'x-form-cb-label-alt1',
        boxLabel: GIS.i18n.user_ou,
        labelWidth: gis.conf.layout.form_label_width,
        handler(chb, checked) {
            treePanel.xable([checked, userOrganisationUnitChildren.getValue(), userOrganisationUnitGrandChildren.getValue()]);
        }
    });

    const userOrganisationUnitChildren = Ext.create('Ext.form.field.Checkbox', {
        columnWidth: 0.33,
        style: 'padding-top: 2px; margin-bottom: 0',
        boxLabelCls: 'x-form-cb-label-alt1',
        boxLabel: GIS.i18n.sub_units,
        labelWidth: gis.conf.layout.form_label_width,
        handler(chb, checked) {
            treePanel.xable([checked, userOrganisationUnit.getValue(), userOrganisationUnitGrandChildren.getValue()]);
        }
    });

    const userOrganisationUnitGrandChildren = Ext.create('Ext.form.field.Checkbox', {
        columnWidth: 0.34,
        style: 'padding-top: 2px; margin-bottom: 0',
        boxLabelCls: 'x-form-cb-label-alt1',
        boxLabel: GIS.i18n.sub_x2_units,
        labelWidth: gis.conf.layout.form_label_width,
        handler(chb, checked) {
            treePanel.xable([checked, userOrganisationUnit.getValue(), userOrganisationUnitChildren.getValue()]);
        }
    });

    const organisationUnitLevel = Ext.create('Ext.form.field.ComboBox', {
        cls: 'gis-combo',
        multiSelect: true,
        style: 'margin-bottom:0',
        width: gis.conf.layout.widget.item_width - 37,
        valueField: 'level',
        displayField: 'name',
        emptyText: GIS.i18n.select_organisation_unit_levels,
        editable: false,
        store: {
            fields: ['id', 'name', 'level'],
            data: gis.init.organisationUnitLevels
        },
        listeners: {
            added() {
                this.reset();
            }
        },
        reset() { // Set second org.unit level as default
            const secondLevel = this.getStore().getAt(1);
            if (secondLevel) {
                this.setValue(secondLevel);
            }
        }
    });

    const organisationUnitGroup = Ext.create('Ext.form.field.ComboBox', {
        cls: 'gis-combo',
        multiSelect: true,
        style: 'margin-bottom:0',
        width: gis.conf.layout.widget.item_width - 37,
        valueField: 'id',
        displayField: 'name',
        emptyText: GIS.i18n.select_organisation_unit_groups,
        editable: false,
        store: gis.store.organisationUnitGroup
    });

    const toolMenu = Ext.create('Ext.menu.Menu', {
        shadow: false,
        showSeparator: false,
        menuValue: 'level',
        clickHandler(param) {
            if (!param) {
                return;
            }

            const items = this.items.items;

            this.menuValue = param;

            // Menu item icon cls
            for (let i = 0; i < items.length; i++) {
                if (items[i].setIconCls) {
                    if (items[i].param === param) {
                        items[i].setIconCls('gis-menu-item-selected');
                    }
                    else {
                        items[i].setIconCls('gis-menu-item-unselected');
                    }
                }
            }

            // Gui
            if (param === 'orgunit') {
                userOrganisationUnit.show();
                userOrganisationUnitChildren.show();
                userOrganisationUnitGrandChildren.show();
                organisationUnitLevel.hide();
                organisationUnitGroup.hide();

                if (userOrganisationUnit.getValue() || userOrganisationUnitChildren.getValue()) {
                    treePanel.disable();
                }
            }
            else if (param === 'level') {
                userOrganisationUnit.hide();
                userOrganisationUnitChildren.hide();
                userOrganisationUnitGrandChildren.hide();
                organisationUnitLevel.show();
                organisationUnitGroup.hide();
                treePanel.enable();
            }
            else if (param === 'group') {
                userOrganisationUnit.hide();
                userOrganisationUnitChildren.hide();
                userOrganisationUnitGrandChildren.hide();
                organisationUnitLevel.hide();
                organisationUnitGroup.show();
                treePanel.enable();
            }
        },
        items: [
            {
                xtype: 'label',
                text: GIS.i18n.selection_mode,
                style: 'padding:7px 5px 5px 7px; font-weight:bold; border:0 none'
            },
            {
                text: GIS.i18n.select_organisation_units + '&nbsp;&nbsp;',
                param: 'orgunit',
                iconCls: 'gis-menu-item-selected'
            },
            {
                text: GIS.i18n.select_levels + '&nbsp;&nbsp;',
                param: 'level',
                iconCls: 'gis-menu-item-unselected'
            },
            {
                text: GIS.i18n.select_groups + '&nbsp;&nbsp;',
                param: 'group',
                iconCls: 'gis-menu-item-unselected'
            }
        ],
        listeners: {
            afterrender() {
                this.getEl().addCls('gis-btn-menu');
            },
            click(menu, item) {
                this.clickHandler(item.param);
            }
        }
    });

    const tool = Ext.create('Ext.button.Button', {
        cls: 'gis-button-organisationunitselection',
        iconCls: 'gis-button-icon-gear',
        width: 36,
        height: 24,
        menu: toolMenu
    });

    const toolPanel = Ext.create('Ext.panel.Panel', {
        width: 36,
        bodyStyle: 'border:0 none; text-align:right',
        style: 'margin-right:1px',
        items: tool
    });

    const organisationUnit = Ext.create('Ext.panel.Panel', {
        title: '<div class="ns-panel-title-data">' + GIS.i18n.organisation_units + '</div>',
        hideCollapseTool: true,
        items: [
            {
                layout: 'column',
                bodyStyle: 'border:0 none',
                style: 'padding-bottom:1px',
                items: [
                    toolPanel,
                    {
                        layout: 'column',
                        bodyStyle: 'border:0 none',
                        items: [
                            userOrganisationUnit,
                            userOrganisationUnitChildren,
                            userOrganisationUnitGrandChildren,
                            organisationUnitLevel,
                            organisationUnitGroup
                        ]
                    }
                ]
            },
            treePanel
        ],
        listeners: {
            added() {
                accordionPanels.push(this);
            }
        }
    });

    const legendType = Ext.create('Ext.form.field.ComboBox', {
        cls: 'gis-combo',
        fieldLabel: GIS.i18n.legend_type,
        labelWidth: gis.conf.layout.widget.itemlabel_width,
        editable: false,
        valueField: 'id',
        displayField: 'name',
        queryMode: 'local',
        value: 'automatic',
        width: gis.conf.layout.widget.item_width,
        store: Ext.create('Ext.data.ArrayStore', {
            fields: ['id', 'name'],
            data: [
                ['automatic', GIS.i18n.automatic],
                ['predefined', GIS.i18n.predefined]
            ]
        }),
        listeners: {
            select() {
                legendTypeToggler(this.getValue());
            }
        }
    });

    const legendSet = Ext.create('Ext.form.field.ComboBox', {
        cls: 'gis-combo',
        fieldLabel: GIS.i18n.legendset,
        editable: false,
        valueField: 'id',
        displayField: 'name',
        width: gis.conf.layout.widget.item_width,
        labelWidth: gis.conf.layout.widget.itemlabel_width,
        hidden: true,
        store: gis.store.legendSets
    });

    const classes = Ext.create('Ext.form.field.Number', {
        cls: 'gis-numberfield',
        editable: false,
        valueField: 'id',
        displayField: 'id',
        queryMode: 'local',
        value: 5,
        //minValue: 1,
        minValue: 3,
        maxValue: 9,
        width: 50,
        fieldStyle: 'height: 24px',
        style: 'margin-right: 1px',
        store: Ext.create('Ext.data.ArrayStore', {
            fields: ['id'],
            data: [[1], [2], [3], [4], [5], [6], [7]]
        }),
        listeners: {
            change(field, value) {
                colorScale.setClasses(value);
            }
        }
    });

    const method = Ext.create('Ext.form.field.ComboBox', {
        cls: 'gis-combo',
        editable: false,
        valueField: 'id',
        displayField: 'name',
        queryMode: 'local',
        width: 137,
        value: 3,
        store: Ext.create('Ext.data.ArrayStore', {
            fields: ['id', 'name'],
            data: [
                [2, GIS.i18n.equal_intervals],
                [3, GIS.i18n.equal_counts]
            ]
        })
    });

    const colorScale = Ext.create('Ext.ux.field.ColorScale', {
        classes: 5,
        // fieldLabel: GIS.i18n.legend_type,
        fieldLabel: 'Color scale',
        labelWidth: gis.conf.layout.widget.itemlabel_width,
        width: gis.conf.layout.widget.item_width,
    });

    const colorLow = Ext.create('Ext.ux.button.ColorButton', {
        style: 'margin-right: 1px',
        width: 137,
        height: 24,
        value: 'ff0000',
        scope: this
    });

    const colorHigh = Ext.create('Ext.ux.button.ColorButton', {
        style: 'margin-right: 1px',
        width: 137,
        height: 24,
        value: '00ff00',
        scope: this
    });

    const radiusLow = Ext.create('Ext.form.field.Number', {
        cls: 'gis-numberfield',
        width: 50,
        allowDecimals: false,
        minValue: 1,
        value: 5
    });

    const radiusHigh = Ext.create('Ext.form.field.Number', {
        cls: 'gis-numberfield',
        width: 50,
        allowDecimals: false,
        minValue: 1,
        value: 15
    });

    const methodPanel = Ext.create('Ext.container.Container', {
        layout: 'hbox',
        height: 25,
        bodyStyle: 'border: 0 none; margin-bottom:1px',
        items: [
            {
                html: GIS.i18n.classes_method + ':',
                width: 100,
                style: 'padding: 4px 0 0 4px',
                bodyStyle: 'border: 0 none'
            },
            classes,
            method
        ]
    });

    const lowPanelLabel = Ext.create('Ext.panel.Panel', {
        // html: GIS.i18n.low_color_size + ':',
        html: 'Low size:',
        width: 100,
        style: 'padding: 4px 0 0 4px',
        bodyStyle: 'border: 0 none'
    });

    const highPanelLabel = Ext.create('Ext.panel.Panel', {
        html: GIS.i18n.high_color_size + ':',
        html: 'High size:',
        width: 100,
        style: 'padding: 4px 0 0 4px',
        bodyStyle: 'border: 0 none'
    });

    const lowPanel = Ext.create('Ext.container.Container', {
        layout: 'hbox',
        height: 25,
        bodyStyle: 'border: 0 none',
        items: [
            lowPanelLabel,
            //colorLow,
            radiusLow
        ]
    });

    const highPanel = Ext.create('Ext.panel.Panel', {
        layout: 'hbox',
        height: 25,
        bodyStyle: 'border: 0 none',
        items: [
            highPanelLabel,
            //colorHigh,
            radiusHigh
        ]
    });

    const labelPanel = Ext.create('Ext.ux.panel.LabelPanel', {
        bodyStyle: 'border: 0 none; padding-top: 10px;',
        height: 34,
    });

    const aggregationType = Ext.create('Ext.form.field.ComboBox', {
        cls: 'gis-combo',
        style: 'padding-top: 10px;',
        fieldLabel: GIS.i18n.aggregation_type,
        labelWidth: gis.conf.layout.widget.itemlabel_width,
        editable: false,
        valueField: 'id',
        displayField: 'name',
        queryMode: 'local',
        width: gis.conf.layout.widget.item_width,
        store: Ext.create('Ext.data.Store', {
            fields: ['id', 'name'],
            data: [{
                id: 'DEFAULT',
                name: GIS.i18n.by_data_element
            },{
                id: 'COUNT',
                name: GIS.i18n.count
            },{
                id: 'AVERAGE',
                name: GIS.i18n.average
            },{
                id: 'SUM',
                name: GIS.i18n.sum
            },{
                id: 'STDDEV',
                name: GIS.i18n.stddev
            },{
                id: 'VARIANCE',
                name: GIS.i18n.variance
            },{
                id: 'MIN',
                name: GIS.i18n.min
            },{
                id: 'MAX',
                name: GIS.i18n.max
            }]
        })
    });

    const options = Ext.create('Ext.panel.Panel', {
        title: '<div class="ns-panel-title-data">' + GIS.i18n.options + '</div>',
        hideCollapseTool: true,
        items: [
            legendType,
            legendSet,
            methodPanel,
            colorScale,
            lowPanel,
            highPanel,
            labelPanel,
            aggregationType
        ],
        listeners: {
            added() {
                accordionPanels.push(this);
            }
        }
    });

    // Functions

    const reset = function(skipTree) {

        // Item
        layer.item.setValue(false);

        // Layer options
        if (layer.searchWindow) {
            layer.searchWindow.destroy();
            layer.searchWindow = null;
        }
        if (layer.filterWindow) {
            layer.filterWindow.destroy();
            layer.filterWindow = null;
        }

        // Components
        if (!layer.window.isRendered) {
            layer.view = null;
            return;
        }

        valueType.reset();
        valueTypeToggler(dimConf.indicator.objectName);

        indicatorGroup.clearValue();
        indicator.clearValue();
        indicator.store.removeAll();

        dataElementGroup.clearValue();
        dataElement.clearValue();
        dataElement.store.removeAll();

        dataSet.clearValue();
        dataSet.store.removeAll();

        periodType.clearValue();
        period.clearValue();
        period.store.removeAll();

        legendType.reset();
        legendTypeToggler('automatic');
        legendSet.clearValue();
        legendSet.store.removeAll();

        classes.reset();
        method.reset();
        colorLow.reset();
        colorHigh.reset();
        radiusLow.reset();
        radiusHigh.reset();

        aggregationType.reset();

        toolMenu.clickHandler(toolMenu.menuValue);

        if (!skipTree) {
            treePanel.reset();
        }

        userOrganisationUnit.setValue(false);
        userOrganisationUnitChildren.setValue(false);
        userOrganisationUnitGrandChildren.setValue(false);

        organisationUnitLevel.reset();
        organisationUnitGroup.clearValue();
    };

    const setGui = function(view, isDrillDown) {
        const dxDim = view.columns[0];
        const peDim = view.filters[0];
        const ouDim = view.rows[0];

        const itemTypeCmpMap = {
            'INDICATOR': indicator,
            'DATA_ELEMENT': dataElement,
            'DATA_ELEMENT_OPERAND': dataElement,
            'REPORTING_RATE': dataSet,
            'PROGRAM_DATA_ELEMENT': eventDataItem,
            'PROGRAM_ATTRIBUTE': eventDataItem,
            'PROGRAM_INDICATOR': programIndicator
        };

        const itemTypeObjectNameMap = {
            'INDICATOR': dimConf.indicator.objectName,
            'DATA_ELEMENT': dimConf.dataElement.objectName,
            'DATA_ELEMENT_OPERAND': dimConf.operand.objectName,
            'REPORTING_RATE': dimConf.dataSet.objectName,
            'PROGRAM_DATA_ELEMENT': dimConf.eventDataItem.objectName,
            'PROGRAM_ATTRIBUTE': dimConf.eventDataItem.objectName,
            'PROGRAM_INDICATOR': dimConf.programIndicator.objectName
        };

        const objectNameMap = {};
        const legendtype_predefined = gis.conf.finals.widget.legendtype_predefined;
        const legendtype_automatic = gis.conf.finals.widget.legendtype_automatic;

        let isOu = false;
        let isOuc = false;
        let isOugc = false;

        const levels = [];
        const groups = [];
        const objectNameProgramCmpMap = {};

        objectNameMap[dimConf.indicator.objectName] = dimConf.indicator.objectName;
        objectNameMap[dimConf.dataElement.objectName] = dimConf.dataElement.objectName;
        objectNameMap[dimConf.operand.objectName] = dimConf.dataElement.objectName;
        objectNameMap[dimConf.dataSet.objectName] = dimConf.dataSet.objectName;
        objectNameMap[dimConf.eventDataItem.objectName] = dimConf.eventDataItem.objectName;
        objectNameMap[dimConf.programIndicator.objectName] = dimConf.programIndicator.objectName;

        const dxItemType = dxDim.items[0].dimensionItemType;
        const legType = isObject(view.legendSet) && isString(view.legendSet.id) ? legendtype_predefined : legendtype_automatic;

        const dxCmp = itemTypeCmpMap[dxItemType];
        const dxObjectName = itemTypeObjectNameMap[dxItemType];
            
            //itemTypeCmpMap = {},
        objectNameProgramCmpMap[dimConf.eventDataItem.objectName] = eventDataItemProgram;
        objectNameProgramCmpMap[dimConf.programIndicator.objectName] = programIndicatorProgram;

        const setDxGui = function() {

            // TODO: objectName/dimensionItemType must be sorted
            if (!dxItemType) {
                return;
            }

            // value type
            valueType.setValue(objectNameMap[dxObjectName]);
            valueTypeToggler(dxObjectName);

            if (dxCmp === dataElement) {
                dataElementDetailLevel.setValue(dxObjectName);
            }

            // data
            dxCmp.store.add(dxDim.items[0]);
            dxCmp.setValue(dxDim.items[0].id);
        };

        const setPeGui = function() {
            period.store.add(gis.conf.period.relativePeriodRecordsMap[peDim.items[0].id] ? gis.conf.period.relativePeriodRecordsMap[peDim.items[0].id] : peDim.items[0]);
            period.setValue(peDim.items[0].id);
        };

        const setOuGui = function() {
            for (let i = 0, item; i < ouDim.items.length; i++) {
                item = ouDim.items[i];

                if (item.id === 'USER_ORGUNIT') {
                    isOu = true;
                }
                else if (item.id === 'USER_ORGUNIT_CHILDREN') {
                    isOuc = true;
                }
                else if (item.id === 'USER_ORGUNIT_GRANDCHILDREN') {
                    isOugc = true;
                }
                else if (item.id.substr(0,5) === 'LEVEL') {
                    levels.push(parseInt(item.id.split('-')[1]));
                }
                else if (item.id.substr(0,8) === 'OU_GROUP') {
                    groups.push(parseInt(item.id.split('-')[1]));
                }
            }

            if (levels.length) {
                toolMenu.clickHandler('level');
                organisationUnitLevel.setValue(levels);
            }
            else if (groups.length) {
                toolMenu.clickHandler('group');
                organisationUnitGroup.setValue(groups);
            }
            else {
                toolMenu.clickHandler('orgunit');
                userOrganisationUnit.setValue(isOu);
                userOrganisationUnitChildren.setValue(isOuc);
                userOrganisationUnitGrandChildren.setValue(isOugc);
            }

            treePanel.selectGraphMap(view.parentGraphMap);
        };

        const setOptionsGui = function() {
            legendType.setValue(legType);
            legendTypeToggler(legType);

            if (legType === 'automatic') {
                classes.setValue(view.classes);
                method.setValue(view.method);

                if (view.colorScale) { // Pre 2.24 maps don't have color scale
                    colorScale.setScale(view.colorScale);
                }
                colorLow.setValue(view.colorLow);
                colorHigh.setValue(view.colorHigh);
                radiusLow.setValue(view.radiusLow);
                radiusHigh.setValue(view.radiusHigh);
            }
            else if (legType === 'predefined') {
                method.setValue(1);
                legendSet.store.add(view.legendSet);
                legendSet.setValue(view.legendSet.id);
            }

            if (view.aggregationType) {
                aggregationType.setValue(view.aggregationType);
            }
        };

        const setLayer = function() {

            // Layer item
            layer.item.setValue(!view.hidden, view.opacity);

            // Layer menu
            layer.menu.enableItems();

            // Filter
            if (layer.filterWindow && layer.filterWindow.isVisible()) {
                layer.filterWindow.filter();
            }
        };

        const init = function() {
            if (!layer.window.isRendered) {
                return;
            }

            if (!isDrillDown) {
                reset(true);
                setDxGui();
                setPeGui();
                setOptionsGui();
            }

            setOuGui();
            setLayer();

            // labels
            labelPanel.setConfig(view);
        }();
    };

    const getView = function(config) {
        const in_ = dimConf.indicator.objectName;
        const de = dimConf.dataElement.objectName;
        const dc = dimConf.operand.objectName;
        const ds = dimConf.dataSet.objectName;
        const di = dimConf.eventDataItem.objectName;
        const pi = dimConf.programIndicator.objectName;
        const objectNameCmpMap = {};
        const objectNameItemTypeMap = {};
        const view = {};

        const dxObjectName = valueType.getValue() === de ? dataElementDetailLevel.getValue() : valueType.getValue();

        objectNameCmpMap[in_] = indicator;
        objectNameCmpMap[de] = dataElement;
        objectNameCmpMap[dc] = dataElement;
        objectNameCmpMap[ds] = dataSet;
        objectNameCmpMap[di] = eventDataItem;
        objectNameCmpMap[pi] = programIndicator;

        objectNameItemTypeMap[dimConf.indicator.objectName] = 'INDICATOR';
        objectNameItemTypeMap[dimConf.dataElement.objectName] = 'DATA_ELEMENT';
        objectNameItemTypeMap[dimConf.dataSet.objectName] = 'REPORTING_RATE';
        objectNameItemTypeMap[dimConf.eventDataItem.objectName] = 'PROGRAM_DATA_ELEMENT';
        objectNameItemTypeMap[dimConf.programIndicator.objectName] = 'PROGRAM_ATTRIBUTE';

        const dxItemType = objectNameItemTypeMap[dxObjectName];

        // id
        view.layer = layer.id;

        // value type
        view.valueType = dxObjectName;

        // dx
        if (objectNameCmpMap[dxObjectName].getValue()) {
            view.columns = [{
                dimension: 'dx',
                objectName: dxObjectName,
                items: [{
                    id: objectNameCmpMap[dxObjectName].getValue(),
                    dimensionItemType: dxItemType
                }]
            }];
        }

        // program
        if (dxObjectName === di && eventDataItemProgram.getValue()) {
            view.program = {id: eventDataItemProgram.getValue()};
        }
        else if (dxObjectName === pi && programIndicatorProgram.getValue()) {
            view.program = {id: programIndicatorProgram.getValue()};
        }

        // ou
        if (treePanel.getDimension()) {
            view.rows = [treePanel.getDimension()];
        } else {
            return;
        }

        // pe
        if (period.getValue()) {
            view.filters = [{
                dimension: dimConf.period.objectName,
                items: [{
                    id: period.getValue()
                }]
            }];
        } else {
            gis.alert(GIS.i18n.no_period_selected);
            return;
        }

        // options
        view.classes = parseInt(classes.getValue());


        view.method = legendType.getValue() === 'predefined' ? 1 : parseInt(method.getValue());

        view.colorLow = colorLow.getValue();
        view.colorHigh = colorHigh.getValue();
        view.radiusLow = parseInt(radiusLow.getValue());
        view.radiusHigh = parseInt(radiusHigh.getValue());
        view.opacity = layer.layerOpacity;
        view.aggregationType = aggregationType.getValue();

        if (view.method !== 1) {
            view.colorScale = colorScale.getValue().join();
        }

        Ext.apply(view, labelPanel.getConfig());

        // legend
        if (legendType.getValue() === gis.conf.finals.widget.legendtype_predefined && legendSet.getValue()) {
            view.legendSet = {
                id: legendSet.getValue()
            };
        }

        return gis.api.layout.Layout(view);
    };

    const accordionBody = Ext.create('Ext.panel.Panel', {
        layout: 'accordion',
        activeOnTop: true,
        cls: 'ns-accordion',
        bodyStyle: 'border:0 none; margin-bottom:1px',
        height: 410,
        items: function() {
            const panels = [
                data,
                organisationUnit,
                options
            ];

            panels[panels.length - 1].cls = 'ns-accordion-last'; // TODO: Always legend?

            return panels;
        }(),
        listeners: {
            afterrender() { // nasty workaround
                for (let i = accordionPanels.length - 1; i >= 0; i--) {
                    accordionPanels[i].expand();
                }
            }
        }
    });

    const accordion = Ext.create('Ext.panel.Panel', {
        bodyStyle: 'border-style:none; padding:1px; padding-bottom:0',
        items: accordionBody,
        panels: accordionPanels,

        map: layer.map,
        layer: layer,
        menu: layer.menu,

        reset: reset,
        setGui: setGui,
        getView: getView,
        getParentGraphMap() {
            return treePanel.getParentGraphMap();
        },

        infrastructuralDataElementValuesStore: infrastructuralDataElementValuesStore,
        setThisHeight(mx) {
            return 450;
        },
        getExpandedPanel() {
            for (let i = 0; i < this.panels.length; i++) {
                if (!this.panels[i].collapsed) {
                    return this.panels[i];
                }
            }

            return null;
        },
        getFirstPanel() {
            return this.panels[0];
        },
        listeners: {
            added() {
                layer.accordion = this;
            },
            render() {
                toolMenu.clickHandler('level');
            }
        }
    });

    return accordion;
};
