import { Dan, PrismaClient, Pol} from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
    //ADMIN 
    await prisma.admin.create({
        data: {
            id: "admin1",
            username: "admin1",
        }
});
await prisma.admin.create({
        data: {
            id: "admin2",
            username: "admin2",
        }
});

//OCENE
for (let i = 1; i <= 10; i++) {
    await prisma.ocene.create({
        data: {
            nivo: i,
        }
    });
}

//RAZREDI
for (let i = 1; i <= 10; i++) {
    await prisma.razred.create({
        data: {
            id: i,
            ime: `${i}i`,
            oceneId: i,
            brUcenika: Math.floor(Math.random() * (20 - 15 + 1)) + 15,
        }
    });
}
//PREDMETI
const predmeti = [
    {ime:"Matematika"},
    {ime:"Fizika"},
    {ime:"Hemija"},
    {ime:"Biologija"},
    {ime:"Istorija"},
    {ime:"Geografija"},
    {ime:"Engleski"},
    {ime:"Nemacki"},
    {ime:"Francuski"},
    {ime:"Srpski"},
    {ime:"Fizicko"},
    {ime:"Muzičko"},
    {ime:"Likovno"},
    {ime:"Tehničko"},
];

for (const predmet of predmeti) {
    await prisma.predmet.create({
        data: predmet
    });
}

//PROFESORI
for (let i = 1; i <= 15; i++) {
    await prisma.profesor.create({
        data: {
            id: `profesor${i}`,
            username: `profesor${i}`,
            ime: `ImeProfesora ${i}`,
            prezime: `PrezimeProfesora ${i}`,
            email: `profesor${i}@mail.com`,
            telefon: `064123456${i}`,
            adresa: `Adresa ${i}`,
            pol: i % 2 === 0 ? Pol.MUSKO : Pol.ZENSKO,
            predmeti: {
                connect: [{ id: (i % 10) + 1 }]},
            razredi: {
                connect: [{ id: (i % 6) + 1 }]},
            datumRodjenja: new Date (new Date().setFullYear(new Date().getFullYear() - 30)),
        }
    });
}
//LEKCIJE
for (let i = 1; i <= 30; i++) {
    await prisma.lekcija.create({
        data: {
            ime: `Lekcija ${i}`,
            dan: Dan[
                Object.keys(Dan)[
                Math.floor( Math.random() * Object.keys(Dan).length)
            ] as keyof typeof Dan
            ],
            pocetak: new Date(new Date().setHours(new Date().getHours() + 1)),
            kraj: new Date(new Date().setHours(new Date().getHours() + 3)),
            predmetId: (i % 10) + 1,
            razredId: (i % 6) + 1,
            profesorId: `profesor${(i % 15) + 1}`,

        }
    });
}

//RODITELJI
for (let i = 1; i <= 25; i++) {
    await prisma.roditelj.create({
        data: {
            id: `roditelj${i}`,
            username: `roditelj${i}`,
            ime: `ImeRoditelja ${i}`,
            prezime: `PrezimeRoditelja ${i}`,
            email: `roditelj${i}@mail.com`,
            telefon: `064123456${i}`,
            adresa: `Adresa ${i}`,
    },
    });
}
//UCENICI
for (let i = 1; i <= 50; i++) {
    await prisma.ucenik.create({
        data: {
            id: `ucenik${i}`,
            username: `ucenik${i}`,
            ime: `ImeUcenika ${i}`,
            prezime: `PrezimeUcenika ${i}`,
            email: `ucenik${i}@mail.com`,
            telefon: `064123456${i}`,
            adresa: `Adresa ${i}`,
            pol: i % 2 === 0 ? Pol.MUSKO : Pol.ZENSKO,
            roditeljId: `roditelj${Math.ceil(i/2)%25 || 25}`,
            oceneId: (i % 6) + 1,
            razredId: (i % 10) + 1,
            datumRodjenja: new Date (new Date().setFullYear(new Date().getFullYear() - 10)),
        },
    });
}

//ISPIT
for (let i = 1; i <= 10; i++) {
    await prisma.ispit.create({
        data: {
            naziv: `Ispit ${i}`,
            pocetak: new Date(new Date().setHours(new Date().getHours() + 1)),
            kraj: new Date(new Date().setHours(new Date().getHours() + 2)),
            lekcijaId: (i % 30) + 1,
        }
    });
}

//ZADACI
for (let i = 1; i <= 10; i++) {
    await prisma.zadatak.create({
        data: {
            naziv: `Zadatak ${i}`,
            pocetak: new Date(new Date().setHours(new Date().getHours() + 1)),
            kraj: new Date(new Date().setDate(new Date().getDate() + 1)),
            lekcijaId: (i % 30) + 1,
        }
    });
}
//REZULTATI
for (let i = 1; i <= 10; i++) {
    await prisma.rezultat.create({
        data: {
            rezultat: 90,
            ucenikId: `ucenik${i}`,
            ...(i <= 5 ? {ispitId: i} : {zadatakId: i - 5}),
        }
    });
}
//PRISUSTVO
for (let i = 1; i <= 10; i++) {
    await prisma.prisustvo.create({
        data: {
            datum: new Date(),
            prisutan: true,
            ucenikId: `ucenik${i}`,
            lekcijaId: (i % 30) + 1,
        }
    });
}

//DOGADJAJI
for (let i = 1; i <= 5; i++) {
    await prisma.dogadjaj.create({
        data: {
            naziv: `Dogadjaj ${i}`,
            opis: `Opis ${i}`,
            pocetak: new Date(new Date().setHours(new Date().getHours() + i)),
            kraj: new Date(new Date().setHours(new Date().getHours() + i + 2)),
            razredId: (i % 5) + 1,
        }
    });
}

//NOVOSTI
for (let i = 1; i <= 5; i++) {
    await prisma.novosti.create({
        data: {
            naziv: `Novost ${i}`,
            opis: `Opis ${i}`,
            datum: new Date(),
            razredId: (i % 5) + 1,
        }
    });
}


}

main()
  .catch((e) => {
    console.error('SEED ERROR:', e);
    if (e instanceof Error && e.stack) {
      console.error('STACK TRACE:', e.stack);
    }
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

process.on('unhandledRejection', (reason, promise) => {
  console.error('UNHANDLED REJECTION:', reason);
  process.exit(1);
});