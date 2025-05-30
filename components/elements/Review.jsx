"use client";
import CursedEffect from "@/components/elements/CursedEffect";
export default function Review({ user, date, rating, review, reversed = false }){
    return(
    <>
        <div className="sm:w-[80%] w-[100%] sm:h-40 h-auto bg-[var(--background2)] p-3 rounded-lg">
            <div className="flex justify-between">
                <div className="flex items-center gap-2">
                    <div className="text-2xl font-bold">{reversed ? <CursedEffect>{user}</CursedEffect> : user}</div>
                    <div className="h-[75%] w-0.5 bg-black" />
                    <div className="text-xl">{date}</div>
                </div>

                <div className="text-xl font-bold">{rating}</div>
            </div>

            <div className="w-full h-0.5 my-2 bg-black" />

            <div className={`whitespace-pre-wrap ${reversed ? "scale-x-[-1] text-right" : ""}`}>{review}</div>
        </div>
    </>
    );
}
