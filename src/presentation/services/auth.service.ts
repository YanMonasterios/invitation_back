import { bcryptAdapter, envs, JwtAdapter } from "../../config";
import { prisma } from "../../data/postgres";
import { CustomError, LoginUserDto, RegisterUserDto, UserEntity } from "../../domain";
import { PrismaClient } from '@prisma/client';
import { EmailService } from "./email.service";
import { v4 as uuidv4 } from 'uuid';


export class AuthService {
  constructor(
    // llamo mi servicio de EmailService 
    private readonly emailService: EmailService
  ) {}

public async registerUser(registerDto: RegisterUserDto) {
  const { email, name, password } = registerDto;

  const existUser = await prisma.user.findUnique({ where: { email } });

  if (existUser) {
    throw CustomError.badRequest('User already exists');
  }

  try {
    // hashear passowrd
    const hashedPassword = bcryptAdapter.hash(password);

    // guardar user
    const newUser = await prisma.user.create({
      data: {
        email,
        name,
        password: hashedPassword,
      },
    });

    // email de confirmacion
    this.sendEmailValidationLink(newUser.email);


    // Convertir a entidad (y quitar password)
    // quito el password y mando la informacion necesaria
    const { password: _, ...userEntity } = UserEntity.fromObject(newUser);

    const token = await JwtAdapter.generateToken({id:newUser.id})
    if (!token) throw CustomError.internalServer('Error while creating JWT')


    return {
      user: userEntity,
      token: token,
    };

  } catch (error) {
    throw CustomError.internalServer(`${error}`);
  }
}

public async loginUser(loginUserDto: LoginUserDto) {
  const { email, password } = loginUserDto;

  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    throw CustomError.badRequest('email o password not exist');
  }

  const isMatch = bcryptAdapter.compare(loginUserDto.password, user.password);

  // si no hay match
  if (!isMatch) throw CustomError.badRequest('password is not valid');

  // quito el password y mando la informacion necesaria
  const {password: _, ...userEntity} = UserEntity.fromObject(user)

  // grabo el id del user mas el correo 
  const token = await JwtAdapter.generateToken({id:user.id , email:user.email})

   if (!token) throw CustomError.internalServer('Error while creating JWT')


  

    return {
      user: userEntity,
      token: token
    };

  
}

private sendEmailValidationLink = async(email: string) => {
  const token = await JwtAdapter.generateToken({ email }); 
  if (!token) throw CustomError.internalServer('error generating token');

  const link = `${envs.WEBSERVICE_URL}/auth/validate-email/${token}`;

  const html = `
    <h1>Validate your Email</h1>
    <p>Click en el siguiente enlace para continuar el registro:</p>
    <p><a href="${link}">${link}</a></p>
    <p>Si no creaste esta cuenta, ignora el mensaje</p>
  `;

  const options = {
    to: email,
    subject: 'Valida tu email para el registro del sistema de invitacion',
    htmlBody: html,
  };

  const isSet = await this.emailService.sendEmail(options);
  
  // si no envia el correo
  if (!isSet) throw CustomError.internalServer('Error sending email');

  return true;
}

 public validateEmail = async(token:string) => {

  // Se valida el JWT. Si el token fue manipulado o expiró, validateToken retornará null
  const payload = await JwtAdapter.validateToken(token);


  if (!payload) throw CustomError.unauthorized('invalid token');

  //  Se indica el tipo de payload a un objeto que tenga email.
  const {email} = payload as {email: string};

  // Si el token no contenía un email, lanza error de servidor. 
  if (!email) throw CustomError.internalServer('email not in token');

  const user = await prisma.user.findUnique({
    where: { email },
  });

  if(!user) throw CustomError.badRequest('email not exist')

  // Actualizo el valor de emailValidated.
  user.emailValidated = true;

  // actualiza directamente el campo emailValidated a true en la base de datos para el usuario correspondiente.
  await prisma.user.update({
    where: { email },
    data: { emailValidated: true },
  });

  return true;
 

 }
 





}