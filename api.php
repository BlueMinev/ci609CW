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
            if (isset($_REQUEST["id"])) {
                $id = $_REQUEST["id"];
                $pickedUp = $_REQUEST["pickedUp"];
                $insert = $mysqli->query(
                    "UPDATE skips SET pickedUp = \"$pickedUp\" WHERE id = \"$id\" ;"
                );
                $page = $_SERVER['PHP_SELF'];
                header("Location: ./index.html");
                echo json_encode($insert);
            } else if (isset($_REQUEST["type"]) && isset($_REQUEST["locName"]) && isset($_REQUEST["lat"]) && isset($_REQUEST["lon"]) && isset($_REQUEST["imageLoc"]) && isset($_REQUEST["pickedUp"])) {
                $type = $_REQUEST["type"];
                $locName = $_REQUEST["locName"];
                $lat = $_REQUEST["lat"];
                $lon = $_REQUEST["lon"];
                
                $pickedUp = $_REQUEST["pickedUp"];

                
                $target_dir = "res/";
                $target_file = $target_dir . basename($_FILES["imageLoc"]["name"]);
                $uploadOk = 1;
                $imageFileType = strtolower(pathinfo($target_file, PATHINFO_EXTENSION));
                $check = getimagesize($_FILES["imageLoc"]["tmp_name"]);
                if ($check !== false) {
                    echo "File is an image - " . $check["mime"] . ".";
                    $uploadOk = 1;
                } else {
                    echo "File is not an image.";
                    $uploadOk = 0;
                }
            }

            // Check if file already exists
            if (file_exists($target_file)) {
                echo "Sorry, file already exists.";
                $uploadOk = 0;
            }

            // Check file size
            if ($_FILES["imageLoc"]["size"] > 500000) {
                echo "Sorry, your file is too large.";
                $uploadOk = 0;
            }

            // Allow certain file formats
            if (
                $imageFileType != "jpg" && $imageFileType != "png" && $imageFileType != "jpeg"
                && $imageFileType != "gif"
            ) {
                echo "Sorry, only JPG, JPEG, PNG & GIF files are allowed.";
                $uploadOk = 0;
            }

            // Check if $uploadOk is set to 0 by an error
            if ($uploadOk == 0) {
                echo "Sorry, your file was not uploaded.";
                // if everything is ok, try to upload file
            } else {
                if (move_uploaded_file($_FILES["imageLoc"]["tmp_name"], $target_file)) {
                    echo "The file " . htmlspecialchars(basename($_FILES["imageLoc"]["name"])) . " has been uploaded.";
                    $imageLoc = $_FILES["imageLoc"]["tmp_name"];
                } else {
                    echo "Sorry, there was an error uploading your file.";
                    $imageLoc = "res/default.png";
                }
            }

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