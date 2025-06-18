"use server"

import { IspitSchema, PredmetSchema, ProfesorSchema, RazredSchema, UcenikSchema } from "./formValidation"
import { prisma } from "./prisma";
import { auth, clerkClient } from "@clerk/nextjs/server";

type CurrentState = { success: boolean; error: boolean };

export const napraviPredmet = async (currentState: CurrentState, data: PredmetSchema) => {
    try {
        await prisma.predmet.create({
            data: {
                ime: data.ime,
                profesori: {
                    connect: data.profesori.map((profesorId) => ({ id: profesorId })),
                },
            }
        });

        return { success: true, error: false }
    } catch (error) {
        console.error("Error creating predmet:", error);
        return { success: false, error: true }
    }
}

export const azurirajPredmet = async (currentState: CurrentState, data: PredmetSchema) => {
    try {
        await prisma.predmet.update({
            where: {
                id: data.id,
            },
            data: {
                ime: data.ime,
                profesori: {
                    set: data.profesori.map((profesorId) => ({ id: profesorId })),
                },
            }
        });

        return { success: true, error: false }
    } catch (error) {
        console.error("Error creating predmet:", error);
        return { success: false, error: true }
    }
}

export const obrisiPredmet = async (currentState: CurrentState, data: FormData) => {

    const id = data.get("id") as string;
    try {
        await prisma.predmet.delete({
            where: {
                id: parseInt(id),
            }
        });

        return { success: true, error: false }
    } catch (error) {
        console.error("Error creating predmet:", error);
        return { success: false, error: true }
    }
}

export const napraviRazred = async (currentState: CurrentState, data: RazredSchema) => {
    try {
        await prisma.razred.create({
            data
        });

        return { success: true, error: false }
    } catch (error) {
        console.error("Error creating razdred:", error);
        return { success: false, error: true }
    }
}

export const azurirajRazred = async (currentState: CurrentState, data: RazredSchema) => {
    try {
        await prisma.razred.update({
            where: {
                id: data.id,
            },
            data
        });

        return { success: true, error: false }
    } catch (error) {
        console.error(error);
        return { success: false, error: true }
    }
}
export const obrisiRazred = async (currentState: CurrentState, data: FormData) => {

    const id = data.get("id") as string;
    try {
        await prisma.razred.delete({
            where: {
                id: parseInt(id),
            }
        });

        return { success: true, error: false }
    } catch (error) {
        console.error(error);
        return { success: false, error: true }
    }
}

export const napraviProfesora = async (currentState: CurrentState, data: ProfesorSchema) => {
    try {
        const user = await (await clerkClient()).users.createUser({
            username: data.username,
            password: data.password,
            firstName: data.ime,
            lastName: data.prezime

        })

        const predmetiArray = Array.isArray(data.predmeti)
          ? data.predmeti
          : data.predmeti
            ? [data.predmeti]
            : [];
        await prisma.profesor.create({
            data: {
                id: user.id,
                username: data.username,
                ime: data.ime,
                prezime: data.prezime,
                email: data.email,
                telefon: data.telefon,
                adresa: data.adresa,
                img: data.img,
                pol: data.pol,
                datumRodjenja: data.datumRodjenja,
                predmeti: {
                    connect: predmetiArray.map((predmetId: string) => ({
                        id: parseInt(predmetId)
                    }))
                }
            }
        });

        return { success: true, error: false }
    } catch (error) {
        console.error("Error creating razdred:", error);
        return { success: false, error: true }
    }
}

export const azurirajProfesora = async (currentState: CurrentState, data: ProfesorSchema) => {

    if (!data.id) {
        return { success: false, error: true }
    }
    try {
        const user = await (await clerkClient()).users.updateUser(data.id, {
            username: data.username,
            ...(data.password !== "" && { password: data.password }),
            firstName: data.ime,
            lastName: data.prezime

        })

        const predmetiArray = Array.isArray(data.predmeti)
          ? data.predmeti
          : data.predmeti
            ? [data.predmeti]
            : [];
        await prisma.profesor.update({
            where: {
                id: data.id
            },
            data: {
                ...(data.password !== "" && { password: data.password }),
                username: data.username,
                ime: data.ime,
                prezime: data.prezime,
                email: data.email,
                telefon: data.telefon,
                adresa: data.adresa,
                img: data.img,
                pol: data.pol,
                datumRodjenja: data.datumRodjenja,
                predmeti: {
                    set: predmetiArray.map((predmetId: string) => ({
                        id: parseInt(predmetId)
                    }))
                }
            }
        });

        return { success: true, error: false }
    } catch (error) {
        console.error(error);
        return { success: false, error: true }
    }
}
export const obrisiProfesora = async (currentState: CurrentState, data: FormData) => {

    const id = data.get("id") as string;
    try {

        await (await clerkClient()).users.deleteUser(id);
        await prisma.profesor.delete({
            where: {
                id: id,
            }
        });

        return { success: true, error: false }
    } catch (error) {
        console.error(error);
        return { success: false, error: true }
    }
}

