import BigCalendar from "@/app/components/BigCalendar"
import BigCalendarContainer from "@/app/components/BigCalendarContainer"
import FormeContainer from "@/app/components/FormeContainer"
import Novosti from "@/app/components/Novosti"
import Performance from "@/app/components/Performance"
import UcenikPrisustva from "@/app/components/UcenikPrisustva"
import { prisma } from "@/app/lib/prisma"
import { auth } from "@clerk/nextjs/server"
import { Razred, Ucenik } from ".prisma/client"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { Suspense } from "react"

const PojedinacniUcenik = async ({ params: { id } }: { params: { id: string } }) => {

    const { userId, sessionClaims } = await auth();
    const role = (sessionClaims?.metadata as { role?: string })?.role;

    const ucenik: (Ucenik & { razred: (Razred & { _count: { lekcije: number } }) }) | null = await prisma.ucenik.findUnique({
        where: { id },
        include: {
            razred: { include: { _count: { select: { lekcije: true } } } }
        }
    })

    if (!ucenik) {
        return notFound();
    }

    return (
        <div className="flex-1 p-4 flex flex-col gap-4 xl:flex-row">
            {/* LEFT */}
            <div className="w-full xl:w-2/3">
                {/*TOP*/}
                <div className="flex flex-col lg:flex-row gap-4">
                    {/* USER INFO CARD */}
                    <div className="bg-sSky py-6 px-4 rounded-md flex-1 flex gap-4">
                        <div className="w-1/3">
                            < Image src={ucenik.img || "/noAvatar.png"} alt="" width={144} height={144} 
                            className="w-36 h=36 rounded-full object-cover" />
                        </div>
                        <div className="w-2/3 flex flex-col justify-between gap-4">
                         <div className="flex items-center gap-4">
                            <h1 className="text-xl font-semibold">{ucenik.ime + " " + ucenik.prezime}</h1>
                            {role === "admin" && (
                                <FormeContainer table="ucenik" type="update" data={ucenik} />
                            )}
                            </div>
                            <p className="text-sm text-gray-500">
                                Lorem, ipsum dolor sit amet consectetur adipisicing elit.
                                Minima fuga consequuntur sapiente voluptas accusamus porro dignissimos nulla error in.
                            </p>
                            <div className="flex items-center justify-between gap-2 flex-wrap text-xs font-medium">
                                <div className="w-full md:w-1/3 lg:w-full 2xl:w-13 flex items-center gap-2">
                                    <Image src='/datum.png' alt='' width={14} height={14} />
                                    <span>{new Intl.DateTimeFormat("en-GB").format(ucenik.datumRodjenja)}</span>
                                </div>
                                <div className="w-full md:w-1/3 lg:w-full 2xl:w-13 flex items-center gap-2">
                                    <Image src='/mail.png' alt='' width={14} height={14} />
                                    <span>{ucenik.email || "-"}</span>
                                </div>
                                <div className="w-full md:w-1/3 lg:w-full 2xl:w-13 flex items-center gap-2">
                                    <Image src='/telefon.png' alt='' width={14} height={14} />
                                    <span>{ucenik.telefon || "-"}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/*SMALL CARDS */}
                    <div className="flex-1 flex gap-4 justify-between flex-wrap">
                        {/* CARD */}
                        <div className="bg-white p-4 rounded-md flex gap-4 w-full md:w-[48%] xl:w-[45%] 2xl:w-[48%]">
                            <Image src="/prisustvo.png" alt="" width={24} height={24} className="w-6 h-6" />
                            <Suspense fallback="loading...">
                                <UcenikPrisustva id={ucenik.id} />
                            </Suspense>

                        </div>
                        {/* CARD */}
                        <div className="bg-white p-4 rounded-md flex gap-4 w-full md:w-[48%] xl:w-[45%] 2xl:w-[48%]">
                            <Image src="/lekcija.png" alt="" width={24} height={24} className="w-6 h-6" />
                            <div className="">
                                <h1 className="text-xl font-semibold">{ucenik.razred.ime.charAt(0)}</h1>
                                <span className="text-sm text-gray-400">Ocena</span>
                            </div>
                        </div>
                        {/* CARD */}
                        <div className="bg-white p-4 rounded-md flex gap-4 w-full md:w-[48%] xl:w-[45%] 2xl:w-[48%]">
                            <Image src="/predmeti.png" alt="" width={24} height={24} className="w-6 h-6" />
                            <div className="">
                                <h1 className="text-xl font-semibold">{ucenik.razred._count.lekcije}</h1>
                                <span className="text-sm text-gray-400">Lekcije</span>
                            </div>
                        </div>
                        {/* CARD */}
                        <div className="bg-white p-4 rounded-md flex gap-4 w-full md:w-[48%] xl:w-[45%] 2xl:w-[48%]">
                            <Image src="/razred.png" alt="" width={24} height={24} className="w-6 h-6" />
                            <div className="">
                                <h1 className="text-xl font-semibold">4/5</h1>
                                <span className="text-sm text-gray-400">Razred</span>
                            </div>
                        </div>
                    </div>
                </div>
                {/* BOTTOM */}
                <div className="mt-4 bg-white rounded-md p-4 h-[800px]">
                    <h1>Raspored ucenika</h1>
                    <BigCalendarContainer type="razredId"  id={ucenik.razred.id}/>
                </div>
            </div>
            {/* Right */}
            <div className="w-full xl:w-1/3 flex flex-col gap-4">
                <div className="bg-white p-4 rounded-md">
                    <h1 className="text-xl font-semibold">Precice</h1>
                    <div className="mt-4 flex gap-4 flex-wrap text-xs text-gray-500">
                        <Link className="p-3 rounded-md bg-sPurpleLight" href={`/list/profesori?razredId=${ucenik.razred.id}`}>Profesori</Link>
                        <Link className="p-3 rounded-md bg-sYellowLight" href={`/list/lekcije?razredId=${ucenik.razred.id}`}>Lekcije</Link>
                        <Link className="p-3 rounded-md bg-sSkyLight" href={`/list/rezultati?ucenikId=${ucenik.id}`}>Rezultati</Link>
                        <Link className="p-3 rounded-md bg-pink-50" href={`/list/ispiti?razredId=${ucenik.razred.id}`}>Ispiti</Link>
                        <Link className="p-3 rounded-md bg-sSkyLight" href={`/list/zadaci?razredId=${ucenik.razred.id}`}>Zadaci</Link>
                    </div>
                </div>
                <Performance />
                <Novosti />
            </div>
        </div>
    )
}

export default PojedinacniUcenik