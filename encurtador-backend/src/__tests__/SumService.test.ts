import { Divisao, Sum } from "../Services/SumService"

describe("Sum Service test", () => {

    test("Deve verificar se a soma é feita corretamente", () => {
        const resut = Sum(1, 2);

        expect(resut).toBe(3)
    })

    it("Deve verificar se uma divisão é feita corretamente", () => {
        const resut = Divisao(10, 5);

        expect(resut).toBe(2)
    })

    it("Deve Gerar um erro caso o divisor seja 0", () => {
        const resut = Divisao(10, 0);

        expect(resut).toStrictEqual(new Error("Divisão por 0 nao pode"))
    })

    
})