<?php
/**
 * Created by PhpStorm.
 * User: cengizakcan
 * Date: 22.05.2020
 * Time: 14:34
 */

namespace App\Main\Plugin\gpstracking\Model;


use Fix\Packages\Database\Database;
use Fix\Support\Header;

class live {


    public static function create_car($uuid,$siteCode,$trackCode,$title,$plaque,$owner){

        return Database::start()->insert("plugin_tracker")->set(["uuid","siteCode","trackCode","title","plaque","owner"],[$uuid,$siteCode,$trackCode,$title,$plaque,$owner])->run(Database::Progress);

    }



}