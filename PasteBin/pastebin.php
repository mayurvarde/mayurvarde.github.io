<?php

// Create by Yehuda Eisenberg - https://gist.github.com/YehudaEi/63852176ab82b64c0b83dafe27b34a37

function random($len = 5){
    return substr(str_shuffle(str_repeat("0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789", $len)), 0, $len);
}

define('LINK_REGEX', '/^[a-zA-Z0-9\s]+$/u');

$uri = urldecode($_SERVER['REQUEST_URI']);
$uri = str_replace('/PasteBin/', '', $uri);
$uri = str_replace('pastebin.php', '', $uri);

if(!is_dir('./data')) mkdir('data');
if(!file_exists('./data/.htaccess')) file_put_contents('./data/.htaccess', 'deny from all');
if(!file_exists('./data/.htaccess')) file_put_contents('./data/.htaccess', 'deny from all');
if(!file_exists('./.htaccess')) file_put_contents('./.htaccess', "RewriteEngine On\nRewriteCond %{DOCUMENT_ROOT}%{REQUEST_URI} !-f\nRewriteCond %{DOCUMENT_ROOT}%{REQUEST_URI} !-d\nRewriteRule ^(.*)$ %{DOCUMENT_ROOT}/PasteBin/pastebin.php [L]");

if(isset($_POST['data']) && !empty($_POST['data'])){
    $random = random(5);
    while(file_exists('./data/'.$random.'.txt'))
        $random = random(5);
    file_put_contents('./data/'.$random.'.txt', $_POST['data']);
    header('Location: /PasteBin/'.$random);
}
elseif(!empty($uri) && preg_match(LINK_REGEX, $uri)){
    header('Content-Type: text/plain; charset=UTF-8');
    if(file_exists('./data/'.$uri.'.txt'))
        echo file_get_contents('./data/'.$uri.'.txt');
    else
        die('Not Found');
}
else{
    echo "<html><head><title>PasteBin</title></head><body><form method='post'><textarea name='data' rows='50' cols='250'></textarea><br><button type='submit'>Save</button></form><br><br><a href='https://gist.github.com/YehudaEi/63852176ab82b64c0b83dafe27b34a37'>View On GitHub</a></body></html>";
}
