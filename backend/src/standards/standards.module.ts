import { Module } from '@nestjs/common';
import { StandardsService } from './standards.service';
import { StandardsController } from './standards.controller';
import { PrismaService } from 'prisma/prisma.service';

@Module({
  controllers: [StandardsController],
  providers: [StandardsService, PrismaService],
})
export class StandardsModule {}
