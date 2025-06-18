"use client"

import Image from "next/image";
import { Dispatch, JSX, SetStateAction, useActionState, useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { obrisiPredmet, obrisiProfesora, obrisiRazred, obrisiTest, obrisiUcenika } from "../lib/dogadjaji";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { FormeContainerProps } from "./FormeContainer";

const deleteActionMap = {
    predmet: obrisiPredmet,
    razred: obrisiRazred,
    profesor: obrisiProfesora,
    ucenik: obrisiUcenika,
    test: obrisiTest,
    roditelj: obrisiPredmet,
    lekcija: obrisiPredmet,
    zadatak: obrisiPredmet,
    rezultat: obrisiPredmet,
    prisustva: obrisiPredmet,
    event: obrisiPredmet,
    objava: obrisiPredmet,
}

const ProfesorForma = dynamic(() => import("./forme/ProfesorForma"), {
    loading: () => <h1>Loading...</h1>
})
const UcenikForma = dynamic(() => import("./forme/UcenikForma"), {
    loading: () => <h1>Loading...</h1>
})
const PredmetForma = dynamic(() => import("./forme/PredmetForma"), {
    loading: () => <h1>Loading...</h1>
})
const RazredForma = dynamic(() => import("./forme/RazredForma"), {
    loading: () => <h1>Loading...</h1>
})
const IspitForma = dynamic(() => import("./forme/IspitForma"), {
    loading: () => <h1>Loading...</h1>
})

const forms: {
    [key: string]: (setOpen: Dispatch<SetStateAction<boolean>>,
        type: "create" | "update", data?: any, relatedData?: any) => JSX.Element;
} = {
    predmet: (setOpen, type, data, relatedData) => <PredmetForma type={type} data={data} setOpen={setOpen} relatedData={relatedData} />,
    profesor: (setOpen, type, data, relatedData) => <ProfesorForma type={type} data={data} setOpen={setOpen} relatedData={relatedData} />,
    ucenik: (setOpen, type, data, relatedData) => <UcenikForma type={type} data={data} setOpen={setOpen} relatedData={relatedData} />,
    razred: (setOpen, type, data, relatedData) => <RazredForma type={type} data={data} setOpen={setOpen} relatedData={relatedData} />,
    ispit: (setOpen, type, data, relatedData) => <IspitForma type={type} data={data} setOpen={setOpen} relatedData={relatedData} />,
};

const Forme = ({ table, type, data, id, relatedData }:
    FormeContainerProps & { relatedData?: any }
) => {
    const size = type === "create" ? "w-8 h-8" : "w-7 h-7";
    const bgColor =
        type === "create"
            ? "bg-sYellow"
            : type === "update"
                ? "bg-sSky"
                : "bg-sPurple";

    const [open, setOpen] = useState(false);

    const Form = () => {

        const [state, formAction] = useActionState(deleteActionMap[table], {
            success: false,
            error: false,
        });

        const router = useRouter();

        useEffect(() => {
            if (state.success) {
                toast(`${table} je uspesno obrisan!`)
                setOpen(false);
                router.refresh()
            }
        }, [state, router]);

        return type === "delete" && id ? (
            <form action={formAction} className="p-4 flex flex-col gap-4">
                <input type="hidden" name="id" defaultValue={id} />
                <span className="text-center font-medium">Da li ste sigurni? Svi podaci bice obrisani...{table}?</span>
                <button className="bg-red-700 text-white py-2 px-4 rounded-md border-none w-max self-center">Obrisi</button>
            </form>
        ) : type === "create" || type === "update" ? (
            forms[table](setOpen, type, data, relatedData
            )
        ) : (
            "GRESKA"
        );
    };

    return (
        <>
            <button className={`${size} flex items-center justify-center rounded-full ${bgColor}`}
                onClick={() => setOpen(true)}
            >
                <Image src={`/${type}.png`} alt="" width={16} height={16} />
            </button>
            {open &&
                (<div className="w-screen h-screen absolute left-0 top-0 bg-black bg-opacity-60 z-50 flex items-center justify-center">
                    <div className="bg-white p-4 rounded-md relative w-[90%] md:w-[70%] lg:w-[60%] xl:w-[50%] 2xl:w-[40%]">
                        <Form />
                        <div className="absolute top-4 right-4 cursor-pointer" onClick={() => setOpen(false)}>
                            <Image src="/close.png" alt="" width={14} height={14} />
                        </div>
                    </div>
                </div>
                )}
        </>
    )
}

export default Forme