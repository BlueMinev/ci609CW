<?php

class MyAPI
{
    public function handleRequest()
    {
        function connectDB()
        {
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
            } else {
                return $mysqli;
            }
        }

        function GETReq($mysqli)
        {

            $result = $mysqli->query(
                "SELECT id,type,locName,lat,lon,imageLoc,pickedUp FROM skips WHERE pickedUp = 0"
            );
            if ($result->num_rows > 0) {
                $items = array();
                while ($row = $result->fetch_assoc()) {
                    $items[] = $row;
                }
                header('content-type: application/json');
                http_response_code(200);
                echo json_encode($items);
            } else {
                http_response_code(204);
            }
        }


        function POSTReq($mysqli)
        {
            if (isset($_REQUEST["id"]) ) {
                $id = $_REQUEST["id"];
                $pickedUp = $_REQUEST["pickedUp"];
                $insert = $mysqli->query(
                    "UPDATE skips SET pickedUp = \"$pickedUp\" WHERE id = \"$id\" ;"
                );
                $page = $_SERVER['PHP_SELF'];
                header("Location: ./index.html");
                echo json_encode($insert);
            } else if (isset($_REQUEST["type"])&& isset($_REQUEST["locName"])&& isset($_REQUEST["lat"])&& isset($_REQUEST["lon"])&& isset($_REQUEST["imageLoc"])&&isset($_REQUEST["pickedUp"])) {}
            $type = $_REQUEST["type"];
            $locName = $_REQUEST["locName"];
            $lat = $_REQUEST["lat"];
            $lon = $_REQUEST["lon"];
            $imageLoc = $_REQUEST["imageLoc"];
            $pickedUp = $_REQUEST["pickedUp"];
            if (ctype_alnum($id)) {
                $insert = $mysqli->query(
                    "INSERT INTO skips (type,locName,lat,lon,imageLoc,pickedUp) VALUES (\"$type\", \"$locName\", \"$lat\", \"$lon\", \"$imageLoc\", \"$pickedUp\")"
                );
                echo json_encode($insert);
            } else {
                http_response_code(400);
            }
        }


        function PUTReq($mysqli)
        {
            $id = $_REQUEST["id"];
            $pickedUp = $_REQUEST["pickedUp"];
            if (ctype_alnum($id)) {
                $insert = $mysqli->query(
                    "UPDATE skips SET pickedUp = \"$pickedUp\" WHERE id = \"$id\" ;"
                );
                header("Location: http://www.tm838.brighton.domains/SkipApp/index.html?test", true, 301);
                echo json_encode($insert);
            } else {
                http_response_code(400);
                header("Location: http://www.tm838.brighton.domains/SkipApp/index.html?failed", true);
            }
        }







        $mysqli = connectDB();
        if ($_SERVER['REQUEST_METHOD'] === 'GET') {
            GETReq($mysqli);
        } else if ($_SERVER['REQUEST_METHOD'] === 'POST') {
            POSTReq($mysqli);
        } else if ($_SERVER['REQUEST_METHOD'] === 'PUT') {
            PUTReq($mysqli);
        } else {
            http_response_code(400);
        }
    }
}

$api = new MyAPI();
$api->handleRequest();
?>