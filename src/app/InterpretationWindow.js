import isString from 'd2-utilizr/lib/isString';

export default function InterpretationWindow(gis) {
    var textArea,
        shareButton,
        window;

    if (isString(gis.map.id)) {
        textArea = Ext.create('Ext.form.field.TextArea', {
            cls: 'gis-textarea',
            height: 130,
            fieldStyle: 'padding-left: 3px; padding-top: 3px',
            emptyText: GIS.i18n.write_your_interpretation + '..',
            enableKeyEvents: true,
            listeners: {
                keyup: function() {
                    shareButton.xable();
                }
            }
        });

        shareButton = Ext.create('Ext.button.Button', {
            text: GIS.i18n.share,
            disabled: true,
            xable: function() {
                this.setDisabled(!textArea.getValue());
            },
            handler: function() {
                if (textArea.getValue()) {
                    Ext.Ajax.request({
                        url: gis.init.contextPath + '/api/interpretations/map/' + gis.map.id,
                        method: 'POST',
                        params: textArea.getValue(),
                        headers: {'Content-Type': 'text/html'},
                        success: function() {
                            textArea.reset();
                            window.hide();
                        }
                    });
                }
            }
        });

        window = Ext.create('Ext.window.Window', {
            title: 'Write interpretation' + '<span style="font-weight:normal">&nbsp;|&nbsp;&nbsp;' + gis.map.name + '</span>',
            layout: 'fit',
            iconCls: 'gis-window-title-icon-interpretation',
            cls: 'gis-container-default',
            bodyStyle: 'padding: 1px',
            width: 500,
            resizable: true,
            modal: true,
            destroyOnBlur: true,
            items: [
                textArea
            ],
            bbar: {
                //cls: 'gis-toolbar-bbar',
                defaults: {
                    height: 24
                },
                items: [
                    '->',
                    shareButton
                ]
            },
            listeners: {
                show: function(w) {
                    this.setPosition(325, 33);

                    if (!w.hasDestroyOnBlurHandler) {
                        gis.util.gui.window.addDestroyOnBlurHandler(w);
                    }

                    document.body.oncontextmenu = true;
                },
                hide: function() {
                    document.body.oncontextmenu = function(){return false;};
                },
                destroy: function() {
                    gis.viewport.interpretationWindow = null;
                }
            }
        });

        return window;
    }

    return;
};