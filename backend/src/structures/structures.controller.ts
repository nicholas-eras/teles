import { Controller, Get, Post, Body, Param, Delete, ParseIntPipe } from '@nestjs/common';
import { StructuresService } from './structures.service';
import { CreateStructureDto } from './dto/create-structure.dto';

@Controller('structures')
export class StructuresController {
  constructor(private readonly structuresService: StructuresService) {}

  @Get()
  findAll() {
    return this.structuresService.findAll();
  }

  // --- NOVA ROTA ---
  // GET /structures/standard/1 -> Retorna todas as estruturas da EDP
  @Get('standard/:standardId')
  findByStandard(@Param('standardId', ParseIntPipe) standardId: number) {
    return this.structuresService.findAllByStandard(standardId);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.structuresService.findOne(id);
  }

  @Post()
  create(@Body() createStructureDto: CreateStructureDto) {
    // Agora usamos o DTO que contém { name: string, standardId: number }
    return this.structuresService.create(createStructureDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.structuresService.remove(id);
  }
}