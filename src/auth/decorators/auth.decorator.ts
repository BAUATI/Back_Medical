import { UseGuards, applyDecorators } from '@nestjs/common';
import { RolProtected } from './rol-protected.decorator';
import { AuthGuard } from '@nestjs/passport';
import { UserRoleGuard } from '../guards/user-role.guard';
import { ValidRols } from '../interfaces/valid-rols';


export function Auth(...rols: ValidRols[]){
    return applyDecorators(
        RolProtected(...rols),
        UseGuards(AuthGuard(), UserRoleGuard)        
    )
}