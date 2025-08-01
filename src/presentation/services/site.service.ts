import { prisma } from "../../data/postgres";
import { CreateSiteDto, CustomError } from "../../domain";


export class SiteService {
  async createSite(userId: string, dto: CreateSiteDto) {
    // Verificar si ya existe sitio con mismo nombre para el usuario
    const existingSite = await prisma.site.findFirst({
      where: {
        ownerId: userId,
        name: dto.name,
      },
    });

    if (existingSite) throw CustomError.badRequest('sitio ya existe');


    return await prisma.site.create({
      data: {
        name: dto.name,
        address: dto.address,
        description: dto.description,
        ownerId: userId,
      },
    });
  }

    async getSitesByUser() {
    try {
        const sites = await prisma.site.findMany();

        return sites.map(site => ({
        id: site.id,
        name: site.name,
        address: site.address,
        description: site.description,
        }));
    } catch (error) {
        throw CustomError.internalServer("Internal Server Error");
    }
    }
}
