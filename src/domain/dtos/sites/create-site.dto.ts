// data transform object para site al momento de crear sitios

export class CreateSiteDto {
  private constructor(
    public readonly name: string,
    public readonly address: string,
    public readonly ownerId: string,
    public readonly description: string
  ) {}

  static create(object: { [key: string]: any }): [string?, CreateSiteDto?] {
    const { name, address, ownerId, description } = object;

    if (!name) return ['nameSite is required'];
    if (!address) return ['address is required'];
    if (!ownerId) return ['ownerId is required'];
    if (!description) return ['description is required'];

    return [undefined, new CreateSiteDto(name, address, ownerId, description)];
  }
}