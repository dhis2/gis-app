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

    var indicatorsByGroupStore,
        dataElementsByGroupStore,
        dataSetStore,
        programStore,
        eventDataItemAvailableStore,
        programIndicatorAvailableStore,
        periodsByTypeStore,
        infrastructuralDataElementValuesStore,
        legendsByLegendSetStore,

        valueTypeToggler,
        legendTypeToggler,

        valueType,
        indicatorGroup,
        indicator,
        dataElementGroup,
        dataElement,
        dataElementDetailLevel,
        dataElementPanel,
        dataSet,
        onEventDataItemProgramSelect,
        eventDataItemProgram,
        eventDataItem,
        onProgramIndicatorProgramSelect,
        programIndicatorProgram,
        programIndicator,
        onPeriodTypeSelect,
        periodType,
        period,
        periodPrev,
        periodNext,
        periodTypePanel,
        data,

        treePanel,
        userOrganisationUnit,
        userOrganisationUnitChildren,
        userOrganisationUnitGrandChildren,
        organisationUnitLevel,
        organisationUnitGroup,
        toolMenu,
        tool,
        toolPanel,
        organisationUnit,

        legendType,
        legendSet,
        classes,
        method,
        colorsCombo,
        colorLow,
        colorHigh,
        radiusLow,
        radiusHigh,
        methodPanel,
        lowPanelLabel,
        highPanelLabel,
        lowPanel,
        highPanel,
        legend,

        labelPanel,

        reset,
        setGui,
        getView,

        accordionBody,
        accordion,

        accordionPanels = [],
        dimConf = gis.conf.finals.dimension,

        last;


    // Stores

    indicatorsByGroupStore = Ext.create('Ext.data.Store', {
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
        loadFn: function(fn) {
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

    dataElementsByGroupStore = Ext.create('Ext.data.Store', {
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
        loadFn: function(fn) {
            if (this.isLoaded) {
                fn.call();
            }
            else {
                this.load(fn);
            }
        },
        sortStore: function() {
            this.sort('name', 'ASC');
        },
        setTotalsProxy: function(uid, preventLoad, callbackFn) {
            var path;

            if (isString(uid)) {
                path = '/dataElements.json?fields=dimensionItem|rename(id),' + gis.init.namePropertyUrl + '&domainType=aggregate&paging=false&filter=dataElementGroups.id:eq:' + uid;
            }
            else if (uid === 0) {
                path = '/dataElements.json?fields=dimensionItem|rename(id),' + gis.init.namePropertyUrl + '&domainType=aggregate&paging=false';
            }

            if (!path) {
                alert('Invalid parameter');
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
        setDetailsProxy: function(uid, preventLoad, callbackFn) {
            if (isString(uid)) {
                this.setProxy({
                    type: 'ajax',
                    url: encodeURI(gis.init.contextPath + '/api/dataElementOperands.json?fields=id,' + gis.init.namePropertyUrl + '&paging=false&filter=dataElement.dataElementGroups.id:eq:' + uid),
                    reader: {
                        type: 'json',
                        root: 'dataElementOperands'
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
            }
            else {
                alert('Invalid parameter');
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

    dataSetStore = Ext.create('Ext.data.Store', {
        fields: ['id', 'name'],
        proxy: {
            type: 'ajax',
            url: encodeURI(gis.init.contextPath + '/api/dataSets.json?fields=dimensionItem|rename(id),' + gis.init.namePropertyUrl + '&paging=false'),
            reader: {
                type: 'json',
                root: 'dataSets'
            }
        },
        sortStore: function() {
            this.sort('name', 'ASC');
        },
        isLoaded: false,
        listeners: {
            load: function(s) {
                this.isLoaded = true;
            }
        }
    });

    programStore = Ext.create('Ext.data.Store', {
        fields: ['id', 'name'],
        proxy: {
            type: 'ajax',
            url: encodeURI(gis.init.contextPath + '/api/programs.json?fields=id,displayName|rename(name)&paging=false'),
            reader: {
                type: 'json',
                root: 'programs'
            },
            pageParam: false,
            startParam: false,
            limitParam: false
        }
    });

    eventDataItemAvailableStore = Ext.create('Ext.data.Store', {
        fields: ['id', 'name'],
        data: [],
        sortStore: function() {
            this.sort('name', 'ASC');
        },
        loadDataAndUpdate: function(data, append) {
            this.clearFilter(); // work around
            this.loadData(data, append);
            this.updateFilter();
        },
        getRecordsByIds: function(ids) {
            var records = [];

            ids = arrayFrom(ids);

            for (var i = 0, index; i < ids.length; i++) {
                index = this.findExact('id', ids[i]);

                if (index !== -1) {
                    records.push(this.getAt(index));
                }
            }

            return records;
        },
        updateFilter: function() {
            var selectedStoreIds = dataSelectedStore.getIds();

            this.clearFilter();

            this.filterBy(function(record) {
                return !arrayContains(selectedStoreIds, record.data.id);
            });
        }
    });

    programIndicatorAvailableStore = Ext.create('Ext.data.Store', {
        fields: ['id', 'name'],
        data: [],
        sortStore: function() {
            this.sort('name', 'ASC');
        },
        loadDataAndUpdate: function(data, append) {
            this.clearFilter(); // work around
            this.loadData(data, append);
            this.updateFilter();
        },
        getRecordsByIds: function(ids) {
            var records = [];

            ids = arrayFrom(ids);

            for (var i = 0, index; i < ids.length; i++) {
                index = this.findExact('id', ids[i]);

                if (index !== -1) {
                    records.push(this.getAt(index));
                }
            }

            return records;
        },
        updateFilter: function() {
            var selectedStoreIds = dataSelectedStore.getIds();

            this.clearFilter();

            this.filterBy(function(record) {
                return !arrayContains(selectedStoreIds, record.data.id);
            });
        }
    });

    periodsByTypeStore = Ext.create('Ext.data.Store', {
        fields: ['id', 'name', 'index'],
        data: [],
        setIndex: function(periods) {
            for (var i = 0; i < periods.length; i++) {
                periods[i].index = i;
            }
        },
        sortStore: function() {
            this.sort('index', 'ASC');
        }
    });

    infrastructuralDataElementValuesStore = Ext.create('Ext.data.Store', {
        fields: ['name', 'value'],
        sorters: [{
            property: 'name',
            direction: 'ASC'
        }]
    });

    legendsByLegendSetStore = Ext.create('Ext.data.Store', {
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
        loadFn: function(fn) {
            if (this.isLoaded) {
                fn.call();
            }
            else {
                this.load(fn);
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

    // Togglers

    valueTypeToggler = function(valueType) {
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

    legendTypeToggler = function(legendType) {
        if (legendType === 'automatic') {
            methodPanel.show();
            colorLow.enable();
            lowPanelLabel.update(GIS.i18n.low_color_size + ':');
            colorHigh.enable();
            highPanelLabel.update(GIS.i18n.high_color_size + ':');
            legendSet.hide();
        }
        else if (legendType === 'predefined') {
            methodPanel.hide();
            colorLow.disable();
            lowPanelLabel.update(GIS.i18n.low_size + ':');
            colorHigh.disable();
            highPanelLabel.update(GIS.i18n.high_size + ':');
            legendSet.show();
        }
    };

    // Components

    valueType = Ext.create('Ext.form.field.ComboBox', {
        cls: 'gis-combo',
        fieldLabel: GIS.i18n.value_type,
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
            select: function() {
                valueTypeToggler(this.getValue());
            }
        }
    });

    indicatorGroup = Ext.create('Ext.form.field.ComboBox', {
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
            select: function() {
                indicator.clearValue();

                indicator.store.proxy.url = encodeURI(gis.init.contextPath + '/api/indicators.json?fields=dimensionItem|rename(id),' + gis.init.namePropertyUrl + '&paging=false&filter=indicatorGroups.id:eq:' + this.getValue());
                indicator.store.load();
            }
        }
    });

    indicator = Ext.create('Ext.form.field.ComboBox', {
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
            select: function(cb) {
                Ext.Ajax.request({
                    url: encodeURI(gis.init.contextPath + '/api/indicators.json?fields=legendSet[id]&paging=false&filter=id:eq:' + this.getValue()),
                    success: function(r) {
                        var set = JSON.parse(r.responseText).indicators[0].legendSet;

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

    dataElementGroup = Ext.create('Ext.form.field.ComboBox', {
        cls: 'gis-combo',
        fieldLabel: GIS.i18n.dataelement_group,
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
        loadAvailable: function(preventLoad) {
            var store = dataElementsByGroupStore,
                detailLevel = dataElementDetailLevel.getValue(),
                value = this.getValue();

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
            select: function(cb) {
                dataElement.clearValue();
                cb.loadAvailable();
            }
        }
    });

    dataElement = Ext.create('Ext.form.field.ComboBox', {
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
            select: function() {
                var id = this.getValue(),
                    index = id.indexOf('.');

                if (index !== -1) {
                    id = id.substr(0, index);
                }

                Ext.Ajax.request({
                    url: encodeURI(gis.init.contextPath + '/api/dataElements.json?fields=legendSet[id]&paging=false&filter=id:eq:' + id),
                    success: function(r) {
                        var set = JSON.parse(r.responseText).dataElements[0].legendSet;

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

    dataElementDetailLevel = Ext.create('Ext.form.field.ComboBox', {
        cls: 'gis-combo',
        style: 'margin-left:1px',
        queryMode: 'local',
        editable: false,
        valueField: 'id',
        displayField: 'text',
        width: 65 - 1,
        value: dimConf.dataElement.objectName,
        onSelect: function() {
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
            select: function(cb) {
                cb.onSelect();
            }
        }
    });

    dataElementPanel = Ext.create('Ext.container.Container', {
        layout: 'column',
        bodyStyle: 'border:0 none',
        hidden: true,
        items: [
            dataElement,
            dataElementDetailLevel
        ]
    });

    dataSet = Ext.create('Ext.form.field.ComboBox', {
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
            select: function(cb) {
                Ext.Ajax.request({
                    url: encodeURI(gis.init.contextPath + '/api/dataSets.json?fields=legendSet[id]&paging=false&filter=id:eq:' + this.getValue()),
                    success: function(r) {
                        var set = JSON.parse(r.responseText).dataSets[0].legendSet;

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

    onEventDataItemProgramSelect = function(programId) {
        eventDataItem.clearValue();

        Ext.Ajax.request({
            url: encodeURI(gis.init.contextPath + '/api/programDataElements.json?program=' + programId + '&fields=dimensionItem|rename(id),' + gis.init.namePropertyUrl + ',valueType&paging=false'),
            disableCaching: false,
            success: function(r) {
                var types = gis.conf.valueType.aggregateTypes,
                    elements = Ext.decode(r.responseText).programDataElements.filter(function(item) {
                        return arrayContains(types, (item || {}).valueType);
                    });

                Ext.Ajax.request({
                    url: encodeURI(gis.init.contextPath + '/api/programs.json?filter=id:eq:' + programId + '&fields=programTrackedEntityAttributes[dimensionItem|rename(id),' + gis.init.namePropertyUrl + ',valueType]&paging=false'),
                    disableCaching: false,
                    success: function(r) {
                        var attributes = ((Ext.decode(r.responseText).programs[0] || {}).programTrackedEntityAttributes || []).filter(function(item) {
                                return arrayContains(types, (item || {}).valueType);
                            }),
                            data = arraySort(arrayClean([].concat(elements, attributes))) || [];

                        eventDataItemAvailableStore.loadData(data);
                    }
                });
            }
        });



      

        //Ext.Ajax.request({
            //url: encodeURI(gis.init.contextPath + '/api/programs.json?paging=false&fields=programTrackedEntityAttributes[trackedEntityAttribute[id,displayName|rename(name),valueType]],programStages[programStageDataElements[dataElement[id,' + gis.init.namePropertyUrl + ',valueType]]]&filter=id:eq:' + programId),
            //success: function(r) {
                //r = JSON.parse(r.responseText);

                //var isA = isArray,
                    //isO = isObject,
                    //program = isA(r.programs) && r.programs.length ? r.programs[0] : null,
                    //stages = isO(program) && isA(program.programStages) && program.programStages.length ? program.programStages : [],
                    //teas = isO(program) && isA(program.programTrackedEntityAttributes) ? arrayPluck(program.programTrackedEntityAttributes, 'trackedEntityAttribute') : [],
                    //dataElements = [],
                    //attributes = [],
                    //types = gis.conf.valueType.aggregateTypes,
                    //data;

                //// data elements
                //for (var i = 0, stage, elements; i < stages.length; i++) {
                    //stage = stages[i];

                    //if (isA(stage.programStageDataElements) && stage.programStageDataElements.length) {
                        //elements = arrayPluck(stage.programStageDataElements, 'dataElement') || [];

                        //for (var j = 0; j < elements.length; j++) {
                            //if (arrayContains(types, elements[j].valueType)) {
                                //dataElements.push(elements[j]);
                            //}
                        //}
                    //}
                //}

                //// attributes
                //for (i = 0; i < teas.length; i++) {
                    //if (arrayContains(types, teas[i].valueType)) {
                        //attributes.push(teas[i]);
                    //}
                //}

                //data = gis.util.array.sort(arrayClean([].concat(dataElements, attributes))) || [];

                //eventDataItemAvailableStore.loadData(data);
            //}
        //});

    };

    eventDataItemProgram = Ext.create('Ext.form.field.ComboBox', {
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
            select: function(cb) {
                onEventDataItemProgramSelect(cb.getValue());
            }
        }
    });

    eventDataItem = Ext.create('Ext.form.field.ComboBox', {
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

    onProgramIndicatorProgramSelect = function(programId) {
        programIndicator.clearValue();

        Ext.Ajax.request({
            url: encodeURI(gis.init.contextPath + '/api/programs.json?paging=false&fields=programIndicators[dimensionItem|rename(id),displayName|rename(name)]&filter=id:eq:' + programId),
            success: function(r) {
                r = JSON.parse(r.responseText);

                var isA = isArray,
                    isO = isObject,
                    program = isA(r.programs) && r.programs.length ? r.programs[0] : null,
                    programIndicators = isO(program) && isA(program.programIndicators) && program.programIndicators.length ? program.programIndicators : [],
                    data = gis.util.array.sort(arrayClean(programIndicators)) || [];

                programIndicatorAvailableStore.loadData(data);
            }
        });

    };

    programIndicatorProgram = Ext.create('Ext.form.field.ComboBox', {
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
            select: function(cb) {
                onProgramIndicatorProgramSelect(cb.getValue());
            }
        }
    });

    programIndicator = Ext.create('Ext.form.field.ComboBox', {
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

    onPeriodTypeSelect = function() {
        var type = periodType.getValue(),
            periodOffset = periodType.periodOffset,
            generator = gis.init.periodGenerator,
            periods;

        if (type === 'relativePeriods') {
            periodsByTypeStore.loadData(gis.conf.period.relativePeriods);

            periodPrev.disable();
            periodNext.disable();
        }
        else {
            periods = generator.generateReversedPeriods(type, type === 'Yearly' ? periodOffset - 5 : periodOffset);

            for (var i = 0; i < periods.length; i++) {
                periods[i].id = periods[i].iso;
            }

            periodsByTypeStore.setIndex(periods);
            periodsByTypeStore.loadData(periods);

            periodPrev.enable();
            periodNext.enable();
        }

        period.selectFirst();
    };

    periodType = Ext.create('Ext.form.field.ComboBox', {
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
            select: function() {
                periodType.periodOffset = 0;
                onPeriodTypeSelect();
            }
        }
    });

    period = Ext.create('Ext.form.field.ComboBox', {
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
        selectFirst: function() {
            this.setValue(this.store.getAt(0).data.id);
        }
    });

    periodPrev = Ext.create('Ext.button.Button', {
        xtype: 'button',
        text: '<',
        width: 22,
        height: 24,
        style: 'margin-left: 1px',
        handler: function() {
            if (periodType.getValue()) {
                periodType.periodOffset--;
                onPeriodTypeSelect();
            }
        }
    });

    periodNext = Ext.create('Ext.button.Button', {
        xtype: 'button',
        text: '>',
        width: 22,
        height: 24,
        style: 'margin-left: 1px',
        scope: this,
        handler: function() {
            if (periodType.getValue()) {
                periodType.periodOffset++;
                onPeriodTypeSelect();
            }
        }
    });

    periodTypePanel = Ext.create('Ext.panel.Panel', {
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

    data = Ext.create('Ext.panel.Panel', {
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
            added: function() {
                accordionPanels.push(this);
            }
        }
    });


    treePanel = Ext.create('Ext.tree.Panel', {
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
        reset: function() {
            var rootNode = this.getRootNode().findChild('id', gis.init.rootNodes[0].id);
            this.collapseAll();
            this.expandPath(rootNode.getPath());
            this.getSelectionModel().select(rootNode);
        },
        selectRootIf: function() {
            if (this.getSelectionModel().getSelection().length < 1) {
                var node = this.getRootNode().findChild('id', gis.init.rootNodes[0].id);
                if (this.rendered) {
                    this.getSelectionModel().select(node);
                }
                return node;
            }
        },
        isPending: false,
        recordsToSelect: [],
        recordsToRestore: [],
        multipleSelectIf: function(map, doUpdate) {
            if (this.recordsToSelect.length === gis.util.object.getLength(map)) {
                this.getSelectionModel().select(this.recordsToSelect);
                this.recordsToSelect = [];
                this.isPending = false;

                if (doUpdate) {
                    update();
                }
            }
        },
        multipleExpand: function(id, map, doUpdate) {
            var that = this,
                rootId = gis.conf.finals.root.id,
                path = map[id],
                record;

            if (path.substr(0, rootId.length + 1) !== ('/' + rootId)) {
                path = '/' + rootId + path;
            }

            that.expandPath(path, 'id', '/', function() {
                record = Ext.clone(that.getRootNode().findChild('id', id, true));
                that.recordsToSelect.push(record);
                that.multipleSelectIf(map, doUpdate);
            });
        },
        select: function(url, params) {
            if (!params) {
                params = {};
            }
            Ext.Ajax.request({
                url: encodeURI(url),
                method: 'GET',
                params: params,
                scope: this,
                success: function(r) {
                    var a = JSON.parse(r.responseText).organisationUnits;
                    this.numberOfRecords = a.length;
                    for (var i = 0; i < a.length; i++) {
                        this.multipleExpand(a[i].id, a[i].path);
                    }
                }
            });
        },
        getParentGraphMap: function() {
            var selection = this.getSelectionModel().getSelection(),
                map = {};

            if (isArray(selection) && selection.length) {
                for (var i = 0, pathArray; i < selection.length; i++) {
                    pathArray = selection[i].getPath().split('/');
                    map[pathArray.pop()] = pathArray.join('/');
                }
            }

            return map;
        },
        selectGraphMap: function(map, update) {
            if (!gis.util.object.getLength(map)) {
                return;
            }

            this.isPending = true;

            for (var key in map) {
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
                url: encodeURI(gis.init.contextPath + '/api/organisationUnits'),
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
                beforeload: function(store, operation) {
                    if (!store.proxy._url) {
                        store.proxy._url = store.proxy.url;
                    }
                    
                    store.proxy.url = store.proxy._url + '/' + operation.node.data.id;
                },
                load: function(store, node, records) {
                    records.forEach(function(record){
                        if (isBoolean(record.data.hasChildren)) {
                            record.set('leaf', !record.data.hasChildren);
                        }
                    });
                }
            }
        }),
        xable: function(values) {
            for (var i = 0; i < values.length; i++) {
                if (!!values[i]) {
                    this.disable();
                    return;
                }
            }

            this.enable();
        },
        getDimension: function() {
            var r = treePanel.getSelectionModel().getSelection(),
                config = {
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
                    for (var i = 0; i < r.length; i++) {
                        config.items.push({id: r[i].data.id});
                    }
                }
            }
            else if (toolMenu.menuValue === 'level') {
                var levels = organisationUnitLevel.getValue(),
                    maxLevel = arrayMax(levels);

                for (var i = 0; i < levels.length; i++) {
                    config.items.push({
                        id: 'LEVEL-' + levels[i],
                        name: ''
                    });
                }

                for (var i = 0, item; i < r.length; i++) {
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
                var groupIds = organisationUnitGroup.getValue();

                for (var i = 0; i < groupIds.length; i++) {
                    config.items.push({
                        id: 'OU_GROUP-' + groupIds[i],
                        name: ''
                    });
                }

                for (var i = 0; i < r.length; i++) {
                    config.items.push({
                        id: r[i].data.id,
                        name: ''
                    });
                }
            }

            return config.items.length ? config : null;
        },
        listeners: {
            beforeitemexpand: function() {
                if (!treePanel.isPending) {
                    treePanel.recordsToRestore = treePanel.getSelectionModel().getSelection();
                }
            },
            itemexpand: function() {
                if (!treePanel.isPending && treePanel.recordsToRestore.length) {
                    treePanel.getSelectionModel().select(treePanel.recordsToRestore);
                    treePanel.recordsToRestore = [];
                }
            },
            render: function() {
                this.rendered = true;
            },
            afterrender: function() {
                this.getSelectionModel().select(0);
            },
            itemcontextmenu: function(v, r, h, i, e) {
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

    userOrganisationUnit = Ext.create('Ext.form.field.Checkbox', {
        columnWidth: 0.3,
        style: 'padding-top: 2px; padding-left: 3px; margin-bottom: 0',
        boxLabelCls: 'x-form-cb-label-alt1',
        boxLabel: GIS.i18n.user_ou,
        labelWidth: gis.conf.layout.form_label_width,
        handler: function(chb, checked) {
            treePanel.xable([checked, userOrganisationUnitChildren.getValue(), userOrganisationUnitGrandChildren.getValue()]);
        }
    });

    userOrganisationUnitChildren = Ext.create('Ext.form.field.Checkbox', {
        columnWidth: 0.33,
        style: 'padding-top: 2px; margin-bottom: 0',
        boxLabelCls: 'x-form-cb-label-alt1',
        boxLabel: GIS.i18n.sub_units,
        labelWidth: gis.conf.layout.form_label_width,
        handler: function(chb, checked) {
            treePanel.xable([checked, userOrganisationUnit.getValue(), userOrganisationUnitGrandChildren.getValue()]);
        }
    });

    userOrganisationUnitGrandChildren = Ext.create('Ext.form.field.Checkbox', {
        columnWidth: 0.34,
        style: 'padding-top: 2px; margin-bottom: 0',
        boxLabelCls: 'x-form-cb-label-alt1',
        boxLabel: GIS.i18n.sub_x2_units,
        labelWidth: gis.conf.layout.form_label_width,
        handler: function(chb, checked) {
            treePanel.xable([checked, userOrganisationUnit.getValue(), userOrganisationUnitChildren.getValue()]);
        }
    });

    organisationUnitLevel = Ext.create('Ext.form.field.ComboBox', {
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
        }
    });

    organisationUnitGroup = Ext.create('Ext.form.field.ComboBox', {
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

    toolMenu = Ext.create('Ext.menu.Menu', {
        shadow: false,
        showSeparator: false,
        menuValue: 'level',
        clickHandler: function(param) {
            if (!param) {
                return;
            }

            var items = this.items.items;
            this.menuValue = param;

            // Menu item icon cls
            for (var i = 0; i < items.length; i++) {
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
            afterrender: function() {
                this.getEl().addCls('gis-btn-menu');
            },
            click: function(menu, item) {
                this.clickHandler(item.param);
            }
        }
    });

    tool = Ext.create('Ext.button.Button', {
        cls: 'gis-button-organisationunitselection',
        iconCls: 'gis-button-icon-gear',
        width: 36,
        height: 24,
        menu: toolMenu
    });

    toolPanel = Ext.create('Ext.panel.Panel', {
        width: 36,
        bodyStyle: 'border:0 none; text-align:right',
        style: 'margin-right:1px',
        items: tool
    });

    organisationUnit = Ext.create('Ext.panel.Panel', {
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
            added: function() {
                accordionPanels.push(this);
            }
        }
    });

    legendType = Ext.create('Ext.form.field.ComboBox', {
        cls: 'gis-combo',
        fieldLabel: GIS.i18n.legend_type,
        labelWidth: gis.conf.layout.widget.itemlabel_width,
        editable: false,
        valueField: 'id',
        displayField: 'name',
        queryMode: 'local',
        value: gis.conf.finals.widget.legendtype_automatic,
        width: gis.conf.layout.widget.item_width,
        store: Ext.create('Ext.data.ArrayStore', {
            fields: ['id', 'name'],
            data: [
                ['automatic', GIS.i18n.automatic],
                ['predefined', GIS.i18n.predefined]
            ]
        }),
        listeners: {
            select: function() {
                legendTypeToggler(this.getValue());
            }
        }
    });

    legendSet = Ext.create('Ext.form.field.ComboBox', {
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

    classes = Ext.create('Ext.form.field.Number', {
        cls: 'gis-numberfield',
        editable: false,
        valueField: 'id',
        displayField: 'id',
        queryMode: 'local',
        value: 5,
        //minValue: 1,
        minValue: 3,
        maxValue: 7,
        width: 50,
        fieldStyle: 'height: 24px',
        style: 'margin-right: 1px',
        store: Ext.create('Ext.data.ArrayStore', {
            fields: ['id'],
            data: [[1], [2], [3], [4], [5], [6], [7]]
        }),
        listeners: {
            change: function(field, value) {
                colorsCombo.setClasses(value);
            }
        }
    });

    method = Ext.create('Ext.form.field.ComboBox', {
        cls: 'gis-combo',
        editable: false,
        valueField: 'id',
        displayField: 'name',
        queryMode: 'local',
        value: 3,
        width: 137,
        store: Ext.create('Ext.data.ArrayStore', {
            fields: ['id', 'name'],
            data: [
                [2, GIS.i18n.equal_intervals],
                [3, GIS.i18n.equal_counts]
            ]
        })
    });

    colorsCombo = Ext.create('Ext.ux.field.ColorRamp', {
        classes: 5,
        // fieldLabel: GIS.i18n.legend_type,
        fieldLabel: 'Color scale',
        labelWidth: gis.conf.layout.widget.itemlabel_width,
        width: gis.conf.layout.widget.item_width,
    });

    colorLow = Ext.create('Ext.ux.button.ColorButton', {
        style: 'margin-right: 1px',
        width: 137,
        height: 24,
        value: 'ff0000',
        scope: this
    });

    colorHigh = Ext.create('Ext.ux.button.ColorButton', {
        style: 'margin-right: 1px',
        width: 137,
        height: 24,
        value: '00ff00',
        scope: this
    });

    radiusLow = Ext.create('Ext.form.field.Number', {
        cls: 'gis-numberfield',
        width: 50,
        allowDecimals: false,
        minValue: 1,
        value: 5
    });

    radiusHigh = Ext.create('Ext.form.field.Number', {
        cls: 'gis-numberfield',
        width: 50,
        allowDecimals: false,
        minValue: 1,
        value: 15
    });

    methodPanel = Ext.create('Ext.container.Container', {
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

    lowPanelLabel = Ext.create('Ext.panel.Panel', {
        // html: GIS.i18n.low_color_size + ':',
        html: 'Low size:',
        width: 100,
        style: 'padding: 4px 0 0 4px',
        bodyStyle: 'border: 0 none'
    });

    highPanelLabel = Ext.create('Ext.panel.Panel', {
        html: GIS.i18n.high_color_size + ':',
        html: 'High size:',
        width: 100,
        style: 'padding: 4px 0 0 4px',
        bodyStyle: 'border: 0 none'
    });

    lowPanel = Ext.create('Ext.container.Container', {
        layout: 'hbox',
        height: 25,
        bodyStyle: 'border: 0 none',
        items: [
            lowPanelLabel,
            //colorLow,
            radiusLow
        ]
    });

    highPanel = Ext.create('Ext.panel.Panel', {
        layout: 'hbox',
        height: 25,
        bodyStyle: 'border: 0 none',
        items: [
            highPanelLabel,
            //colorHigh,
            radiusHigh
        ]
    });

    labelPanel = Ext.create('Ext.ux.panel.LabelPanel', {
        bodyStyle: 'border: 0 none; padding-top: 10px;',
        height: 34,
    });

    legend = Ext.create('Ext.panel.Panel', {
        title: '<div class="ns-panel-title-data">' + GIS.i18n.options + '</div>',
        hideCollapseTool: true,
        items: [
            legendType,
            legendSet,
            methodPanel,
            colorsCombo,
            lowPanel,
            highPanel,
            labelPanel
        ],
        listeners: {
            added: function() {
                accordionPanels.push(this);
            }
        }
    });

    // Functions

    reset = function(skipTree) {

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
        legendTypeToggler(gis.conf.finals.widget.legendtype_automatic);
        legendSet.clearValue();
        legendSet.store.removeAll();

        classes.reset();
        method.reset();
        colorLow.reset();
        colorHigh.reset();
        radiusLow.reset();
        radiusHigh.reset();

        toolMenu.clickHandler(toolMenu.menuValue);

        if (!skipTree) {
            treePanel.reset();
        }

        userOrganisationUnit.setValue(false);
        userOrganisationUnitChildren.setValue(false);
        userOrganisationUnitGrandChildren.setValue(false);

        organisationUnitLevel.clearValue();
        organisationUnitGroup.clearValue();
    };

    setGui = function(view, isDrillDown) {
        var dxDim = view.columns[0],
            peDim = view.filters[0],
            ouDim = view.rows[0],
            itemTypeCmpMap = {
                'INDICATOR': indicator,
                'DATA_ELEMENT': dataElement,
                'DATA_ELEMENT_OPERAND': dataElement,
                'REPORTING_RATE': dataSet,
                'PROGRAM_DATA_ELEMENT': eventDataItem,
                'PROGRAM_ATTRIBUTE': eventDataItem,
                'PROGRAM_INDICATOR': programIndicator
            },
            itemTypeObjectNameMap = {
                'INDICATOR': dimConf.indicator.objectName,
                'DATA_ELEMENT': dimConf.dataElement.objectName,
                'DATA_ELEMENT_OPERAND': dimConf.operand.objectName,
                'REPORTING_RATE': dimConf.dataSet.objectName,
                'PROGRAM_DATA_ELEMENT': dimConf.eventDataItem.objectName,
                'PROGRAM_ATTRIBUTE': dimConf.eventDataItem.objectName,
                'PROGRAM_INDICATOR': dimConf.programIndicator.objectName
            },
            objectNameMap = {},                
            legendtype_predefined = gis.conf.finals.widget.legendtype_predefined,
            legendtype_automatic = gis.conf.finals.widget.legendtype_automatic,
            isOu = false,
            isOuc = false,
            isOugc = false,
            levels = [],
            groups = [],
            objectNameProgramCmpMap = {},
            setDxGui,
            setPeGui,
            setOuGui,
            setLegendGui,
            setLayer,
            init;

        objectNameMap[dimConf.indicator.objectName] = dimConf.indicator.objectName;
        objectNameMap[dimConf.dataElement.objectName] = dimConf.dataElement.objectName;
        objectNameMap[dimConf.operand.objectName] = dimConf.dataElement.objectName;
        objectNameMap[dimConf.dataSet.objectName] = dimConf.dataSet.objectName;
        objectNameMap[dimConf.eventDataItem.objectName] = dimConf.eventDataItem.objectName;
        objectNameMap[dimConf.programIndicator.objectName] = dimConf.programIndicator.objectName;

        var dxItemType = dxDim.items[0].dimensionItemType,
            legType = isObject(view.legendSet) && isString(view.legendSet.id) ? legendtype_predefined : legendtype_automatic;

        var dxCmp = itemTypeCmpMap[dxItemType],
            dxObjectName = itemTypeObjectNameMap[dxItemType];              
            
            //itemTypeCmpMap = {},
        objectNameProgramCmpMap[dimConf.eventDataItem.objectName] = eventDataItemProgram;
        objectNameProgramCmpMap[dimConf.programIndicator.objectName] = programIndicatorProgram;

        setDxGui = function() {

            // TODO, objectName/dimensionItemType must be sorted
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

        setPeGui = function() {
            period.store.add(gis.conf.period.relativePeriodRecordsMap[peDim.items[0].id] ? gis.conf.period.relativePeriodRecordsMap[peDim.items[0].id] : peDim.items[0]);
            period.setValue(peDim.items[0].id);
        };

        setOuGui = function() {
            for (var i = 0, item; i < ouDim.items.length; i++) {
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

        setLegendGui = function() {
            legendType.setValue(legType);
            legendTypeToggler(legType);

            if (legType === gis.conf.finals.widget.legendtype_automatic) {
                classes.setValue(view.classes);
                method.setValue(view.method);
                colorLow.setValue(view.colorLow);
                colorHigh.setValue(view.colorHigh);
                radiusLow.setValue(view.radiusLow);
                radiusHigh.setValue(view.radiusHigh);
            }
            else if (legType === gis.conf.finals.widget.legendtype_predefined) {
                method.setValue(1);
                legendSet.store.add(view.legendSet);
                legendSet.setValue(view.legendSet.id);
            }
        };

        setLayer = function() {

            // Layer item
            layer.item.setValue(!view.hidden, view.opacity);

            // Layer menu
            layer.menu.enableItems();

            // Filter
            if (layer.filterWindow && layer.filterWindow.isVisible()) {
                layer.filterWindow.filter();
            }
        };

        init = function() {
            if (!layer.window.isRendered) {
                return;
            }

            if (!isDrillDown) {
                reset(true);
                setDxGui();
                setPeGui();
                setLegendGui();
            }

            setOuGui();
            setLayer();

            // labels
            labelPanel.setConfig(view);
        }();
    };

    getView = function(config) {
        var in_ = dimConf.indicator.objectName,
            de = dimConf.dataElement.objectName,
            dc = dimConf.operand.objectName,
            ds = dimConf.dataSet.objectName,
            di = dimConf.eventDataItem.objectName,
            pi = dimConf.programIndicator.objectName,
            objectNameCmpMap = {},
            objectNameItemTypeMap = {},
            view = {};

        var dxObjectName = valueType.getValue() === de ? dataElementDetailLevel.getValue() : valueType.getValue(),
            dxItemType;

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

        dxItemType = objectNameItemTypeMap[dxObjectName];

        // id
        view.layer = layer.id;

        // value type TODO?
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
        view.method = legendType.getValue() === 'automatic' ? parseInt(method.getValue()) : 1;
        view.colorLow = colorLow.getValue();
        view.colorHigh = colorHigh.getValue();
        view.radiusLow = parseInt(radiusLow.getValue());
        view.radiusHigh = parseInt(radiusHigh.getValue());
        view.opacity = layer.layerOpacity;

        Ext.apply(view, labelPanel.getConfig());

        // legend
        if (legendType.getValue() === gis.conf.finals.widget.legendtype_predefined && legendSet.getValue()) {
            view.legendSet = {
                id: legendSet.getValue()
            };
        }

        return gis.api.layout.Layout(view);
    };

    accordionBody = Ext.create('Ext.panel.Panel', {
        layout: 'accordion',
        activeOnTop: true,
        cls: 'ns-accordion',
        bodyStyle: 'border:0 none; margin-bottom:1px',
        height: 410,
        items: function() {
            var panels = [
                data,
                organisationUnit,
                legend
            ];

            last = panels[panels.length - 1];
            last.cls = 'ns-accordion-last';

            return panels;
        }(),
        listeners: {
            afterrender: function() { // nasty workaround
                for (var i = accordionPanels.length - 1; i >= 0; i--) {
                    accordionPanels[i].expand();
                }
            }
        }
    });

    accordion = Ext.create('Ext.panel.Panel', {
        bodyStyle: 'border-style:none; padding:1px; padding-bottom:0',
        items: accordionBody,
        panels: accordionPanels,

        map: layer.map,
        layer: layer,
        menu: layer.menu,

        reset: reset,
        setGui: setGui,
        getView: getView,
        getParentGraphMap: function() {
            return treePanel.getParentGraphMap();
        },

        infrastructuralDataElementValuesStore: infrastructuralDataElementValuesStore,
        setThisHeight: function(mx) {
            return 450;
        },
        getExpandedPanel: function() {
            for (var i = 0; i < this.panels.length; i++) {
                if (!this.panels[i].collapsed) {
                    return this.panels[i];
                }
            }

            return null;
        },
        getFirstPanel: function() {
            return this.panels[0];
        },
        listeners: {
            added: function() {
                layer.accordion = this;
            },
            render: function() {
                toolMenu.clickHandler('level');
            }
        }
    });

    return accordion;
};
