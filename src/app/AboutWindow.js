import isObject from 'd2-utilizr/lib/isObject';

export default function AboutWindow(gis) {
    return Ext.create('Ext.window.Window', {
        title: GIS.i18n.about,
        bodyStyle: 'background:#fff; padding:6px',
        modal: true,
        resizable: false,
        destroyOnBlur: true,
        listeners: {
            show: function(w) {
                Ext.Ajax.request({
                    url: gis.init.contextPath + '/api/system/info.json',
                    success: function(r) {
                        var info = JSON.parse(r.responseText),
                            divStyle = 'padding:3px',
                            html = '<div class="user-select">';

                        if (isObject(info)) {
                            html += '<div style="' + divStyle + '"><b>' + GIS.i18n.time_since_last_data_update + ': </b>' + info.intervalSinceLastAnalyticsTableSuccess + '</div>';
                            html += '<div style="' + divStyle + '"><b>' + GIS.i18n.version + ': </b>' + info.version + '</div>';
                            html += '<div style="' + divStyle + '"><b>' + GIS.i18n.revision + ': </b>' + info.revision + '</div>';
                            html += '<div style="' + divStyle + '"><b>' + GIS.i18n.username + ': </b>' + gis.init.userAccount.username + '</div>';
                            html += '</div>';
                        }
                        else {
                            html += 'No system info found';
                        }

                        w.update(html);
                    },
                    failure: function(r) {
                        w.update(r.status + '\n' + r.statusText + '\n' + r.responseText);
                    },
                    callback: function() {
                        document.body.oncontextmenu = true;

                        gis.util.gui.window.setAnchorPosition(w, gis.viewport.aboutButton);

                        //if (!w.hasHideOnBlurHandler) {
                        //ns.core.web.window.addHideOnBlurHandler(w);
                        //}
                    }
                });

                if (!w.hasDestroyOnBlurHandler) {
                    gis.util.gui.window.addDestroyOnBlurHandler(w);
                }
            },
            hide: function() {
                document.body.oncontextmenu = function() {
                    return false;
                };
            },
            destroy: function() {
                document.body.oncontextmenu = function() {
                    return false;
                };
            }
        }
    });
};