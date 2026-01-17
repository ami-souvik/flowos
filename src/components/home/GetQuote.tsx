"use client";

import { useState } from "react";
import { useForm } from 'react-hook-form';
import { X } from "lucide-react";
import api from "@/lib/api";

const SIZES = [
  {
    label: "< 800 sq ft",
    value: 0
  },
  {
    label: "800 - 1000 sq ft",
    value: 1
  },
  {
    label: "1000 - 1200 sq ft",
    value: 2
  },
  {
    label: "> 1200 sq ft",
    value: 3
  }
]
const QUALITY = [
  {
    label: "Necessary",
    value: 0
  },
  {
    label: "Standard",
    value: 1
  },
  {
    label: "Premium",
    value: 2
  },
  {
    label: "Luxury",
    value: 3
  }
]
const COMBINATIONS = [
  // < 800 sq ft
  2.5,
  3,
  3.5,
  4,
  // 800 - 1000 sq ft
  3,
  3.5,
  4,
  4.5,
  // 1000 - 1200 sq ft
  4,
  4.5,
  5,
  6,
  // > 1200 sq ft
  5,
  6,
  7,
  8,
]

const Popup = ({ name, combination, handleClose }: { name: string, combination: number, handleClose: (v: boolean) => void }) => (
  <div
    onClick={() => handleClose(false)}
    className="fixed top-0 left-0 w-screen h-screen overflow-hidden bg-black/20 z-50 flex justify-center items-center">
    <div
      onClick={(e) => e.stopPropagation()}
      className="relative w-160 h-100 bg-white flex justify-center items-center">
      <X onClick={() => handleClose(true)} className="absolute right-8 top-6 w-8 h-8 cursor-pointer" />
      <div className="flex flex-col space-y-4 text-center">
        <h1 className="text-4xl">Hi, {name}</h1>
        <p className="text-3xl">Thanks for choosing Reflect Your Vibe.</p>
        <p className="text-3xl font-bold">Your estimated quote is {COMBINATIONS[combination]}L</p>
      </div>
    </div>
  </div>
)

type QuoteForm = {
  name: string
  phone: string
  email: string
  size: number
  quality: number
  requirement: string
}

export default function GetQuote() {
  const [show, setShow] = useState(false);
  const { register, handleSubmit, formState: { isValid }, getValues, reset, setValue } = useForm<QuoteForm>({
    defaultValues: {
      name: '',
      phone: '',
      email: '',
      size: -1,
      quality: -1,
      requirement: '',
    },
  });
  const onSubmit = (data: QuoteForm) => {
    // Send message to RYV
    api.post('/logs', {
      ...data,
      size: SIZES[data["size"]].label,
      quality: QUALITY[data["quality"]].label,
      quote: `Estimated quote is ${COMBINATIONS[Number(getValues("size") * 4) + Number(getValues("quality"))]}L`
    })
    setShow(true)
  }
  const handleClose = (shouldReset: boolean) => {
    if (shouldReset) {
      reset()
      setValue('quality', -1)
      setValue('requirement', '')
    }
    setShow(false)
  }
  return (
    <div id="getquote" className="w-full relative flex justify-center">
      <div className="w-full max-w-4xl py-12 px-4">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
          <label className="font-xl">Name:</label>
          <input {...register("name", { required: true })} type="text" className="w-full h-10 font-xl border-b border-zinc-500" />
          <label className="font-xl">Phone:</label>
          <input {...register("phone", { required: true })} type="text" className="w-full h-10 font-xl border-b border-zinc-500" />
          <label className="font-xl">Email:</label>
          <input {...register("email", { required: true })} type="text" className="w-full h-10 font-xl border-b border-zinc-500" />
          <div className="grid grid-cols-2 md:grid-cols-4 items-center gap-4">
            <label className="font-xl">Flat Size:</label>
            <select {...register("size", { required: true })} className="w-full py-3 px-2 bg-teal-700 text-white">
              <option value={-1} disabled hidden>Select an option</option>
              {SIZES.map(each => <option key={each.value} value={each.value}>{each.label}</option>)}
            </select>
            <label className="font-xl">Desired Quality:</label>
            <select {...register("quality", { required: true })} defaultValue={-1} className="w-full py-3 px-2 bg-teal-700 text-white">
              <option value={-1} disabled hidden>Select an option</option>
              {QUALITY.map(each => <option key={each.value} value={each.value}>{each.label}</option>)}
            </select>
          </div>
          <label className="font-xl">Detailed Requirement:</label>
          <textarea {...register("requirement")} rows={3} className="w-full font-xl border-b border-zinc-500" />
          <button type="submit" className={`relative w-60 p-4 cursor-pointer flex justify-between items-center text-xl text-white font-light ${isValid ? "bg-teal-700" : "bg-teal-700/40"}`}>
            <p>Get Quote</p>
          </button>
        </form>
        {show && <Popup name={getValues("name")} combination={Number(getValues("size") * 4) + Number(getValues("quality"))} handleClose={handleClose} />}
      </div>
    </div>
  );
}
