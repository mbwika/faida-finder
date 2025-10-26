// Polyfills for older Node versions (Node <20) that lack DOM globals like File
import './polyfills/file';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const basePort = Number(process.env.PORT ?? 3333);
  const maxRetries = 10; // try up to 10 ports (3333-3342)
  
  for (let i = 0; i < maxRetries; i++) {
    const port = basePort + i;
    try {
      await app.listen(port);
      console.log(`Server started on port ${port}`);
      break;
    } catch (err) {
      if (i === maxRetries - 1) {
        throw new Error(
          `Failed to start server after trying ports ${basePort}-${port}. Last error: ${err}`
        );
      }
      if (err && typeof err === 'object' && 'code' in err && err.code === 'EADDRINUSE') {
        console.warn(`Port ${port} is in use, trying ${port + 1}...`);
        continue;
      }
      throw err; // re-throw non-EADDRINUSE errors
    }
  }
}

void bootstrap();
