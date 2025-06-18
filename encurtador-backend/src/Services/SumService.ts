
export function Sum(a: number, b: number) {
    return a + b;
}

export function Divisao(a: number, b:number){
   if(b === 0){
    return new Error("Divisão por 0 nao pode")
   }

    return a / b
}