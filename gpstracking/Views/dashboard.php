<button style="margin-bottom: 20px;" class="btn btn-outline-secondary" href="#createCar" data-target="#createCar" data-toggle="modal" >Araç Kayıt</button>

<style>
    .no{  transition: background 500ms;  color:white; -webkit-animation: 400ms ease 0s normal forwards 1000 fadein; animation: 400ms ease 0s normal forwards 1000 fadein; }
    .ok{ background: #119e03;  color: white; }

    @keyframes fadein{
        0% { background: red; transition: background 500ms;}
        100% { background:#960005; transition: background 500ms;}
        0% { background: red; transition: background 500ms;}
    }

    @-webkit-keyframes fadein{
        0% { background: red; transition: background 500ms;}
        100% { background: #960005; transition: background 500ms;}
        0% { background: red; transition: background 500ms;}
    }

</style>



<table id="gpsTrack-table" class="table table-striped table-bordered  nowrap" style="border-collapse: collapse; border-spacing: 0; width: 100%;">
    <thead>
    <tr>
        <th>ID</th>
        <th>Takip Kodu</th>
        <th>Başlık</th>
        <th>Plaka</th>
        <th>Durum</th>
        <th>Yetkili</th>
        <th>İşlem</th>
    </tr>
    </thead>
</table>






<form class="createCar" onsubmit="return false;">
    <!-- sample modal content -->
    <div id="createCar" class="modal fade" tabindex="-1" role="dialog" aria-labelledby="createCar" aria-hidden="true">
        <div class="modal-dialog" style="width: 500px;">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title mt-0" id="myModalLabel">Araç Kayıt</h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>

                <div class="modal-body">


                    <?php $data["hook"]->do_action("gpstracking@create"); ?>

                </div>

                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary waves-effect" data-dismiss="modal">İptal</button>
                    <button type="submit" class="btn btn-primary waves-effect waves-light">Kaydet</button>
                </div>

            </div><!-- /.modal-content -->
        </div><!-- /.modal-dialog -->
    </div><!-- /.modal -->
</form>