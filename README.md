# ZOO PLZEŇ PROJEKT
Zdravím!

Tento návod vás provede stažením kódu, nainstalováním závislostí (dependencies) a spuštěním aplikace na vašem počítači.

Projekt se skládá ze dvou částí:
- **Next.js** (Frontend)
- **Laravel** (Backend)

---

## Předpoklady

Před začátkem se ujistěte, že máte nainstalované následující nástroje:

- **Git** (pro stažení projektu)
- **Node.js** (v18 nebo novější, pro běh Next.js)
- **PHP >= 8.2** & **Composer**
- **MySQL / MariaDB** (např. v rámci XAMPP nebo samostatně)
- **PHP Rozšíření:** `pdo_mysql` a `iconv`

### Nastavení PHP rozšíření a limitů:
- **Windows (XAMPP):**
    - Otevřete soubor `php.ini` a odstraňte středník `;` na začátku řádků `;extension=pdo_mysql` a `;extension=iconv`.
- **Linux (Ubuntu/Debian):** Spusťte `sudo apt install php-mysql php-iconv`.
- **macOS:** Rozšíření jsou součástí PHP (případně je spravujte přes Homebrew).

> **Důležité:** V souboru `php.ini` najděte parametry `upload_max_filesize` a `post_max_size` a nastavte jejich hodnotu na `20M` nebo vyšší (doporučeno `25M` až `30M`).
> *(Cestu k aktivnímu souboru `php.ini` zjistíte příkazem `php --ini` v terminálu).*

---

## Naklonování repozitáře

Nejprve si stáhněte projekt do počítače a přejděte do jeho kořenové složky:

```bash
git clone https://github.com/janousek-petr/Zoo-Plzen.git
cd Zoo-Plzen
```

## Příprava databáze
1. Spusťte MySQL server (např. přes ovládací panel XAMPP).

2. Otevřete phpMyAdmin (`http://localhost/phpmyadmin`) nebo váš DB klient a vytvořte novou databázi:

    -   **Název databáze:** `zoo_plzen`

    -   **Sada znaků (Charset):** `utf8mb4`

    -   **Porovnávání (Collation):** `utf8mb4_unicode_ci`

## Instalace
### Možnost A: Automatická instalace (Doporučeno)
Z kořenového adresáře projektu spusťte automatický setup skript, který zkontroluje prostředí, vytvoří `.env` soubory, vygeneruje klíče, propojí storage a naplní databázi záznamy:

Bash
```
bash setup.sh
```
(Pokud nechcete promazat stávající databázi, můžete použít `bash setup.sh safe`).

### Možnost B: Ruční instalace
Pokud nepoužijete automatický setup, nainstalujte projekt ručně:

1. **Nastavení backendu (Laravel)**

Přejděte do složky backendu a nainstalujte Composer závislosti:

Bash
```
cd backend
composer install
```
Následně spusťte příkazy pro nastavení prostředí:

Bash
```
# Kopírování nastavení (upravte DB údaje v .env, pokud nepoužíváte root bez hesla)
cp .env.example .env

# Vygenerování klíče aplikace
php artisan key:generate

# Spuštění migrací a naplnění databáze seedery
php artisan migrate:fresh --seed

# Vytvoření odkazů na obrázky a média
php artisan storage:link
```

2. **Nastavení frontendu (Next.js)**

Přejděte do složky frontendu a nainstalujte NPM závislosti:

Bash
```
cd frontend
npm install
```
Vytvořte konfigurační soubor `.env.local`:

Bash
```
cp .env.example .env.local
```
Ujistěte se, že v souboru `.env.local` je nastavená URL adresa backendu:

`NEXT_PUBLIC_API_URL=http://localhost:8000`

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