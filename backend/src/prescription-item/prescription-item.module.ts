import { Module } from '@nestjs/common';
import { PrescriptionItemService } from './prescription-item.service';
import { PrescriptionItemController } from './prescription-item.controller';

@Module({
  controllers: [PrescriptionItemController],
  providers: [PrescriptionItemService],
})
export class PrescriptionItemModule {}
