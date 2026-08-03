ZOO PLZEŇ PROJEKT
-  
Zdravím! <br>  
Tento návod vás provede stažením kódu, nainstalování dependencies a spuštěním aplikace na vašem počítači.

Projekt se skládá ze dvou částí
- Next.js (Frontend)
- Laravel (Backend)

Předpoklady
-  
<b>Před začátkem se ujistěte, že máte nainstalované následující nástroje</b>  
- **Git** (pro stažení projektu)
- **Node.js** (v18 nebo novější, pro běh Next.js)
- **PHP >= 8.2** & **Composer**
- **MySQL / MariaDB** (např. v rámci XAMPP)
- **PHP Rozšíření:** `pdo_mysql` a `iconv`
###  Nastavení PHP rozšíření:
- **Windows (XAMPP):** Otevřete soubor `php.ini` a odstraňte středník `;` na začátku řádků `;extension=pdo_mysql` a `;extension=iconv`.
- **Linux (Ubuntu/Debian):** Spusťte `sudo apt install php-mysql php-iconv`.
- **macOS:** Rozšíření jsou součástí PHP (případně spravujte přes Homebrew).

Naklonování repozitáře
-  
Nejprve si stáhněte projekt k sobě do počítače a přejděte do jeho hlavní složky <br>
`git clone https://github.com/janousek-petr/Zoo-Plzen.git` <br>  
`cd Zoo-Plzen` <br>

## Příprava databáze

1.  Spusťte MySQL (např. přes ovládací panel XAMPP).

2.  Otevřete phpMyAdmin (`http://localhost/phpmyadmin`) a vytvořte novou databázi:

    -   **Název databáze:** `zoo_plzen`

    -   **Sada znaků (Charset):** `utf8mb4`

    -   **Porovnávání (Collation):** `utf8mb4_unicode_ci`

Nastavení FRONTENDU (Next.js a Axios)
-
Přejděte do frontend složky <br>
`cd frontend` <br>

Nainstalujte závislosti <br>
`npm install` <br>

Nastavení BACKENDU (Laravel a Breeze)
-  
Přejděte do složky backendu:
`cd backend` <br>  
Nainstalujte závislosti Composeru:
`composer install` <br>

### Automatická instalace (Doporučeno):

Spusťte automatický setup skript, který zkontroluje prostředí, vytvoří `.env`, vygeneruje klíče, propojí storage a naplní databázi záznamy:

Bash

```
composer run setup

```

_(Pokud nechcete promazat stávající databázi, můžete použít `composer run setup-safe`)_.

### Alternativa: Ruční instalace (krok za krokem):

Pokud nepoužijete automatický setup, spusťte příkazy ručně:

Bash

```
# Kopírování nastavení (upravte DB údaje v .env pokud nepoužíváte root bez hesla)
cp .env.example .env

# Vygenerování klíče aplikace
php artisan key:generate

# Spuštění migrací a naplnění databáze seedery
php artisan migrate:fresh --seed

# Vytvoření odkazů na obrázky
php artisan storage:link
```

Do souboru .env přidejte <b>NEXT_PUBLIC_API_URL=http://localhost:8000</b>

## Spuštění aplikace

Pro běh aplikace musíte mít spuštěné oba servery zároveň (ve dvou terminálech):

1.  **Backend (Terminál 1 - složka `backend`):**

    Bash

    ```
    php artisan serve
    
    ```

    _(Backend poběží na `http://localhost:8000`)_

2.  **Frontend (Terminál 2 - složka `frontend`):**

    Bash

    ```
    npm run dev
    
    ```

    _(Frontend poběží na `http://localhost:3000`)_


Nyní otevřete prohlížeč a přejděte na adresu **`http://localhost:3000`**.