"use client"

import { zodResolver } from '@hookform/resolvers/zod';
import { set, useForm, useFormState } from "react-hook-form";
import InputField from '../InputField';
import { ispitSchema, IspitSchema, predmetSchema, PredmetSchema } from '@/app/lib/formValidation';
import { azurirajPredmet, azurirajTest, napraviPredmet, napraviTest } from '@/app/lib/dogadjaji';
import { Dispatch, SetStateAction, useActionState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';

const IspitForma = ({ type, data, relatedData, setOpen }: {
    type: "create" | "update"; data?: any;
    setOpen: Dispatch<SetStateAction<boolean>>; relatedData?: any;
}) => {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<IspitSchema>({
        resolver: zodResolver(ispitSchema),
    });

    const [state, formActions] = useActionState(
        type === "create" ? napraviTest : azurirajTest,
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
            toast(`Test je uspesno ${type === "create" ? "kreiran" : "azuriran"}!`)
            setOpen(false);
            router.refresh()
        }
    }, [state]);

    const { lekcije } = relatedData ;

    return (
        <form className="flex flex-col gap-8" onSubmit={onSubmit}>
            <h1 className='text-xl font-semibold'>{type === "create" ? "Dodaj nov test" : "Azuriraj test"}</h1>
            <div className='flex justify-between flex-wrap gap-4'>
                <InputField label="Naziv testa" name="naziv" defaultValue={data?.naziv} register={register} error={errors?.naziv} />
                <InputField label="Pocetak testa" name="pocetak" defaultValue={data?.pocetak} register={register} error={errors?.pocetak} type='dataTime-local'/>
                <InputField label="Kraj testa" name="kraj" defaultValue={data?.kraj} register={register} error={errors?.kraj} type='dataTime-local'/>

                {data && (<InputField label="Id" name="id" defaultValue={data?.id} register={register} error={errors?.id} hidden />)}
                <div className='flex flex-col gap-2 w-full md:w-1/4'>
                    <label className='text-xs text-gray-500'>Lekcija</label>
                    <select multiple className='ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full' 
                    {...register("lekcijaId")} defaultValue={data?.lekcija}>
                        {lekcije.map((lekcija: {id: number; ime: string;}) => (
                            <option value={lekcija.id} key={lekcija.id}>{lekcija.ime}</option>
                        ))}
                        <option value="muski">Muski</option>
                        <option value="zenski">Zenski</option>
                    </select>
                    {errors.lekcijaId?.message && <p className='text-xs text-red-400'>{errors.lekcijaId.message.toString()}</p>}
                </div>
            </div>

            {state.error && <span className='text-red-500'>Doslo je do greske prilikom dodavanja testa</span>}

            <button className='bg-blue-400 taxt-white p-2 rounded-md'>
                {type === "create" ? "Create" : "Update"}</button>
        </form>
    )
    
}

export default IspitForma