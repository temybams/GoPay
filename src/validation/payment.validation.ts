import { z } from 'zod';

const CreatePayoutSchema = z.object({
    merchantId: z.string(),
});

export { CreatePayoutSchema };
