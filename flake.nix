{
   description = "Portfolio website";
   inputs = {
      nixpkgs.url = "nixpkgs/nixos-25.05";
      flake-utils.url = "github:numtide/flake-utils";
   };

   outputs =
      {
         self,
         nixpkgs,
         flake-utils,
      }:
      flake-utils.lib.eachDefaultSystem (
         system:
         let
            pkgs = import nixpkgs { inherit system; };
         in
         {
            devShells.default = pkgs.mkShell {
               buildInputs = with pkgs; [
                  nodejs_24
                  nodePackages.typescript
                  # npm
               ];

               shellHook = ''
                  exec ${pkgs.fish}/bin/fish
               '';

            };

         }
      );

}
