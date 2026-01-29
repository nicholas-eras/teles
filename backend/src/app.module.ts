import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { StructuresModule } from './structures/structures.module';
import { StandardsModule } from './standards/standards.module';

@Module({
  imports: [StructuresModule, StandardsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
