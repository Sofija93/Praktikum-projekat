import { auth } from "@clerk/nextjs/server";
import { prisma } from "../lib/prisma";
import Forme from "./Forme";

export type FormeContainerProps = {
table: "profesor" | "ucenik" | "roditelj" | "predmet" | "razred" | "lekcija" | "test" | "zadatak" | "rezultat" | "prisustva" | "event"
    | "objava";
    type: "create" | "update" | "delete";
    data?: any;
    id?: number | string;
    }

const FormeContainer = async ({ table, type, data, id }: 
    FormeContainerProps
) => {
    
    let relatedData = {};


    if (type !== "delete") {
        switch (table) {
            case "predmet":
                const  predmetProfesor = await prisma.profesor.findMany({
                    select: { id: true, ime: true, prezime: true },
                });
                relatedData = { profesori: predmetProfesor };
                break;
            case "razred":
                const  razredOcene = await prisma.ocene.findMany({
                    select: { id: true, nivo: true },
                });
                const  razredProfesori = await prisma.profesor.findMany({
                    select: { id: true, ime: true, prezime: true },
                });
                relatedData = { profesori: razredProfesori, ocene: razredOcene };
                break;
            case "profesor":
                const  profesorPredmeti = await prisma.predmet.findMany({
                    select: { id: true, ime: true },
                });
                relatedData = { predmeti: profesorPredmeti };
                break;

            case "ucenik":
                const  ucenikOcene = await prisma.ocene.findMany({
                    select: { id: true, nivo: true },
                });
                const  ucenikRazredi = await prisma.razred.findMany({
                    include:{_count:{select:{ucenici:true}}}
                });

                relatedData = { razredi: ucenikRazredi, ocene: ucenikOcene };
                break;

            case "test":
                const { userId, sessionClaims} = await auth();
                const role = (sessionClaims?.metadata as { role?: "admin" | "profesor" | "ucenik" | "roditelj"})?.role;

                const  testLekcije = await prisma.lekcija.findMany({
                    where: {
                        ...(role === "profesor" ? {profesorId: userId!} : {})
                    },
                    select: { id: true, ime: true},
                });

                relatedData = { lekcije: testLekcije };
                break;

                default:
                break;
        }
    }

    return (
        <div className=""><Forme table={table} type={type} data={data} id={id} 
        relatedData={relatedData}/></div>
    )
}

export default FormeContainer;