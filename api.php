<?php

class MyAPI
{
    public function handleRequest()
    {
     function connectDB(){
        $mysqli = new mysqli(
            "localhost",
            "tm838",
            "5fQ%CY@5gYy475",
            "tm838_skips"
        ); 
        if ($mysqli->connect_error) {
            die($mysqli->connect_error);
            http_response_code(500);
            return null;
        }else { return $mysqli;}}

     function GETReq($mysqli){
            
            $result = $mysqli->query(
                "SELECT id,type,locName,lat,lon,imageLoc,pickedUp FROM skips WHERE pickedUp = 0"
            );
            if ($result->num_rows > 0) {
                $items = array();
                while($row = $result->fetch_assoc()) {
                    $items[] = $row;
                }
                header('content-type: application/json');
                http_response_code(200);
                echo json_encode($items);
            } else{http_response_code(204);}}


            function POSTReq($mysqli){   
                $id = $_REQUEST["id"];
                $type = $_REQUEST["type"];
                $locName = $_REQUEST["locName"];
                $lat = $_REQUEST["lat"];
                $lon = $_REQUEST["lon"];
                $imageLoc = $_REQUEST["imageLoc"];
                $pickedUp = $_REQUEST["pickedUp"];
                if(ctype_alnum($id)){
                     $insert = $mysqli->query(
                    "INSERT INTO skips (id,type,locName,lat,lon,imageLoc,pickedUp) VALUES (\"$id\",\"$type\", \"$locName\", \"$lat\", \"$lon\", \"$imageLoc\", \"$pickedUp\")"
                );
                
                
                echo json_encode($insert);
            } 
                else{ http_response_code(400);}}

        
                function PUTReq($mysqli){   
                    $id = $_REQUEST["id"];
                    $pickedUp = $_REQUEST["pickedUp"];
                    if(ctype_alnum($id)){
                         $insert = $mysqli->query(
                        "UPDATE skips SET pickedUp = \"$pickedUp\" WHERE id = \"$id\" ;"
                    );
                    
                    echo json_encode($insert);
                } 
                    else{ http_response_code(400);}}







        $mysqli = connectDB();
        if ($_SERVER['REQUEST_METHOD']==='GET') {
            GETReq($mysqli);
        } else if ($_SERVER['REQUEST_METHOD']==='POST') {
         POSTReq($mysqli);
        }  else if ($_SERVER['REQUEST_METHOD']==='PUT') {
            PUTReq($mysqli);
           } else {
            http_response_code(400);
        }
    }
}

$api = new MyAPI();
$api->handleRequest();
?>
