import { z } from 'zod';
import { CreatePayoutSchema } from '../validation/payment.validation';

type CreatePayoutDto = z.infer<typeof CreatePayoutSchema>;

export { CreatePayoutDto };
