import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IdentityService } from './identity.service';
import { IdentityController } from './identity.controller';
import { Identity } from './identity.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Identity])],
  controllers: [IdentityController],
  providers: [IdentityService],
  exports: [IdentityService],
})
export class IdentityModule {}
