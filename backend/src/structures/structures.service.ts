import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
// Importe seu DTO se já tiver criado, senão use a interface inline por enquanto
import { CreateStructureDto } from './dto/create-structure.dto'; 

@Injectable()
export class StructuresService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    const res = await this.prisma.structure.findMany({
      include: { 
        standard: true, // Traz os dados da concessionária (Ex: Nome "EDP")
        _count: { select: { materials: true } } 
      },
      orderBy: { id: 'asc' }
    });
    return res; 
  }

  findOne(id: number) {
    return this.prisma.structure.findUnique({
      where: { id },
      include: { 
        standard: true, // Quem é o dono dessa estrutura?
        materials: true // Quais os materiais?
      }
    });
  }

  // O create mudou! Precisa receber o ID do padrão
  create(data: CreateStructureDto) {
    return this.prisma.structure.create({
      data: {
        name: data.name,
        standardId: data.standardId, // Vínculo obrigatório
        // Nota: 'description' foi removido da Structure no schema novo, 
        // se precisar adicionar descrição, deve ser na tabela ou no DTO correto.
      }
    });
  }

  // Filtrar estruturas por Padrão (Muito útil para o Frontend)
  findAllByStandard(standardId: number) {
    return this.prisma.structure.findMany({
      where: { standardId },
      include: { _count: { select: { materials: true } } }
    });
  }

  remove(id: number) {
    return this.prisma.structure.delete({ where: { id } });
  }
}