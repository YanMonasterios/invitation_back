import { regularExps } from "../../../config";

export class CreateInvitationDto {
  private constructor(
    public readonly inviterId: string,
    public readonly inviteeEmail: string,
    public readonly siteId: string,
    public readonly startDate: Date,
    public readonly endDate: Date
  ) {}

  static create(object: { [key: string]: any }): [string?, CreateInvitationDto?] {
    const { inviterId, inviteeEmail, siteId, startDate, endDate } = object;

    if (!inviterId) return ['inviterId is required'];
    if (!inviteeEmail) return ['inviteeEmail is required'];
    if (!siteId) return ['siteId is required'];
    if (!startDate) return ['startDate is required'];
    if (!endDate) return ['endDate is required'];

    
    if (!regularExps.email.test(inviteeEmail)) return ['inviteeEmail must be a valid email'];

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (isNaN(start.getTime())) return ['Invalid startDate'];
    if (isNaN(end.getTime())) return ['Invalid endDate'];

    if (start >= end) return ['startDate must be before endDate'];

    const now = new Date();
    if (start <= now) return ['startDate must be in the future'];
    if (end <= now) return ['endDate must be in the future'];

    return [
      undefined,
      new CreateInvitationDto(inviterId, inviteeEmail, siteId, start, end)
    ];
  }
}