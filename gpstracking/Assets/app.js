$(function () {



    const pleaseWait = () => {

        swal("İŞLEM YAPILIYOR","Lütfen Bekleyiniz","/assets/images/ajax-loader.gif", {
            buttons: {},
            closeOnClickOutside:false,
            closeOnEsc:false,
            showLoaderOnConfirm:true
        })

    };


    $.fn.dataTable.ext.buttons.reload = {
        text: 'Veri Yenile',
        action: function ( e, dt, node, config ) {
            dt.ajax.reload();
        }
    };


    window.gpsTrack = $("#gpsTrack-table").DataTable({
        responsive: true,
        language: {
            buttons: {
                colvis:"Tablo düzenle",
                pdf:"Pdf indir",
                excel:"Excel indir",
                copy:"Kopyala",
                reload:"Verileri yenile",
                print:"Yazdır",
                copyTitle: 'BAŞARILI',
                copyKeys: '',
                copySuccess: {
                    _: '%d Kayıt kopyalandı',
                    1: '1 Kayıt kopyalandı'
                }
            },
            sDecimal:        ",",
            sEmptyTable:     "Tabloda herhangi bir veri mevcut değil",
            sInfo:           "_TOTAL_ kayıttan _START_ - _END_ arasındaki kayıtlar gösteriliyor",
            sInfoEmpty:      "Kayıt yok",
            sInfoFiltered:   "(_MAX_ kayıt içerisinden bulunan)",
            sInfoPostFix:    "",
            sInfoThousands:  ".",
            sLengthMenu:     "Sayfada _MENU_ kayıt göster",
            sLoadingRecords: "Yükleniyor...",
            sProcessing:     "İşleniyor...",
            sSearch:         "Ara:",
            sZeroRecords:    "Eşleşen kayıt bulunamadı",
            oPaginate: {
                sFirst:    "İlk",
                sLast:     "Son",
                sNext:     "Sonraki",
                sPrevious: "Önceki"
            },
            oAria: {
                sSortAscending:  ": artan sütun sıralamasını aktifleştir",
                sSortDescending: ": azalan sütun sıralamasını aktifleştir"
            },
            select: {
                rows: {
                    _: "%d kayıt seçildi",
                    0: "",
                    1: "1 kayıt seçildi"
                }
            }

        },
        dom: 'Bfrtip',
        ajax: {
            url: "/ajax/plugin/gpstracking/cars",
            type: "POST",
            "lengthMenu": [[10, 25, 50, -1], [10, 25, 50, "All"]]
        },
        "lengthMenu": [[10, 25, 50, -1], [10, 25, 50, "All"]],
        buttons: ["colvis","copy", "excel", "pdf", "reload"],
        lengthChange: !1,
        columnDefs: [ {
            targets: -1,
            data: null,
            defaultContent: "<button class='gpsTrack btn btn-danger btn-sm waves-effect waves-light'>SİL</button>"
        },
            {
                render: function (data, type, full, meta) {
                    return "<div class='text-wrap width-200'>" + data + "</div>";
                },
                targets: 1
            }
        ]
    });

    window.gpsTrack.buttons().container().appendTo("#datatable-buttons_wrapper .col-md-6:eq(0)");

    $('#gpsTrack-table tbody').on( 'click', 'button.gpsTrack', function () {

        let getCode = $($(this).parents('tr').children()[0]).html();


        swal("İŞLEM ONAYI","Araç silme işlemini onaylıyor musunuz?","info", {
            buttons: {
                cancel: {
                    text: "Hayır",
                    value: false,
                    visible: true
                },
                yes: {
                    text: "Evet",
                    value: true
                }
            }
        }).then((x)=>{
            if(x){

                pleaseWait();

                $.ajax({
                    type: "POST",
                    url: "/ajax/plugin/gpstracking/remove",
                    data: {uuid:getCode},
                    dataType: "json",
                    success: function (response) {

                        if(response.status === "success"){

                            swal(response.title,response.message,response.status, {
                                buttons: {
                                    cancel: {
                                        text: "TAMAM",
                                        value: false,
                                        visible: true
                                    }
                                }
                            });
                            window.gpsTrack.ajax.reload();

                        }else{
                            swal(response.title,response.message,response.status, {
                                buttons: {
                                    cancel: {
                                        text: "Tekar Dene",
                                        value: false,
                                        visible: true
                                    }
                                }
                            });
                        }

                    }
                });


            }
        });



    });


    if($("#map").length > 0){


        let customControl =  L.Control.extend({
            options: {
                position: 'topleft'
            },

            onAdd: function (map) {

                var container = L.DomUtil.create('div', 'leaflet-bar leaflet-control toggle_fullscreen leaflet-control-custom');

                container.style.backgroundColor = 'white';
                container.style.width = '30px';
                container.style.height = '30px';
                container.style.lineHeight = '28px';
                container.style.cursor = 'pointer';
                container.style.textAlign = 'center';
                container.innerHTML = '<i class="fas fa-tv" style="font-size: 15px;"></i>';
                container.title = 'Tam Ekran';

                return container;

        }});

        window["map"] = L.map('map').setView([36.9986147, 35.3223257], 3);

        window["map"].addControl(new customControl());

        L.tileLayer('https://{s}.tile.osm.org/{z}/{x}/{y}.png', {
            attribution: "VOBO COMPANY",
            maxZoom: 18,
            brand:false
        }).addTo(window["map"]);

        var layerGroup = L.layerGroup().addTo(map);


        L.Control.Watermark = L.Control.extend({
            onAdd: function(map) {
                var img = L.DomUtil.create('img');

                img.src = 'https://vobo.cloud/upload/static/original/logo/logo1_1.svg';
                img.style.width = '100px';

                return img;
            },

            onRemove: function(map) {
                // Nothing to do here
            }
        });

        L.control.watermark = function(opts) {
            return new L.Control.Watermark(opts);
        }

        L.control.watermark({ position: 'bottomleft' }).addTo(map);



        window["makers"] = [];


        setInterval(function () {

            $.ajax({
                type: "POST",
                url: "/ajax/plugin/gpstracking/live",
                data: {},
                dataType: "json",
                success: function (response) {

                    if(response.status === "success"){

                        if(response.data.length > 0){

                            layerGroup.clearLayers();

                            window["makers"] = [];

                            $(".listUserWatchLive").html("");

                            response.data.forEach(function (x) {

                                if(x.latitude !== null && x.latitude !== null){

                                    window[x.trackCode] = L.popup({keepInView:true,closeButton:false,autoClose:false,closeOnEscapeKey:false,closeOnClick:false}).setContent('<p>PLAKA : '+x.plaque+'<br />YETKİLİ : '+x.owner+'</p>').openPopup();

                                    var mmasd = L.marker([parseFloat(x.latitude), parseFloat(x.longitude)], {
                                        icon: L.divIcon({
                                            className: "my-custom-pin",
                                            iconAnchor: [0, 24],
                                            labelAnchor: [-6, 0],
                                            popupAnchor: [0, -36],
                                            html: `<div style="background-color: red; width: 3rem; height: 3rem; display: block; left: -1.5rem; top: -1.5rem; position: relative; border-radius: 3rem 3rem 0; transform: rotate(45deg); border: 1px solid #FFFFFF" ></div>`
                                        }),
                                        draggable: false,
                                        autoClose: false,
                                        closeOnClick: false})
                                        .bindPopup(window[x.trackCode]);

                                    window["makers"].push(mmasd);


                                    $.get('https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat='+x.latitude+'&lon='+x.longitude, function(data){

                                        $(".listUserWatchLive").append('<div class="col-md-3" style=" border: 1px solid white; background: #333131; padding: 0px 17px;"> <table> <tr> <td width="90px">Kullanıcı</td> <td>'+x.owner+'</td> </tr> <tr> <td>Plaka</td> <td>'+x.plaque+'</td> </tr> <tr> <td>Hız</td> <td>'+parseInt(x.speed)+' /Km</td> </tr> <tr> <td>Konum</td> <td style="font-size: 12px;">'+(data.display_name !== undefined ? data.display_name : "Bilinmiyor")+'</td> </tr> </table> </div>');


                                    });


                                }


                            });

                            var group = L.featureGroup(window["makers"]).addTo(layerGroup);


                            window["map"].fitBounds(group.getBounds());

                            $(".leaflet-marker-pane > *").click();


                        }else{
                            $(".listUserWatchLive").append("<div class='notFoundApplication'>AKTİF CİHAZ BULUNAMADI</div>");
                            layerGroup.clearLayers();
                        }

                    }

                }
            });

        }, 2000);

    }

    $(".createCar").submit(function () {


        swal("İŞLEM ONAYI","Araç oluşturma işlemini onaylıyor musunuz?","info", {
            buttons: {
                cancel: {
                    text: "Hayır",
                    value: false,
                    visible: true
                },
                yes: {
                    text: "Evet",
                    value: true
                }
            }
        }).then((x)=>{
            if(x){

                pleaseWait();

                $.ajax({
                    type: "POST",
                    url: "/ajax/plugin/gpstracking/create",
                    data: $(".createCar").serialize(),
                    dataType: "json",
                    success: function (response) {

                        if(response.status === "success"){

                            swal(response.title,response.message,response.status, {
                                buttons: {
                                    cancel: {
                                        text: "TAMAM",
                                        value: false,
                                        visible: true
                                    }
                                }
                            });
                            $("#createCar").modal("hide");
                            window.gpsTrack.ajax.reload();

                        }else{
                            swal(response.title,response.message,response.status, {
                                buttons: {
                                    cancel: {
                                        text: "Tekar Dene",
                                        value: false,
                                        visible: true
                                    }
                                }
                            });
                        }

                    }
                });


            }
        });


    }); 


    $('.toggle_fullscreen').on('click', function(){
        // if already full screen; exit
        // else go fullscreen
        if (
            document.fullscreenElement ||
            document.webkitFullscreenElement ||
            document.mozFullScreenElement ||
            document.msFullscreenElement
        ) {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            } else if (document.mozCancelFullScreen) {
                document.mozCancelFullScreen();
            } else if (document.webkitExitFullscreen) {
                document.webkitExitFullscreen();
            } else if (document.msExitFullscreen) {
                document.msExitFullscreen();
            }
        } else {
            element = $('#fullScreenMap').get(0);
            if (element.requestFullscreen) {
                element.requestFullscreen();
            } else if (element.mozRequestFullScreen) {
                element.mozRequestFullScreen();
            } else if (element.webkitRequestFullscreen) {
                element.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
            } else if (element.msRequestFullscreen) {
                element.msRequestFullscreen();
            }
        }
    });


});