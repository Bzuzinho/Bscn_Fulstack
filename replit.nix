{ pkgs }: {
  deps = [
    pkgs.git
    pkgs.nodejs-20_x
    pkgs.php83
    pkgs.composer
    pkgs.sqlite
    pkgs.unzip
  ];
}
