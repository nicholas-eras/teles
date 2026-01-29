import { IsString, IsOptional } from 'class-validator';

export class CreateStandardDto {
  @IsString()
  name: string; // Ex: "EDP"

  @IsString()
  @IsOptional()
  description?: string;
}