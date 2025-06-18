
import BigCalendarContainer from "@/app/components/BigCalendarContainer"
import FormeContainer from "@/app/components/FormeContainer"
import Novosti from "@/app/components/Novosti"
import Performance from "@/app/components/Performance"
import { prisma } from "@/app/lib/prisma"
import { auth } from "@clerk/nextjs/server"
import { Profesor } from ".prisma/client"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"

const PojedinacniProfesor = async ({ params }: { params: { id: string } }) => {

    const { userId, sessionClaims } = await auth();
    const role = (sessionClaims?.metadata as { role?: string })?.role;

    const profesor: (Profesor & { _count: { predmeti: number; lekcije: number; razredi: number } })
        | null = await prisma.profesor.findUnique({
            where: { id: params.id },
            include: {
                _count: {
                    select: {
                        predmeti: true,
                        lekcije: true,
                        razredi: true
                    }
                }
            }
        })

    if (!profesor) {
        return notFound();
    }

    return (
        <div className="flex-1 p-4 flex flex-col gap-4 xl:flex-row">
            {/* LEFT */}
            <div className="w-full xl:w-2/3">
                {/*TOP*/}
                <div className="flex flex-col lg:flex-row gap-4">
                    {/* USER INFO CARD */}
                    <div className="bg-lamaSky py-6 px-4 rounded-md flex-1 flex gap-4">
                        <div className="w-1/3">
                            < Image src={profesor.img || "/noAvatar.png"}
                                alt="" width={144} height={144} className="w-36 h=36 rounded-full object-cover" />
                        </div>
                        <div className="w-2/3 flex flex-col justify-between gap-4">
                            <div className="flex items-center gap-4">
                                <h1 className="text-xl font-semibold">{profesor.ime + " " + profesor.prezime}</h1>
                                {role === "admin" && (
                                    <FormeContainer table="profesor" type="update" data={profesor} />
                                )}
                            </div>

                            <p className="text-sm text-gray-500">
                                Lorem, ipsum dolor sit amet consectetur adipisicing elit.
                            </p>
                            <div className="flex items-center justify-between gap-2 flex-wrap text-xs font-medium">
                                <div className="w-full md:w-1/3 lg:w-full 2xl:w-13 flex items-center gap-2">
                                    <Image src='/datum.png' alt='' width={14} height={14} />
                                    <span>{new Intl.DateTimeFormat("en-GB").format(profesor.datumRodjenja)}</span>
                                </div>
                                <div className="w-full md:w-1/3 lg:w-full 2xl:w-13 flex items-center gap-2">
                                    <Image src='/mail.png' alt='' width={14} height={14} />
                                    <span>{profesor.email || "-"}</span>
                                </div>
                                <div className="w-full md:w-1/3 lg:w-full 2xl:w-13 flex items-center gap-2">
                                    <Image src='/telefon.png' alt='' width={14} height={14} />
                                    <span>{profesor.telefon || "-"}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/*SMALL CARDS */}
                    <div className="flex-1 flex gap-4 justify-between flex-wrap">
                        {/* CARD */}
                        <div className="bg-white p-4 rounded-md flex gap-4 w-full md:w-[48%] xl:w-[45%] 2xl:w-[48%]">
                            <Image src="/prisustvo.png" alt="" width={24} height={24} className="w-6 h-6" />
                            <div className="">
                                <h1 className="text-xl font-semibold">90%</h1>
                                <span className="text-sm text-gray-400">Prisustvo</span>
                            </div>
                        </div>
                        {/* CARD */}
                        <div className="bg-white p-4 rounded-md flex gap-4 w-full md:w-[48%] xl:w-[45%] 2xl:w-[48%]">
                            <Image src="/predmeti.png" alt="" width={24} height={24} className="w-6 h-6" />
                            <div className="">
                                <h1 className="text-xl font-semibold">{profesor._count.predmeti}</h1>
                                <span className="text-sm text-gray-400">Oblasti</span>
                            </div>
                        </div>
                        {/* CARD */}
                        <div className="bg-white p-4 rounded-md flex gap-4 w-full md:w-[48%] xl:w-[45%] 2xl:w-[48%]">
                            <Image src="/lekcija.png" alt="" width={24} height={24} className="w-6 h-6" />
                            <div className="">
                                <h1 className="text-xl font-semibold">{profesor._count.lekcije}</h1>
                                <span className="text-sm text-gray-400">Lekcije</span>
                            </div>
                        </div>
                        {/* CARD */}
                        <div className="bg-white p-4 rounded-md flex gap-4 w-full md:w-[48%] xl:w-[45%] 2xl:w-[48%]">
                            <Image src="/razred.png" alt="" width={24} height={24} className="w-6 h-6" />
                            <div className="">
                                <h1 className="text-xl font-semibold">{profesor._count.razredi}</h1>
                                <span className="text-sm text-gray-400">Razred</span>
                            </div>
                        </div>
                    </div>
                </div>
                {/* BOTTOM */}
                <div className="mt-4 bg-white rounded-md p-4 h-[800px]">
                    <h1>Raspored profesora</h1>
                    <BigCalendarContainer type="profesorId" id={profesor.id} />
                </div>
            </div>
            {/* Right */}
            <div className="w-full xl:w-1/3 flex flex-col gap-4">
                <div className="bg-white p-4 rounded-md">
                    <h1 className="text-xl font-semibold">Precice</h1>
                    <div className="mt-4 flex gap-4 flex-wrap text-xs text-gray-500">
                        <Link className="p-3 rounded-md bg-sSkyLight" href={`/list/razredi?razredniId=${profesor.id}`}>Razredi</Link>
                        <Link className="p-3 rounded-md bg-sPurpleLight" href={`/list/ucenici?profesorId=${profesor.id}`}>Ucenici</Link>
                        <Link className="p-3 rounded-md bg-sYellowLight" href={`/list/lekcije?profesorId=${profesor.id}`}>Lekcije</Link>
                        <Link className="p-3 rounded-md bg-pink-50" href={`/list/ispiti?profesorId=${profesor.id}`}>Ispiti</Link>
                        <Link className="p-3 rounded-md bg-sSkyLight" href={`/list/zadaci?profesorId=${profesor.id}`}>Zadaci</Link>
                    </div>
                </div>
                <Performance />
                <Novosti />
            </div>
        </div>
    )
}

export default PojedinacniProfesor