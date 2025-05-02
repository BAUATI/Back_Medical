import { BadRequestException, InternalServerErrorException, Logger } from "@nestjs/common";

export function DuplicateKey (error: any) {
    
    let logger: Logger

    if ( error.code === '23505' )
        throw new BadRequestException(error.detail);
  
      logger.error(error)
  
      throw new InternalServerErrorException('Valida con el servicio tecnico, server logs = 500')
    
}