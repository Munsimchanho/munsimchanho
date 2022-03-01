<?php
    $userInfo = array('Seongchan' => 'Seongchan1234', 'Chaerin' => '0904', 'Chanho' => 'Chanho1234', 'Junho' => 'Junho1234');
    session_cache_expire(360);
    session_start();

    if ($_POST['code'] == 'login'){
        if ($_POST['pw'] === $userInfo[$_POST['user']]){
            
            $_SESSION['loginInfo'] = $_POST['user'];
            echo "valid";
        }
        else{
            echo "wrong";
        }
    }
    else if ($_POST['code'] == 'check'){
        echo $_SESSION['loginInfo'];
    }
?>