import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSharingService } from './data-sharing.service';
import { DataSharingController } from './data-sharing.controller';
import { SharedData } from './data-sharing.entity';

@Module({
  imports: [TypeOrmModule.forFeature([SharedData])],
  controllers: [DataSharingController],
  providers: [DataSharingService],
  exports: [DataSharingService],
})
export class DataSharingModule {}
