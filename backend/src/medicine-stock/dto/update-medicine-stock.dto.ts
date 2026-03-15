import { PartialType } from '@nestjs/mapped-types';
import { CreateMedicineStockDto } from './create-medicine-stock.dto';

export class UpdateMedicineStockDto extends PartialType(CreateMedicineStockDto) {}
