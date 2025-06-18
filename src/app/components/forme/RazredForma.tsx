"use client"

import { zodResolver } from '@hookform/resolvers/zod';
import { set, useForm, useFormState } from "react-hook-form";
import InputField from '../InputField';
import { razredSchema, RazredSchema } from '@/app/lib/formValidation';
import { azurirajRazred, napraviRazred } from '@/app/lib/dogadjaji';
import { Dispatch, SetStateAction, useActionState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';

const RazredForma = ({ type, data, setOpen, relatedData }: {
    type: "create" | "update"; data?: any;
    setOpen: Dispatch<SetStateAction<boolean>>; relatedData?: any;
}) => {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<RazredSchema>({
        resolver: zodResolver(razredSchema),
    });

    const [state, formActions] = useActionState(
        type === "create" ? napraviRazred : azurirajRazred,
        {
            success: false,
            error: false,
        }
    );

    const router = useRouter();

    useEffect(() => {
        if (state.success) {
            toast(`Rarzed je uspesno ${type === "create" ? "kreiran" : "azuriran"}!`)
            setOpen(false);
            router.refresh()
        }
    }, [state]);

    const { profesori, ocene } = relatedData;

    return (
        <form className="flex flex-col gap-8" onSubmit={handleSubmit(formActions)}>
            <h1 className='text-xl font-semibold'>{type === "create" ? "Dodaj nov razred" : "Azuriraj razred"}</h1>
            <div className='flex justify-between flex-wrap gap-4'>
                <InputField label="Razred" name="ime" defaultValue={data?.ime} register={register} error={errors?.ime} />
                <InputField label="Broj ucenika" name="brUcenika" defaultValue={data?.brUcenika} register={register} error={errors?.brUcenika} />
                {data && (<InputField label="Id" name="id" defaultValue={data?.id} register={register} error={errors?.id} hidden />)}
                <div className='flex flex-col gap-2 w-full md:w-1/4'>
                    <label className='text-xs text-gray-500'>Razredni</label>
                    <select className='ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full' {...register("razredniId")}
                        defaultValue={data?.razredniId || ""}>
                        {profesori.map((profesor: { id: string; ime: string; prezime: string }) => (
                            <option value={profesor.id} key={profesor.id}>
                                {profesor.ime + " " + profesor.prezime}
                            </option>
                        ))}
                    </select>
                    {errors.razredniId?.message && <p className='text-xs text-red-400'>{errors.razredniId.message.toString()}</p>}
                </div>
                <div className='flex flex-col gap-2 w-full md:w-1/4'>
                    <label className='text-xs text-gray-500'>Ocene</label>
                    <select className='ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full' {...register("oceneId")}
                        defaultValue={data?.oceneId || ""}>
                        {ocene.map((ocene: { id: number; nivo: number }) => (
                            <option value={ocene.id} key={ocene.id}>{ocene.nivo}</option>
                        ))}
                    </select>
                    {errors.oceneId?.message && <p className='text-xs text-red-400'>{errors.oceneId.message.toString()}</p>}
                </div>
            </div>

            {state.error && <span className='text-red-500'>Doslo je do greske prilikom dodavanja razreda</span>}

            <button className='bg-blue-400 taxt-white p-2 rounded-md'>
                {type === "create" ? "Create" : "Update"}</button>
        </form>
    )
}

export default RazredForma