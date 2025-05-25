import { PartialType } from '@nestjs/swagger';
import { CreatePrescripcioneDto } from './create-prescripcione.dto';

export class UpdatePrescripcioneDto extends PartialType(CreatePrescripcioneDto) {}
