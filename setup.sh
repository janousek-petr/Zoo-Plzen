#!/usr/bin/env bash

# Skript se ukončí, pokud jakýkoliv příkaz selže
set -e

# Barevný výstup do terminálu
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # Bez barvy

# Definice adresářů z pohledu kořene projektu
BACKEND_DIR="./backend"
FRONTEND_DIR="./frontend"

# Při jakékoliv chybě vypíše, kde skript spadl
trap 'echo -e "\n${RED}Setup selhal na řádku $LINENO. Oprav chybu výše a spusť skript znovu.${NC}"' ERR

echo -e "${GREEN}Spouštím automatický setup projektu...${NC}\n"

# 0. Kontrola nutných nástrojů
echo -e "[0/7] Kontrola nástrojů (php, composer, npm)..."
for cmd in php composer npm; do
    if ! command -v "$cmd" >/dev/null 2>&1; then
        echo -e "${RED}CHYBA: Příkaz '$cmd' nebyl nalezen v PATH.${NC}"
        [ "$cmd" == "composer" ] && echo -e "${YELLOW}Nainstaluj Composer z https://getcomposer.org/download/ a otevři nový terminál.${NC}"
        exit 1
    fi
done
echo -e "${GREEN}Nástroje jsou dostupné.${NC}"

# 1. CHECK-ENV: Kontrola PHP rozšíření
echo -e "\n[1/7] Kontrola PHP rozšíření (pdo_mysql, iconv)..."
php -r '
$exts = ["pdo_mysql", "iconv"];
foreach ($exts as $e) {
    if (!extension_loaded($e)) {
        echo "\033[0;31mCHYBA: Chybí PHP rozšíření: " . $e . "\033[0m" . PHP_EOL;
        exit(1);
    }
}
echo "PHP rozšíření (pdo_mysql, iconv) jsou OK!" . PHP_EOL;
' 2>&1 | grep -v -e "Unable to load dynamic library" -e '^$' || true
# (pipe výše by schoval chybu, proto kontrolujeme výsledek zvlášť)
php -r 'exit((extension_loaded("pdo_mysql") && extension_loaded("iconv")) ? 0 : 1);' 2>/dev/null || {
    echo -e "${RED}CHYBA: Chybí rozšíření pdo_mysql nebo iconv. Zkontroluj php.ini.${NC}"
    exit 1
}

# 2. CHECK-UPLOAD-LIMITS: Kontrola limitů pro nahrávání
echo -e "\n[2/7] Kontrola limitů pro nahrávání souborů..."
php -r '
$toB = function($v) {
    $v = trim($v);
    $last = strtolower($v[strlen($v)-1]);
    $val = (int)$v;
    switch($last) {
        case "g": $val *= 1024;
        case "m": $val *= 1024;
        case "k": $val *= 1024;
    }
    return $val;
};
$u = ini_get("upload_max_filesize");
$p = ini_get("post_max_size");
$ini = php_ini_loaded_file();
echo "Upload limit: {$u} | Post limit: {$p}" . PHP_EOL;
if ($toB($u) < 20*1024*1024 || $toB($p) < 20*1024*1024) {
    echo "\033[1;33mVAROVÁNÍ: Limity pro upload v {$ini} jsou nízké (potřeba >= 20M)!\033[0m" . PHP_EOL;
    echo "\033[1;33mHodnoty upravte v souboru php.ini.\033[0m" . PHP_EOL;
} else {
    echo "Upload limity jsou OK!" . PHP_EOL;
}
' 2>&1 | grep -v -e "Unable to load dynamic library" -e '^$' || true

# 3. PREPARE-MEDIA: Založení složek pro média
echo -e "\n[3/7] Příprava adresářů pro média..."
if [ -d "$BACKEND_DIR" ]; then
    # Pozor: public/storage NESMÍ být skutečná složka, vytvoří ji storage:link jako symlink
    mkdir -p "$BACKEND_DIR/storage/app/public/media"
    chmod -R 775 "$BACKEND_DIR/storage/app/public/media" 2>/dev/null || true

    echo -e "${GREEN}Složky pro média v backendu jsou připraveny.${NC}"
