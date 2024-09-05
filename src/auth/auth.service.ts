import { Injectable } from '@nestjs/common';
import { AuthBody } from './auth.controller'
import { PrismaService } from 'src/prisma.service';
import { hash, compare } from 'bcrypt';

@Injectable()
export class AuthService {
    constructor(private readonly prisma: PrismaService) {}
    async login({authBody}: {authBody: AuthBody}) {
        const {email, password} = authBody;

        const hashedPassword = await this.hashPassword({ password });
        console.log(hashedPassword);

        const existingUser = await this.prisma.user.findUnique({
            where: {
                email,
            },
        });
        if (!existingUser) {
            throw new Error("L'utilisateur n'existe pas.")
        }

        const isPasswordValid = this.isPasswordValid({password, hashedPassword: existingUser.password});

        if ( !isPasswordValid) {
            throw new Error("Le mot de passe est incorrect.")
        }

        return existingUser.id;
    }

    private async hashPassword({ password }: {password: AuthBody["password"] }) {
        const hashedPassword = await hash(password, 10);
        return hashedPassword;
    }

    private async isPasswordValid({ password, hashedPassword }: {password: AuthBody["password"], hashedPassword: AuthBody["password"] }) {
        const isPasswordValid = await compare(password, hashedPassword);
        return isPasswordValid;
    }
}
