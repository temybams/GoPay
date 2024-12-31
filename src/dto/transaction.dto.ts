import { z } from 'zod';
import { CardTransactionSchema, VirtualTransactionSchema, ProcessSettlementSchema } from '../validation/transaction.validation';

type CardTransactionDto = z.infer<typeof CardTransactionSchema>;
type VirtualTransactionDto = z.infer<typeof VirtualTransactionSchema>;
type ProcessSettlementDto = z.infer<typeof ProcessSettlementSchema>;

export { CardTransactionDto, VirtualTransactionDto, ProcessSettlementDto };
