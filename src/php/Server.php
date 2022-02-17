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
        print_r($_POST['json']);
    }
?>