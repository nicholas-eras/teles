import { Injectable } from '@nestjs/common';
import { CreateStandardDto } from './dto/create-standard.dto';
import { UpdateStandardDto } from './dto/update-standard.dto';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class StandardsService {
  constructor(private prisma: PrismaService) {}

  create(createStandardDto: CreateStandardDto) {
    return this.prisma.standard.create({
      data: createStandardDto,
    });
  }

  findAll() {
    return this.prisma.standard.findMany({
      include: {
        _count: { select: { structures: true } } // Útil para saber quantas estruturas existem nesse padrão
      }
    });
  }

  findOne(id: number) {
    return this.prisma.standard.findUnique({
      where: { id },
      include: {
        structures: true // Traz todas as estruturas vinculadas a esse padrão
      }
    });
  }

  update(id: number, updateStandardDto: UpdateStandardDto) {
    return this.prisma.standard.update({
      where: { id },
      data: updateStandardDto,
    });
  }

  remove(id: number) {
    return this.prisma.standard.delete({
      where: { id },
    });
  }
}