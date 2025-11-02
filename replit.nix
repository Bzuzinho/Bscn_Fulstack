{ pkgs }:

{
  deps = [
    pkgs.unzip
    pkgs.sqlite
    pkgs.php83Packages.composer
    pkgs.git
    pkgs.nodejs       # Já sabemos que existe
    pkgs.php          # Teste: versão default suportada pelo nixpkgs
    pkgs.entr
  ];

  shellHook = ''
    echo "=== Versões detectadas ==="
    php -v || echo "PHP não disponível"
    node -v || echo "Node não disponível"
  '';
}
