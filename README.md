# 🏫 Informacioni sistem škole (School Management System)

Web aplikacija razvijena kao diplomski rad na Fakultetu za informatiku i računarstvo, Univerzitet Singidunum. 
Sistem predstavlja kompletno rešenje za digitalizaciju i upravljanje administrativnim i nastavnim procesima u obrazovnim ustanovama.

Omogućava ulogu-baziranu kontrolu pristupa (RBAC) za četiri tipa korisnika: **administratore, profesore, učenike i roditelje**.

## 🚀 Tehnologije

Projekat je izgrađen korišćenjem modernog *full-stack* TypeScript steka:
* **Frontend & Backend:** [Next.js](https://nextjs.org/) (App Router, Server Actions, TypeScript)
* **UI Biblioteka:** [React](https://react.dev/)
* **Stilizovanje:** [Tailwind CSS](https://tailwindcss.com/) (Utility-First pristup)
* **Baza podataka & ORM:** PostgreSQL preko [Prisma ORM-a](https://www.prisma.io/)
* **Autentifikacija & Upravljanje korisnicima:** [Clerk](https://clerk.com/) (@clerk/nextjs)
* **Validacija podataka:** Zod & React Hook Form
* **Kondejnerizacija:** Docker & Docker Compose

## 📋 Ključne funkcionalnosti

* **Role-Based Access Control (RBAC):** Centralizovani `middleware.ts` i `RouteAccessMap` štite rute i automatski preusmeravaju korisnike na osnovu njihovih uloga.
* **Administrativni Dashboard:** Pregled statistike (grafikoni preko Recharts), upravljanje korisničkim nalozima, razredima, predmetima i rasporedima.
* **Upravljanje entitetima (CRUD):** Dinamičke forme sa validacijom u realnom vremenu (Zod šeme) za unose ispita, ocena, prisustva i vesti.
* **Interaktivni kalendari:** Prikaz rasporeda časova i školskih događaja (React Big Calendar).
* **Optimizacija baze:** Implementirana globalna instanca Prisma klijenta (`prisma.ts`) koja sprečava greške sa višestrukim konekcijama tokom *hot-reload*-a u Next.js razvojnom okruženju.

---

## ⚙️ Pokretanje projekta lokalno

### Preduslovi
* Node.js (LTS verzija)
* Docker & Docker Compose (opciono, za bazu)

### Koraci za instalaciju:

1. **Klonirajte repozitorijum:**
   ```bash
   git clone [https://github.com/Sofija93/Praktikum-projekat.git](https://github.com/Sofija93/Praktikum-projekat.git)
   cd Praktikum-projekat

2. **Instaliranje zavisnosti:**
   Bash
   npm install.

3. **Podesite environment promenljive:**
   Kreirajte .env fajl u korenu projekta sa sledećim parametrima:
      DATABASE_URL="postgresqlid://korisnik:lozinka@localhost:5432/skola"
      NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=tvoj_clerk_kljuc
      CLERK_SECRET_KEY=tvoj_clerk_tajni_kljuc
      NEXT_PUBLIC_CLERK_SIGN_IN_URL=/

4. **Pokrenite migracije baze podataka:**
   npx prisma migrate dev

5. **Pokrenite aplikaciju u razvojnom režimu:**
   npm run dev

**Aplikacija će biti dostupna na adresi http://localhost:3000.**
