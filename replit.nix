{ pkgs }: {
  deps = [
    pkgs.nano
    pkgs.git
    pkgs.unzip
    pkgs.sqlite
    pkgs.nodejs-20_x
    pkgs.php83
    pkgs.composer
    pkgs.php83Extensions.curl
    pkgs.php83Extensions.mbstring
    pkgs.php83Extensions.dom
    pkgs.php83Extensions.fileinfo
    pkgs.php83Extensions.tokenizer
    pkgs.php83Extensions.pdo_mysql
    pkgs.php83Extensions.sqlite3
  ];
}
