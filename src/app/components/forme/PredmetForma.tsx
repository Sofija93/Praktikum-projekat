"use client"

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm} from "react-hook-form";
import InputField from '../InputField';
import { predmetSchema, PredmetSchema } from '@/app/lib/formValidation';
import { azurirajPredmet, napraviPredmet } from '@/app/lib/dogadjaji';
import { Dispatch, SetStateAction, useActionState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';

const PredmetForma = ({ type, data, relatedData, setOpen }: {
    type: "create" | "update"; data?: any;
    setOpen: Dispatch<SetStateAction<boolean>>; relatedData?: any;
}) => {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<PredmetSchema>({
        resolver: zodResolver(predmetSchema),
    });

    const [state, formActions] = useActionState(
        type === "create" ? napraviPredmet : azurirajPredmet,
        {
            success: false,
            error: false,
        }
    );

    const onSubmit = handleSubmit(data => {
        console.log(data);
        formActions(data);
    })

    const router = useRouter();

    useEffect(() => {
        if (state.success) {
            toast(`Predmet je uspesno ${type === "create" ? "kreiran" : "azuriran"}!`)
            setOpen(false);
            router.refresh()
        }
    }, [state]);

    const { profesori } = relatedData ;

    return (
        <form className="flex flex-col gap-8" onSubmit={onSubmit}>
            <h1 className='text-xl font-semibold'>{type === "create" ? "Dodaj nov predmet" : "Azuriraj predmet"}</h1>
            <div className='flex justify-between flex-wrap gap-4'>
                <InputField label="Predmet" name="ime" defaultValue={data?.ime} register={register} error={errors?.ime} />
                {data && (<InputField label="Id" name="id" defaultValue={data?.id} register={register} error={errors?.id} hidden />)}
                <div className='flex flex-col gap-2 w-full md:w-1/4'>
                    <label className='text-xs text-gray-500'>Profesori</label>
                    <select multiple className='ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full' {...register("profesori")} defaultValue={data?.profesori}>
                        {profesori.map((profesor: {id: string; ime: string; prezime: string}) => (
                            <option value={profesor.id} key={profesor.id}>{profesor.ime + " " + profesor.prezime}</option>
                        ))}
                        <option value="muski">Muski</option>
                        <option value="zenski">Zenski</option>
                    </select>
                    {errors.profesori?.message && <p className='text-xs text-red-400'>{errors.profesori.message.toString()}</p>}
                </div>
            </div>

            {state.error && <span className='text-red-500'>Doslo je do greske prilikom dodavanja predmeta</span>}

            <button className='bg-blue-400 taxt-white p-2 rounded-md'>
                {type === "create" ? "Create" : "Update"}</button>
        </form>
    )
    
}

export default PredmetForma