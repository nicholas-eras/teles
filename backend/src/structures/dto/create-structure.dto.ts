import { IsString, IsInt, IsNotEmpty } from 'class-validator';

export class CreateStructureDto {
  @IsString()
  @IsNotEmpty()
  name: string; // Ex: "CE1"

  @IsInt()
  @IsNotEmpty()
  standardId: number; // Ex: 1 (ID da EDP)
}