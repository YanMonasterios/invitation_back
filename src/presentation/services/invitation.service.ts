import { prisma } from "../../data/postgres";
import { CreateInvitationDto, CustomError } from "../../domain";
import { EmailService } from "./email.service";
import { v4 as uuidv4 } from 'uuid';

export class InvitationService {
  constructor(private readonly emailService: EmailService) {}

  public async createInvitation(dto: CreateInvitationDto) {
    const { inviterId, inviteeEmail, siteId, startDate, endDate } = dto;

    // 1. Validar que el sitio existe
    const site = await prisma.site.findUnique({ where: { id: siteId } });
    if (!site) throw CustomError.badRequest("Site not found");

    // 2. Buscar o crear al usuario invitado
    let invitee = await prisma.user.findUnique({ where: { email: inviteeEmail } });

    if (!invitee) {
      invitee = await prisma.user.create({
        data: {
          email: inviteeEmail,
          name: 'Invitado',
          password: 'placeholder',
        }
      });
    }

    // 3. Validar que no hay solapamientos
    const overlapping = await prisma.invitation.findFirst({
      where: {
        inviteeId: invitee.id,
        siteId,
        OR: [
          {
            startDate: { lte: endDate },
            endDate: { gte: startDate }
          }
        ]
      }
    });

    if (overlapping) throw CustomError.badRequest("La invitacion se solapa con una existente");

    // 4. Crear invitación con token único
    const responseToken = uuidv4();

    const invitation = await prisma.invitation.create({
      data: {
        inviterId,
        inviteeId: invitee.id,
        siteId,
        startDate,
        endDate,
        responseToken,
      }
    });

    // 5. Enviar correo con el token correcto (nuevo o existente)
    await this.sendInvitationEmail(invitee.email, responseToken);

    return invitation;
  }

  private async sendInvitationEmail(email: string, token: string) {
    const html = `
      <h1>Tienes una nueva invitación</h1>
      <p>Haz clic en el enlace para responder:</p>
      <a href="${process.env.CLIENT_URL}/invitation/respond/${token}">Responder invitación</a>
    `;

    const options = {
      to: email,
      subject: "Nueva invitación a un sitio",
      htmlBody: html,
    };

    console.log("Enviando correo a", email);
    const sent = await this.emailService.sendEmail(options);
    console.log("Correo enviado:", sent);

    if (!sent) throw CustomError.internalServer("Error sending invitation email");
  }

  public async updateInvitationStatus(token: string, status: 'ACCEPTED' | 'REJECTED') {
    const invitation = await prisma.invitation.findUnique({ where: { responseToken: token } });
    if (!invitation) throw CustomError.badRequest('Invalid token');

    if (['ACCEPTED', 'REJECTED'].includes(invitation.status)) {
      throw CustomError.badRequest('Invitation already responded');
    }

    const updated = await prisma.invitation.update({
      where: { id: invitation.id },
      data: { status }
    });

    await prisma.invitationHistory.create({
      data: {
        invitationId: invitation.id,
        previousStatus: 'PENDING',
        newStatus: status,
        changedById: invitation.inviteeId
      }
    });

    return updated;
  }

  public async getInvitations() {
    return await prisma.invitation.findMany({
      include: {
        inviter: true,
        invitee: true,
        site: true,
      }
    });
  }
}
