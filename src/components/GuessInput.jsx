import React , {useState} from "react";

export default function GuessInput({placeholder,onGuessSubmit,disabled}){
    const [inputValue,setInputValue] = useState("");


    const cleanText = (text) => {
        return text.trim().toLowerCase()
        .replace(/[أإآ]/g, 'ا')
        .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()؟?]/g, "");
    }

    const handleSubmit = (e)=>{
        e.preventDefault();
        if(!inputValue.trim() || disabled ) return;

        onGuessSubmit(cleanText(inputValue),inputValue.trim());
        setInputValue("");
    }

    return(
        <form onSubmit={handleSubmit} className="w-full max-w-md mx-auto " action="">
            <div className="flex flex-col gap-2">
                <input type="text"
                value={inputValue}
                onChange={(e)=>setInputValue(e.target.value)} 
                placeholder={placeholder || "Type your answer..."}               
                disabled={disabled}
                className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 text-center text-lg focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 disabled:opacity-50 transition"/>
                <button
                    type="submit"
                    disabled={disabled}
                    className="w-full py-3 bg-amber-500 hover:bg-amber-600 disabled:bg-slate-700 text-slate-950 font-extrabold rounded-xl transition text-lg tracking-wider">
                    Submit your guess
                </button>

            </div>
        </form>
    );
}