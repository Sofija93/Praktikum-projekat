
const trenutnaNedelja = () => {
    const danas = new Date();
    const danUNedelji = danas.getDay();

    const pocetakNedelje = new Date(danas);

        if(danUNedelji === 0){
            pocetakNedelje.setDate(danas.getDate() + 1);
        }

        if (danUNedelji === 6){
            pocetakNedelje.setDate(danas.getDate() + 2);
        } else {
            pocetakNedelje.setDate(danas.getDate() - (danUNedelji - 1));
        }
        pocetakNedelje.setHours(0, 0, 0, 0);

        return pocetakNedelje;
}

export const prilagodjavanjeRasporeda = (lekcije:{naziv:string;pocetak:Date;kraj:Date}[])
    :{naziv:string;pocetak:Date;kraj:Date}[] => {

        const pocetakNedelje = trenutnaNedelja()

        return lekcije.map((lekcija) => {
            const lekcijaDanUNedelji = lekcija.pocetak.getDay();

            const daniOdPonedeljka = lekcijaDanUNedelji === 0 ? 6 : lekcijaDanUNedelji - 1;

            const prilagodiPocetak = new Date(pocetakNedelje);

            prilagodiPocetak.setDate(pocetakNedelje.getDate() + daniOdPonedeljka);
            prilagodiPocetak.setHours(                
                lekcija.pocetak.getHours(),
                lekcija.pocetak.getMinutes(), 
                lekcija.pocetak.getSeconds()
            );

            const prilagodiKraj = new Date(prilagodiPocetak);

            prilagodiKraj.setHours(                
                lekcija.kraj.getHours(),
                lekcija.kraj.getMinutes(), 
                lekcija.kraj.getSeconds()
            );

            return {
                naziv: lekcija.naziv,
                pocetak: prilagodiPocetak,
                kraj: prilagodiKraj,
            };
        });
}