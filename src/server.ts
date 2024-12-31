import app from './app';
import { connectPrisma } from './services/prisma.service';

const PORT = process.env.PORT || 3000;


app.listen(PORT, async () => {
  await connectPrisma().then(() => {
    console.clear();
    console.log(`Server running on port ${PORT}`);
  });
});
