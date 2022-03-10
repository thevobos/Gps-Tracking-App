<?php

namespace App\Main\Plugin\gpstracking\Controller;


use App\Main\Model\plugin;
use App\Main\Plugin\gpstracking\Model\car;
use Fix\Support\Header;

class helper {



    public static function createCar(){

        try{

            Header::checkParameter($_POST,["title","plaque","owner"]);
            Header::checkValue($_POST,["title","plaque","owner"]);

            if(!car::create_car(
                self::uuid(),
                $_SESSION["cms_auth_site"],
                rand(1111,9999).rand(1234,9876).rand(2343,7798),
                Header::post("title"),
                Header::post("plaque"),
                Header::post("owner")
            ))
                throw new \Exception("Kayıt Hatası");


            Header::jsonResult("success","BAŞARILI","Kayıt edildi");


        }catch (\Exception $exception){
            Header::jsonResult("error","HATA",$exception->getMessage(),[]);
        }

    }



    public static function removeCar(){

        try{

            Header::checkParameter($_POST,["uuid"]);
            Header::checkValue($_POST,["uuid"]);

            if(!car::get_car(
                $_SESSION["cms_auth_site"],
                Header::post("uuid")
            ))throw new \Exception("Kayıt Bulunamadı");


            if(!car::remove_car(
                $_SESSION["cms_auth_site"],
                Header::post("uuid")
            ))throw new \Exception("Silme Hatası");


            Header::jsonResult("success","BAŞARILI","Kayıt silindi");


        }catch (\Exception $exception){
            Header::jsonResult("error","HATA",$exception->getMessage(),[]);
        }

    }



    public static function getList(){

        try{

            $export = [];

            foreach (car::list_car($_SESSION["cms_auth_site"]) as $item) {

                $export[] = [
                    $item["uuid"],
                    $item["trackCode"],
                    $item["title"],
                    $item["plaque"],
                    intval($item["checking"]) > time()-10 ? "AKTİF" : "PASİF",
                    $item["owner"],
                ];

            }

            Header::jsonResult("success","Başarılı","Veri ekte",$export);



        }catch (\Exception $exception){
            Header::jsonResult("error","HATA",$exception->getMessage(),[]);
        }

    }

    public static function random_color_part() {
        return str_pad( dechex( mt_rand( 0, 255 ) ), 2, '0', STR_PAD_LEFT);
    }

    public static function random_color() {
        return self::random_color_part() . self::random_color_part() . self::random_color_part();
    }




    public static function getListLive(){

        try{

            $export = [];

            foreach (car::list_car($_SESSION["cms_auth_site"]) as $item) {

               if(intval($item["checking"]) > time()-10){
                   $export[] = [
                       "owner"         => $item["owner"],
                       "trackCode"     => $item["trackCode"],
                       "plaque"        => $item["plaque"],
                       "longitude"     => $item["longitude"],
                       "latitude"      => $item["latitude"],
                       "checking"      => $item["checking"],
                       "speed"         => $item["speed"],
                       "color"         => "green"
                   ];
               }

            }

            Header::jsonResult("success","Başarılı","Veri ekte",$export);



        }catch (\Exception $exception){
            Header::jsonResult("error","HATA",$exception->getMessage(),[]);
        }



    }



    public static function uuid($prefix = ""){
        return $prefix.rand(1111,9999)."-".rand(1234,9876)."-".rand(2343,7798);
    }


}