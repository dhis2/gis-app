GIS.app.SharingWindow = function(sharing) {

    // Objects
    var UserGroupRow,

    // Functions
        getBody,

    // Components
        userGroupStore,
        userGroupField,
        userGroupButton,
        userGroupRowContainer,
        externalAccess,
        publicGroup,
        window;

    UserGroupRow = function(obj, isPublicAccess, disallowPublicAccess) {
        var getData,
            store,
            getItems,
            combo,
            getAccess,
            panel;

        getData = function() {
            var data = [
                {id: 'r-------', name: GIS.i18n.can_view},
                {id: 'rw------', name: GIS.i18n.can_edit_and_view}
            ];

            if (isPublicAccess) {
                data.unshift({id: '--------', name: GIS.i18n.none});
            }

            return data;
        }

        store = Ext.create('Ext.data.Store', {
            fields: ['id', 'name'],
            data: getData()
        });

        getItems = function() {
            var items = [];

            combo = Ext.create('Ext.form.field.ComboBox', {
                style: 'margin-bottom:2px',
                fieldLabel: isPublicAccess ? GIS.i18n.public_access : obj.name,
                labelStyle: 'color:#333',
                cls: 'gis-combo',
                width: 380,
                labelWidth: 250,
                queryMode: 'local',
                valueField: 'id',
                displayField: 'name',
                labelSeparator: null,
                editable: false,
                disabled: !!disallowPublicAccess,
                value: obj.access || 'rw------',
                store: store
            });

            items.push(combo);

            if (!isPublicAccess) {
                items.push(Ext.create('Ext.Img', {
                    src: 'images/grid-delete_16.png',
                    style: 'margin-top:2px; margin-left:7px',
                    overCls: 'pointer',
                    width: 16,
                    height: 16,
                    listeners: {
                        render: function(i) {
                            i.getEl().on('click', function(e) {
                                i.up('panel').destroy();
                                window.doLayout();
                            });
                        }
                    }
                }));
            }

            return items;
        };

        getAccess = function() {
            return {
                id: obj.id,
                name: obj.name,
                access: combo.getValue()
            };
        };

        panel = Ext.create('Ext.panel.Panel', {
            layout: 'column',
            bodyStyle: 'border:0 none',
            getAccess: getAccess,
            items: getItems()
        });

        return panel;
    };

    getBody = function() {
        var body = {
            object: {
                id: sharing.object.id,
                name: sharing.object.name,
                publicAccess: publicGroup.down('combobox').getValue(),
                externalAccess: externalAccess ? externalAccess.getValue() : false,
                user: {
                    id: gis.init.user.id,
                    name: gis.init.user.name
                }
            }
        };

        if (userGroupRowContainer.items.items.length > 1) {
            body.object.userGroupAccesses = [];
            for (var i = 1, item; i < userGroupRowContainer.items.items.length; i++) {
                item = userGroupRowContainer.items.items[i];
                body.object.userGroupAccesses.push(item.getAccess());
            }
        }

        return body;
    };

    // Initialize
    userGroupStore = Ext.create('Ext.data.Store', {
        fields: ['id', 'name'],
        proxy: {
            type: 'ajax',
            url: gis.init.contextPath + '/api/sharing/search',
            extraParams: {
                pageSize: 50
            },
            startParam: false,
            limitParam: false,
            reader: {
                type: 'json',
                root: 'userGroups'
            }
        }
    });

    userGroupField = Ext.create('Ext.form.field.ComboBox', {
        valueField: 'id',
        displayField: 'name',
        emptyText: GIS.i18n.search_for_user_groups,
        queryParam: 'key',
        queryDelay: 200,
        minChars: 1,
        hideTrigger: true,
        fieldStyle: 'height:26px; padding-left:6px; border-radius:1px; font-size:11px',
        style: 'margin-bottom:5px',
        width: 380,
        store: userGroupStore,
        listeners: {
            beforeselect: function(cb) { // beforeselect instead of select, fires regardless of currently selected item
                userGroupButton.enable();
            },
            afterrender: function(cb) {
                cb.inputEl.on('keyup', function() {
                    userGroupButton.disable();
                });
            }
        }
    });

    userGroupButton = Ext.create('Ext.button.Button', {
        text: '+',
        style: 'margin-left:2px; padding-right:4px; padding-left:4px; border-radius:1px',
        disabled: true,
        height: 26,
        handler: function(b) {
            userGroupRowContainer.add(UserGroupRow({
                id: userGroupField.getValue(),
                name: userGroupField.getRawValue(),
                access: 'r-------'
            }));

            userGroupField.clearValue();
            b.disable();
        }
    });

    userGroupRowContainer = Ext.create('Ext.container.Container', {
        bodyStyle: 'border:0 none'
    });

    if (sharing.meta.allowExternalAccess) {
        externalAccess = userGroupRowContainer.add({
            xtype: 'checkbox',
            fieldLabel: GIS.i18n.allow_external_access,
            labelSeparator: '',
            labelWidth: 250,
            checked: !!sharing.object.externalAccess
        });
    }

    publicGroup = userGroupRowContainer.add(UserGroupRow({
        id: sharing.object.id,
        name: sharing.object.name,
        access: sharing.object.publicAccess
    }, true, !sharing.meta.allowPublicAccess));

    if (Ext.isArray(sharing.object.userGroupAccesses)) {
        for (var i = 0, userGroupRow; i < sharing.object.userGroupAccesses.length; i++) {
            userGroupRow = UserGroupRow(sharing.object.userGroupAccesses[i]);
            userGroupRowContainer.add(userGroupRow);
        }
    }

    window = Ext.create('Ext.window.Window', {
        title: 'Sharing settings',
        bodyStyle: 'padding:5px 5px 3px; background-color:#fff',
        resizable: false,
        modal: true,
        destroyOnBlur: true,
        items: [
            {
                html: sharing.object.name,
                bodyStyle: 'border:0 none; font-weight:bold; color:#333',
                style: 'margin-bottom:7px'
            },
            {
                xtype: 'container',
                layout: 'column',
                bodyStyle: 'border:0 none',
                items: [
                    userGroupField,
                    userGroupButton
                ]
            },
            {
                html: GIS.i18n.created_by + ' ' + sharing.object.user.name,
                bodyStyle: 'border:0 none; color:#777',
                style: 'margin-top:2px;margin-bottom:7px'
            },
            userGroupRowContainer
        ],
        bbar: [
            '->',
            {
                text: 'Save',
                handler: function() {
                    Ext.Ajax.request({
                        url: gis.init.contextPath + '/api/sharing?type=map&id=' + sharing.object.id,
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        params: Ext.encode(getBody())
                    });

                    window.destroy();
                }
            }
        ],
        listeners: {
            show: function(w) {
                var pos = gis.viewport.favoriteWindow.getPosition();
                w.setPosition(pos[0] + 5, pos[1] + 5);

                if (!w.hasDestroyOnBlurHandler) {
                    gis.util.gui.window.addDestroyOnBlurHandler(w);
                }

                gis.viewport.favoriteWindow.destroyOnBlur = false;
            },
            destroy: function() {
                gis.viewport.favoriteWindow.destroyOnBlur = true;
            }
        }
    });

    return window;
};