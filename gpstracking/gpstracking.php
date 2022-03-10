<?php


namespace App\Main\Plugin\gpstracking;

use App\Main\Model\plugin;
use App\Main\Plugin\gpstracking\Controller\helper;
use App\Main\Plugin\gpstracking\Model\car;
use Fix\Support\Header;


plugin::info([
    "title" => "Konum Takip",
    "slug"  => plugin::get_name(__DIR__)
]);


plugin::checkAndInstallDatabase("plugin_tracker",file_get_contents(__DIR__."/tracker.sql"));



if(isset($_SESSION["cms_auth_site"])){




    if(isset($_GET["page"])){

        if($_GET["page"] === "gpstracking@live" or $_GET["page"] === "gpstracking@dashboard"){

            plugin::add_css([
                "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.5.1/leaflet.css"
            ]);
            
            plugin::add_js([
                "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.5.1/leaflet.js",
                "/App/Main/Plugin/gpstracking/Assets/app.js?=".time()
            ]);

        }

    }

    Plugin::add_menu([
        [
            "permission"    => false,
            "title"         => "Konum Takip",
            "icon"          => "navigation",
            "child"         => [
                [
                    "title"         => "Araç İşlemleri",
                    "url"           => "gpstracking@dashboard",
                    "permission"    => false
                ],
                [
                    "title"         => "Konum Takibi",
                    "url"           => "gpstracking@live",
                    "permission"    => false
                ]
            ]
        ]
    ]);

    plugin::add_create_form_item("gpstracking@create","TEXT","title","Başlık","active","Veri giriniz...");
    plugin::add_create_form_item("gpstracking@create","TEXT","plaque","Araç Plakası","active","Veri giriniz...");
    plugin::add_create_form_item("gpstracking@create","TEXT","owner","Yetkili","active","Veri giriniz...");


    plugin::admin_view_render(
        "Konum Takip",
        [
            "Konum Takip"
        ],
        __DIR__,
        "dashboard",
        "dashboard",
        [

        ]
    );

    plugin::admin_view_render(
        "Canlı Takip Ekranı",
        [
            "Gps Takip",
            "Canlı Takip Ekranı"
        ],
        __DIR__,
        "live",
        "live",
        [

        ]
    );




    plugin::add_router_post("router@admin","/ajax/plugin/gpstracking/cars",[helper::class,"getList"]);
    plugin::add_router_post("router@admin","/ajax/plugin/gpstracking/live",[helper::class,"getListLive"]);
    plugin::add_router_post("router@admin","/ajax/plugin/gpstracking/create",[helper::class,"createCar"]);
    plugin::add_router_post("router@admin","/ajax/plugin/gpstracking/remove",[helper::class,"removeCar"]);



}else{

    plugin::hook()->add_action("api@post:gpstrackinglive",function () {

        try{

            Header::checkParameter($_POST,["key"]);
            Header::checkValue($_POST,["key"]);

            $getCar = car::check_car(Header::post("key"));

            if(!$getCar)
                throw new \Exception("Araç bulunamadı");

            $upCar = car::up_car(Header::post("key"));

            if(!$upCar)
                throw new \Exception("Araç zaman hatası");

            Header::jsonResult("success","BAŞARILI","Veri ektedir",[
               "owner" => $getCar["owner"],
               "plaque" => $getCar["plaque"]
            ]);

        }catch (\Exception $exception){
            Header::jsonResult("error","HATA",$exception->getMessage());
        }


    });

    plugin::hook()->add_action("api@post:gpstrackingliveup",function () {

        try{

            Header::checkParameter($_POST,["key","latitude","longitude","speed"]);
            Header::checkValue($_POST,["key","latitude","longitude"]);

            $getCar = car::check_car(Header::post("key"));

            if(!$getCar)
                throw new \Exception("Araç bulunamadı");

            $upCar = car::track_car(
                Header::post("key"),
                Header::post("latitude"),
                Header::post("longitude"),
                Header::post("speed")
            );

            if(!$upCar)
                throw new \Exception("Araç güncelleme hatası");

            Header::jsonResult("success","BAŞARILI","Veri ektedir",[
                "owner" => $getCar["owner"],
                "plaque" => $getCar["plaque"]
            ]);

        }catch (\Exception $exception){
            Header::jsonResult("error","HATA",$exception->getMessage());
        }


    });



}
