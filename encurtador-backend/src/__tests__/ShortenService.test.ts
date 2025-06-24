import { toDataURL } from "qrcode";
import { prisma } from "../prisma/client";
import { shortenService } from "../Services/ShortenService";
import QRCode from "qrcode";

jest.mock('nanoid', () => {
    return {
        customAlphabet: jest.fn().mockReturnValue(() => 'ABCDE')
    }
})

jest.mock('../prisma/client', () => {
    return {
        prisma: {
            link: {
                create: jest.fn(),
                findUnique: jest.fn()
            }
        }
    }
})

//com return implicito    !  embaixo do esclamação
jest.mock("qrcode", () => ({
    toDataURL: jest.fn()
}))


describe("Shorten Service tests", () => {
    beforeEach(() => {
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

    it("Deve buscar um link pelo shortId existente", async () => {
        const mockShortId = 'teste';
        const mockOriginalUrl = 'www.teste.com.br/teste/testado/testando';

        (prisma.link.findUnique as jest.Mock).mockResolvedValue({
            shortId: mockShortId,
            originalUrl: mockOriginalUrl
        });
        const result = await shortenService.findByIdentifier(mockShortId);

        expect(result).toEqual({ originalUrl: mockOriginalUrl });
        expect(prisma.link.findUnique).toHaveBeenCalledTimes(1);
        expect(prisma.link.findUnique).toHaveBeenCalledWith({ where: { shortId: mockShortId } });
    })

    it("Deve buscar um link pelo shortId inexistente", async () => {
        const mockShortId = 'teste';

        (prisma.link.findUnique as jest.Mock).mockResolvedValue(null);

        await expect(shortenService.findByIdentifier(mockShortId))
            .rejects
            .toThrow("Not Found...")

    })

    it("Deve gerar um Base64 de um link informado", async () => {
        const mockUrl = "https://exemplo.teste.com";
        const mockBase64 = "data:image/png:base64.exemplo";

        (QRCode.toDataURL as jest.Mock).mockResolvedValue(mockBase64)

        const result = await shortenService.generateQrcode({ url: mockUrl });
        expect(result).toEqual({ base64: mockBase64 });
        expect(QRCode.toDataURL).toHaveBeenCalledTimes(1);
        expect(QRCode.toDataURL).toHaveBeenCalledWith(mockUrl);
    })

    it("Deve gerar um erro caso ja exista um shortID", async () => {
        const mockShortIdEx = "teste";

        (prisma.link.findUnique as jest.Mock).mockResolvedValue({
            shortId: mockShortIdEx,
            originalUrl: 'www.teste.com/isso-aqui-e-gigante'
        })

        await expect(shortenService.register({ url: 'www.teste.com/isso-aqui-e-gigante', shortId: mockShortIdEx }))
            .rejects
            .toThrow("Short ID já existe...")

    })

})