else
    echo -e "${RED}CHYBA: Složka $BACKEND_DIR neexistuje!${NC}"
    exit 1
fi

# 4. ENV SETUP: Kopírování .env.example
echo -e "\n[4/7] Kontrola .env souborů..."

# --- Backend ---
if [ ! -f "$BACKEND_DIR/.env" ]; then
    if [ -f "$BACKEND_DIR/.env.example" ]; then
        cp "$BACKEND_DIR/.env.example" "$BACKEND_DIR/.env"
        echo -e "${GREEN}Backend .env byl vytvořen z .env.example.${NC}"
    else
        echo -e "${RED}CHYBA: Backend .env neexistuje a .env.example nebyl nalezen.${NC}"
        exit 1
    fi
else
    echo -e "Backend .env již existuje."
fi

# --- Frontend ---
if [ -d "$FRONTEND_DIR" ]; then
    if [ ! -f "$FRONTEND_DIR/.env.local" ] && [ ! -f "$FRONTEND_DIR/.env" ]; then
        if [ -f "$FRONTEND_DIR/.env.example" ]; then
            cp "$FRONTEND_DIR/.env.example" "$FRONTEND_DIR/.env.local"
            echo -e "${GREEN}Frontend .env.local byl vytvořen z .env.example.${NC}"
        else
            echo -e "${YELLOW}Frontend .env.local neexistuje a .env.example nebyl nalezen (vytvoř ho ručně, pokud ho frontend potřebuje).${NC}"
        fi
    else
        echo -e "Frontend .env / .env.local již existuje."
    fi
fi

# 5. COMPOSER: PHP závislosti backendu
echo -e "\n[5/7] Kontrola Composer závislostí..."
if [ ! -f "$BACKEND_DIR/vendor/autoload.php" ]; then
    echo "Složka vendor chybí, spouštím composer install..."
    (cd "$BACKEND_DIR" && composer install --no-interaction)
    echo -e "${GREEN}Composer závislosti nainstalovány.${NC}"
else
    echo -e "Složka vendor již existuje."
fi

# 6. LARAVEL AKCE (podle režimu fresh / safe)
MODE=${1:-"fresh"}

echo -e "\n${YELLOW}Pozor: musí běžet MySQL a databáze z backend/.env musí existovat.${NC}"

if [ "$MODE" == "safe" ]; then
    echo -e "\n[6/7] Spouštím BEZPEČNÝ režim v backendu (migrate)..."
    # APP_KEY generujeme jen když je prázdný, aby se nepřepsal existující
    if ! grep -qE '^APP_KEY=.+' "$BACKEND_DIR/.env"; then
        (cd "$BACKEND_DIR" && php artisan key:generate)
    fi
    (cd "$BACKEND_DIR" && php artisan migrate --seed --force)
else
    echo -e "\n[6/7] Spouštím PLNOU instalaci v backendu (migrate:fresh)..."
    (cd "$BACKEND_DIR" && php artisan key:generate --force)
    (cd "$BACKEND_DIR" && php artisan migrate:fresh --seed --force)
fi

# storage:link na Windows může selhat bez práv pro symlinky, proto nepřerušuje skript
(cd "$BACKEND_DIR" && php artisan storage:link --force) || \
    echo -e "${YELLOW}storage:link selhal (na Windows spusť terminál jako správce nebo zapni Developer Mode).${NC}"

# 7. BUILD-ASSETS: Frontend
if [ -d "$FRONTEND_DIR" ]; then
    echo -e "\n[7/7] Zjištěna složka frontend, spouštím instalaci a build..."
    npm install --prefix "$FRONTEND_DIR"
    npm run build --prefix "$FRONTEND_DIR"
    echo -e "${GREEN}Frontend build dokončen.${NC}"
fi

echo -e "\n${GREEN}Vše proběhlo úspěšně! Projekt je kompletně nastaven.${NC}"