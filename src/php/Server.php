<?php
	// print_r($_POST);
	// print_r($_FILES);

    if ($_POST['code'] == "UpdateImage"){
        echo "good";
        
        // rm
        unlink($_POST['delete']);

        // upload, rename
        move_uploaded_file($_FILES['file']['tmp_name'], "../../User/" . $_POST['user'] . "/" . $_POST['name']);
    }
    else if ($_POST['code'] == "UpdateJson"){
        file_put_contents("../../User/" . $_POST['user'] . "/StickerInfo.json", $_POST['json']);
    }
    else if ($_POST['code'] == "UpdateDirectoryInfo"){
        file_put_contents("../../User/" . $_POST['user'] . "/DirectoryInfo.json", $_POST['json']);
    }
    else if ($_POST['code'] == "UploadFile"){
        move_uploaded_file($_FILES['file']['tmp_name'], "../../User/" . $_POST['user'] . "/Files/" . $_POST['name']);
    }
    else if ($_POST['code'] == "DeleteFile"){
        unlink($_POST['dir']);
    }
    else if ($_POST['code'] == "UpdatePageInfo"){
        file_put_contents("../../User/" . $_POST['user'] . "/PageInfo.json", $_POST['json']);
    }
?>