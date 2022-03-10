    <style>
        .leaflet-popup-close-button{ display: none;}
        td { color: white;}
        .notFoundApplication{ margin-left: 0px;background: #333131;width: 100%;overflow: scroll;position: absolute;bottom: 0px;z-index: 9999;height: 200px;color: white;text-align: center;line-height: 200px;font-size: 30px; }
    </style>

    <div style="border-radius: 10px; width: 100%; height: 610px; overflow: hidden; position: relative;" id="fullScreenMap">


        <div id="map" style=" position: absolute; width: 100%; height: calc(100% - 200px); z-index: 1;"></div>

        <div class="row listUserWatchLive" style=" margin-left: 0px; background: #333131; width: 100%;overflow: scroll;position: absolute;bottom: 0px;z-index: 9999;height: 200px;">
            <div class="notFoundApplication">LÜTFEN BEKLEYİNİZ</div>
        </div>

    </div>

