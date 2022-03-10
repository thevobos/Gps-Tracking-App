<?php
/**
 * Created by PhpStorm.
 * User: cengizakcan
 * Date: 22.05.2020
 * Time: 14:34
 */

namespace App\Main\Plugin\gpstracking\Model;


use Fix\Packages\Database\Database;

class car {


    public static function create_car($uuid,$siteCode,$trackCode,$title,$plaque,$owner){

        return Database::start()->insert("plugin_tracker")->set(["uuid","siteCode","trackCode","title","plaque","owner","ip","time"],[$uuid,$siteCode,$trackCode,$title,$plaque,$owner,$_SERVER["REMOTE_ADDR"],time()])->run(Database::Progress);

    }

    public static function list_car($siteCode){

        return Database::start()->select("plugin_tracker")->where(["siteCode"],[$siteCode])->run(Database::Multiple);

    }

    public static function remove_car($siteCode,$uuid){

        return Database::start()->delete("plugin_tracker")->where(["siteCode","uuid"],[$siteCode,$uuid])->run(Database::Progress);

    }

    public static function get_car($siteCode,$uuid){

        return Database::start()->select("plugin_tracker")->where(["siteCode","uuid"],[$siteCode,$uuid])->run(Database::Single);

    }

    public static function check_car($key){

        return Database::start()->select("plugin_tracker")->where(["trackCode"],[$key])->run(Database::Single);

    }


    public static function up_car($key){

        return Database::start()->update("plugin_tracker")->set(["checking"],[time()])->where(["trackCode"],[$key])->run(Database::Progress);

    }

    public static function track_car($key,$lat,$lng,$speed){

        return Database::start()->update("plugin_tracker")->set(["checking","latitude","longitude","speed"],[time(),$lat,$lng,$speed])->where(["trackCode"],[$key])->run(Database::Progress);

    }



}