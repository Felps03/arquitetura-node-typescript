import { OpenApiGeneratorV31 } from '@asteasolutions/zod-to-openapi';
import registry from './registry.ts';

export default function generateOpenApiDocument() {
  return new OpenApiGeneratorV31(registry.definitions).generateDocument({
    openapi: '3.1.0',
    info: {
      title: 'Arquitetura Node TypeScript API',
      version: '1.0.0',
      description: 'API de exemplo construída com Node.js, Express, MongoDB e Zod.',
    },
    servers: [{ url: '/' }],
  });
}
