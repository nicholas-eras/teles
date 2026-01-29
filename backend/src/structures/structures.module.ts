import { Module } from '@nestjs/common';
import { StructuresService } from './structures.service';
import { StructuresController } from './structures.controller';
import { PrismaService } from 'prisma/prisma.service';

@Module({
  controllers: [StructuresController],
  providers: [StructuresService, PrismaService],
})
export class StructuresModule {}
