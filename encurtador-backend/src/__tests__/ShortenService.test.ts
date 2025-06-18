import { prisma } from "../prisma/client";
import { shortenService } from "../Services/ShortenService";

jest.mock('nanoid', () => {
    return {
        customAlphabet: jest.fn().mockReturnValue(() => 'ABCDE')
    }
})

jest.mock('../prisma/client', () => {
    return {
        prisma: {
            link: {
                create: jest.fn()
            }
        }
    }
})





describe("ShortenService tests", () => {
    beforeEach(()=>{
        jest.clearAllMocks();
    })


    it("Deve receber uma URL e retornar um shortId", async () => {
        const resultado = await shortenService.register({ url: "www.teste.com/isso-aqui-e-gigante", shortId: null });



        expect(resultado).toHaveProperty('shortId');
        expect(resultado.shortId).toHaveLength(5);
        expect(prisma.link.create).toHaveBeenCalledTimes(1)
        expect(prisma.link.create).toHaveBeenCalledWith(expect.objectContaining({
            data: expect.objectContaining({
                originalUrl: "www.teste.com/isso-aqui-e-gigante",
                shortId: expect.any(String)
            })
        }))
    });

    it("Deve receber uma URL e retornar um shortId customizado", async () => {
        const resultado = await shortenService.register({ url: "www.teste.com/isso-aqui-e-gigante", shortId: 'test' });

        expect(resultado).toHaveProperty('shortId');
        expect(resultado).toEqual({ shortId: 'test' });
        expect(prisma.link.create).toHaveBeenCalledTimes(1)
        expect(prisma.link.create).toHaveBeenCalledWith(expect.objectContaining({
            data: expect.objectContaining({
                originalUrl: "www.teste.com/isso-aqui-e-gigante",
                shortId: expect.any(String)
            })
        }))
    })




})