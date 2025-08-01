import { Router } from "express";
import { InvitationController } from "./controller";
import { InvitationService } from "../services/invitation.service";
import { EmailService } from "../services/email.service";
import { envs } from "../../config";

const router = Router();

const emailService = new EmailService(
  envs.MAILER_SERVICE,
  envs.MAILER_EMAIL,
  envs.MAILER_SECRET_KEY
);

const invitationService = new InvitationService(emailService);
const invitationController = new InvitationController(invitationService);

router.post('/', invitationController.createInvitation);
router.post('/respond/:token', invitationController.respondInvitation);
router.get('/', invitationController.getInvitations);

export default router;