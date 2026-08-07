
import { resolve } from "node:dns";
import { gemini } from "../config/gemini.js";
import { buildPrompt } from "./prompt-builder.services.js";
import { AppError } from "../core/errors/AppError.js";

//  a sleeper function

async function sleep(ms:number): Promise<void>{
    
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve()
        }, ms);
    })
    
}


async function retry<T>(
    operation: () => Promise<T>,
) {
    const MAXATTEMPTS = 3;
    let delay = 1000;

    for(let i = 0; i < MAXATTEMPTS; i++){
       
         try {
             
            const result = await operation();
             
            console.log(`Operation succeeded on attempt ${i + 1} / ${MAXATTEMPTS}`);

            return result;

         } catch (error) {
            
            console.error(`Operation failed on attempt ${i + 1} / ${MAXATTEMPTS}:`, error);
            if(i !== MAXATTEMPTS - 1){
                await sleep(delay);
                delay *= 2;
            } else {
                throw error;
            }
            
         }

    }
}


export async function generateReport(
    summary: any,
): Promise<string> {
    const prompt = buildPrompt(summary);

    const response = await retry(
        async () => {
            return gemini.models.generateContent({
                model: "gemini-3.5-flash",
                contents: prompt,
            });
        }
    )

    console.log(response);
    
    return response?.text ?? "Failed to get report";

    
} 