export const napraviUcenika = async (currentState: CurrentState, data: UcenikSchema) => {

    try {
        const razredItem = await prisma.razred.findUnique({
            where: { id: data.razredId },
            include: { _count: { select: { ucenici: true } } }
        });

        if (razredItem && razredItem.brUcenika === razredItem._count.ucenici) {
            return { success: false, error: true };
        }

        const user = await (await clerkClient()).users.createUser({
            username: data.username,
            password: data.password,
            firstName: data.ime,
            lastName: data.prezime

        })
        await prisma.ucenik.create({
            data: {
                id: user.id,
                username: data.username,
                ime: data.ime,
                prezime: data.prezime,
                email: data.email,
                telefon: data.telefon,
                adresa: data.adresa,
                img: data.img,
                pol: data.pol,
                datumRodjenja: data.datumRodjenja,
                oceneId: data.ocenaId,
                razredId: data.razredId,
                roditeljId: data.roditeljId,
            }
        });

        return { success: true, error: false }
    } catch (error) {
        console.error("Error creating razdred:", error);
        return { success: false, error: true }
    }
}

export const azurirajUcenika = async (currentState: CurrentState, data: UcenikSchema) => {

    if (!data.id) {
        return { success: false, error: true }
    }
    try {
        const user = await (await clerkClient()).users.updateUser(data.id, {
            username: data.username,
            ...(data.password !== "" && { password: data.password }),
            firstName: data.ime,
            lastName: data.prezime

        })
        await prisma.ucenik.update({
            where: {
                id: data.id
            },
            data: {
                ...(data.password !== "" && { password: data.password }),
                username: data.username,
                ime: data.ime,
                prezime: data.prezime,
                email: data.email,
                telefon: data.telefon,
                adresa: data.adresa,
                img: data.img,
                pol: data.pol,
                datumRodjenja: data.datumRodjenja,
                oceneId: data.ocenaId,
                razredId: data.razredId,
                roditeljId: data.roditeljId,
            }
        });

        return { success: true, error: false }
    } catch (error) {
        console.error(error);
        return { success: false, error: true }
    }
}
export const obrisiUcenika = async (currentState: CurrentState, data: FormData) => {

    const id = data.get("id") as string;

    const { userId, sessionClaims } = await auth();
    const role = (sessionClaims?.metadata as { role?: string })?.role;
    
    try {

        await prisma.ucenik.delete({
            where: {
                id: id,
            }
        });

        return { success: true, error: false }
    } catch (error) {
        console.error(error);
        return { success: false, error: true }
    }
}

export const napraviTest = async (currentState: CurrentState, data: IspitSchema) => {

    const { userId, sessionClaims } = await auth();
    const role = (sessionClaims?.metadata as { role?: string })?.role;

    try {
        if(role === "profesor") {

        const profesorLekcija = await prisma.lekcija.findFirst({
            where:{
                profesorId: userId!,
                id: data.lekcijaId,
            }
        })

        if (!profesorLekcija){
            return {success: false, error: true}
        }
    }
        await prisma.ispit.create({
            data: {
                naziv: data.naziv,
                pocetak: data.pocetak,
                kraj: data.kraj,
                lekcijaId: data.lekcijaId,
            }
        });

        return { success: true, error: false }
    } catch (error) {
        console.error("Error creating ispit:", error);
        return { success: false, error: true }
    }
}

export const azurirajTest = async (currentState: CurrentState, data: IspitSchema) => {

    const { userId, sessionClaims } = await auth();
    const role = (sessionClaims?.metadata as { role?: string })?.role;

    try {

        if(role === "profesor") {

        const profesorLekcija = await prisma.lekcija.findFirst({
            where:{
                profesorId: userId!,
                id: data.lekcijaId,
            }
        })

        if (!profesorLekcija){
            return {success: false, error: true}
        }
        }

        await prisma.ispit.update({
            where:{
                id: data.id,
            },
            data: {
                naziv: data.naziv,
                pocetak: data.pocetak,
                kraj: data.kraj,
                lekcijaId: data.lekcijaId,
            }
        });

        return { success: true, error: false }
    } catch (error) {
        console.error("Error creating ispit:", error);
        return { success: false, error: true }
    }
}

export const obrisiTest = async (currentState: CurrentState, data: FormData) => {

    const id = data.get("id") as string;

    const { userId, sessionClaims } = await auth();
    const role = (sessionClaims?.metadata as { role?: string })?.role;

    try {
        await prisma.ispit.delete({
            where: {
                id: parseInt(id),
                ...(role === "profesor" ? { lekcija: { profesorId: userId! } } : {})
            }
        });

        return { success: true, error: false }
    } catch (error) {
        console.error("Error creating ispit:", error);
        return { success: false, error: true }
    }
}
