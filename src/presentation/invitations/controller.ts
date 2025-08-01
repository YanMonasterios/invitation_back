import { Request, Response } from 'express';
import { CreateInvitationDto, CustomError } from '../../domain';
import { InvitationService } from '../services/invitation.service';

export class InvitationController {
  constructor(private readonly invitationService: InvitationService) {}

  private handleError(error: unknown, res: Response) {
    if (error instanceof CustomError) {
      return res.status(error.statusCode).json({ error: error.message });
    }
    console.log(error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }

  createInvitation = (req: Request, res: Response) => {
    const [error, dto] = CreateInvitationDto.create(req.body);
    if (error) return res.status(400).json({ error });

    this.invitationService.createInvitation(dto!)
      .then(invitation => res.json(invitation))
      .catch(error => this.handleError(error, res));
  };

  respondInvitation = (req: Request, res: Response) => {
    const { token } = req.params;
    const { status } = req.body;

    if (!['ACCEPTED', 'REJECTED'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    this.invitationService.updateInvitationStatus(token, status)
      .then(() => res.json({ message: `Invitation ${status.toLowerCase()}` }))
      .catch(error => this.handleError(error, res));
  };
    getInvitations = async (req: Request, res: Response) => {
    try {
        const invitations = await this.invitationService.getInvitations();
        res.json(invitations);
    } catch (error: unknown) {
        this.handleError(error, res);
    }
    };
}
