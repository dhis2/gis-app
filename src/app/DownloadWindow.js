export default function DownloadWindow(gis) {
    var downloadWindow,
        format,
        name,
        button;

    format = Ext.create('Ext.form.field.ComboBox', {
        cls: 'gis-combo',
        width: 60,
        style: 'margin-bottom:0; margin-left:1px',
        valueField: 'id',
        displayField: 'text',
        editable: false,
        queryMode: 'local',
        forceSelection: true,
        value: 'png',
        store: Ext.create('Ext.data.ArrayStore', {
            fields: ['id', 'text'],
            data: [
                ['png', 'PNG'],
                ['pdf', 'PDF']
            ]
        })
    });

    name = Ext.create('Ext.form.field.Text', {
        cls: 'gis-textfield',
        //height: 23,
        width: 230,
        fieldStyle: 'padding-left:4px',
        style: 'margin-bottom:0',
        emptyText: GIS.i18n.please_enter_map_title
    });

    button = Ext.create('Ext.button.Button', {
        text: GIS.i18n.download,
        handler: function() {

            console.log("####", gis.instance.getContainer());


            html2canvas(gis.instance.getContainer(), {
                logging: true,
                useCORS: true,
                width: 1000,
                height: 800,
                onrendered: function(canvas) {
                    window.open(canvas.toDataURL());
                }
            });



            /*
            var type = format.getValue(),
                title = name.getValue(),
                svg = gis.util.svg.getString(title, gis.util.map.getVisibleVectorLayers()),
                exportForm = document.getElementById('exportForm');

            if (!svg) {
                alert(GIS.i18n.please_create_map_first);
                return;
            }

            document.getElementById('filenameField').value = title;
            document.getElementById('svgField').value = svg;
            exportForm.action = gis.init.apiPath + 'svg.' + type;
            exportForm.submit();

            window.destroy();
            */
        }
    });

    downloadWindow = Ext.create('Ext.window.Window', {
        title: GIS.i18n.download_map_as_png,
        layout: 'column',
        iconCls: 'gis-window-title-icon-download',
        cls: 'gis-container-default',
        bodyStyle: 'padding:1px',
        resizable: true,
        modal: true,
        destroyOnBlur: true,
        items: [
            name,
            format
        ],
        bbar: [
            '->',
            button
        ],
        listeners: {
            show: function(w) {
                this.setPosition(253, 33);

                if (!w.hasDestroyOnBlurHandler) {
                    gis.util.gui.window.addDestroyOnBlurHandler(w);
                }
            }
        }
    });

    return downloadWindow;
};