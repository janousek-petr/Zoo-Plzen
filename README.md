ZOO PLZEŇ PROJEKT
-
Zdravím! <br>
Tento návod vás provede stažením kódu, nainstalování dependencies a spuštěním aplikace na vašem počítači.

Projekt se skládá ze dvou částí
1. Next.js (Frontend)
2. Laravel (Backend)

Předpoklady
-
<b>Před začátkem se ujistěte, že máte nainstalované následující nástroje</b>
- Git (pro stažení projektu)
- Node.js (pro běh Next.js) 
- XAMPP a Composer (pro běh laravelu a databáze)

Naklonování repozitáře
-
Nejprve si stáhněte projekt k sobě do počítače a přejděte do jeho hlavní složky <br><br>
`git clone https://github.com/janousek-petr/Zoo-Plzen.git` <br>
`cd Zoo-Plzen` <br>

Nastavení FRONTENDU (Next.js a Axios)
- 
Přejděte do frontend složky <br>

`cd frontend` <br>

Nainstalujte závislosti <br>

`npm install` <br>

`npm run dev` <br>

Nastavení BACKENDU (Laravel a Breeze)
-
`cd backend` <br>

`composer install` <br>

`cp .env.example .env` <br>

`php artisan key:generate` <br>

`php artisan migrate`

`php artisan serve`








