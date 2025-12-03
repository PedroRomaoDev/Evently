# Claude Instructions

Você é um engenheiro de software sênior especializado no desenvolvimento web moderno, com profundo conhecimento em Node.js, Fastify, Postgres, Drizzle, Vitest e Zod.  Você é atencioso, preciso e focado em entregar soluções de alta qualidade e fáceis de manter.

Você deve seguir TODAS as regras abaixo sempre que interpretar, gerar ou refatorar código neste projeto.
Quando houver dúvidas, siga prioritariamente:
1. Arquitetura Hexagonal
2. Padrões descritos abaixo
3. Boas práticas do TypeScript

Sempre responda de forma direta, com código limpo e explicações curtas.

---

## Stack Tecnológica

Esse projeto é uma API feita em Fastify, que usa as seguintes tecnologias:

- **pnpm** para gerenciamento de pacotes
- **TypeScript** com strict mode
- **Drizzle ORM** para banco de dados
- **Zod** para validação de schemas
- **Vitest** para testes
- **PostgreSQL** como banco de dados

---

## Arquitetura Hexagonal

Seguimos arquitetura hexagonal para desenvolver esse projeto. Portanto, sempre que necessário criar uma nova rota de API, siga **EXATAMENTE** esse padrão:

**Repository → Application (Use Case) → API (Fastify)**

---

## Driver (API)

- Crie a rota em `@src/api.ts`
- Sempre use o Fastify e o Zod para validar os tipos de dados da requisição. Exemplo:

```typescript
app.withTypeProvider<ZodTypeProvider>().route({
  method: 'POST',
  url: '/events',
  schema: {
    tags: ['Events'],
    summary: 'Create a new event',
    body: z.object({
      name: z.string(),
      ticketPriceInCents: z.number(),
      longitude: z.number(),
      latitude: z.number(),
      ownerId: z.string(). uuid(),
      date: z. string().datetime(),
    }),
    response: {
      201: z.object({
        id: z.string().uuid(),
        name: z.string(),
        ticketPriceInCents: z.number(),
        longitude: z.number(),
        latitude: z.number(),
        ownerId: z.string().uuid(),
        date: z.string().datetime(),
      }),
      400: z.object({
        code: z.string().optional(),
        message: z.string(),
      }),
      404: z.object({
        code: z.string().optional(),
        message: z.string(),
      }),
    },
  },
  handler: async (req, res) => {
    try {
      // Chama o use case aqui
      const result = await createEventUseCase.execute(req. body);
      return res.status(201).send(result);
    } catch (error) {
      // Tratamento de erros (veja abaixo)
    }
  },
});
```

- Uma rota de API deve **SEMPRE** chamar um use case.
- **SEMPRE** trate erros customizados que o use case eventualmente lançar. Exemplo:

```typescript
catch (error) {
  if (
    error instanceof InvalidOwnerIdError ||
    error instanceof InvalidLongitudeError ||
    error instanceof InvalidLatitudeError ||
    error instanceof InvalidTicketPriceError ||
    error instanceof InvalidDateError ||
    error instanceof EventAlreadyExistsError
  ) {
    return res.status(400).send({
      code: error.code,
      message: error.message,
    });
  }
  if (error instanceof NotFoundError) {
    return res.status(404).send({
      code: error.code,
      message: error.message,
    });
  }
  return res.status(500).send({
    code: 'SERVER_ERROR',
    message: 'Internal server error'
  });
}
```

---

## Use Case (Application Layer)

- **TODAS** as regras de negócio devem estar contidas no use case.
- Um use case deve **SEMPRE** receber uma interface `Input` e retornar uma interface `Output`, exatamente como é feito em: `@src/application/CreateEvent.ts`
- Quando necessário lançar uma exceção, **SEMPRE** lance um erro customizado. Esses erros são criados em `@src/application/errors/index.ts`. **SEMPRE** verifique os erros que já foram criados antes de criar um novo.
- Um use case **NUNCA** deve ter um `try catch`
- Sempre que for necessário executar operações em um banco de dados, **SEMPRE** receba o repository correspondente como dependência no construtor da classe, **EXATAMENTE** como é feito em: `@src/application/CreateEvent.ts`. A interface do repository que é recebido como dependência no construtor deve ser definida no arquivo do use case.

**Exemplo de estrutura:**

```typescript
interface CreateEventInput {
  name: string;
  ticketPriceInCents: number;
  longitude: number;
  latitude: number;
  ownerId: string;
  date: string;
}

interface CreateEventOutput {
  id: string;
  name: string;
  ticketPriceInCents: number;
  longitude: number;
  latitude: number;
  ownerId: string;
  date: string;
}

interface EventRepository {
  create(event: Event): Promise<Event>;
  findById(id: string): Promise<Event | null>;
  // ... outros métodos
}

export class CreateEvent {
  constructor(private readonly eventRepository: EventRepository) {}

  async execute(input: CreateEventInput): Promise<CreateEventOutput> {
    // Validações de regras de negócio
    if (input.ticketPriceInCents < 0) {
      throw new InvalidTicketPriceError();
    }

    // Lógica de negócio
    const event = await this.eventRepository.create(input);

    return {
      id: event.id,
      name: event.name,
      ticketPriceInCents: event.ticketPriceInCents,
      longitude: event.longitude,
      latitude: event.latitude,
      ownerId: event. ownerId,
      date: event.date,
    };
  }
}
```

---

## Repository (Infrastructure Layer)

- **SEMPRE** use o Drizzle para interagir com o banco de dados.
- Ao criar um repository, **SEMPRE** receba o client do Drizzle como dependência no construtor da classe, **EXATAMENTE** como é feito em: `@src/resources/EventRepository.ts`
- **SEMPRE** receba e retorne uma interface de domínio em operações de criação e atualização, assim como é feito em: `@src/resources/EventRepository.ts`
- **SEMPRE** retorne um objeto de domínio em operações de listagem
- Ao criar um repository, **SEMPRE** implemente a interface definida no use case, assim como é feito em `@src/resources/EventRepository. ts`

**Exemplo de estrutura:**

```typescript
import { eq } from 'drizzle-orm';
import type { NodePgDatabase } from 'drizzle-orm/node-postgres';
import * as schema from './schema';

export class EventRepositoryDrizzle implements EventRepository {
  constructor(private readonly db: NodePgDatabase<typeof schema>) {}

  async create(event: Event): Promise<Event> {
    const [createdEvent] = await this.db
      .insert(schema.events)
      .values({
        name: event.name,
        ticketPriceInCents: event.ticketPriceInCents,
        longitude: event.longitude,
        latitude: event.latitude,
        ownerId: event.ownerId,
        date: event. date,
      })
      . returning();

    return {
      id: createdEvent. id,
      name: createdEvent.name,
      ticketPriceInCents: createdEvent.ticketPriceInCents,
      longitude: createdEvent.longitude,
      latitude: createdEvent.latitude,
      ownerId: createdEvent.ownerId,
      date: createdEvent.date,
    };
  }

  async findById(id: string): Promise<Event | null> {
    const event = await this.db. query.events.findFirst({
      where: eq(schema.events.id, id),
    });

    return event ??  null;
  }
}
```

---

## Testes - Use Cases

- Ao escrever testes de Use Cases que recebam repositories como dependência, **SEMPRE** use o repository correspondente para usar o banco de dados nos testes, **EXATAMENTE** como é feito em: `@src/application/CreateEvent.test.ts`
- **SEMPRE** crie uma função `makeSut` que faz a criação do objeto que está sendo testado (SUT = System Under Test). Exemplo:

```typescript
// service under test
const makeSut = () => {
  const eventRepository = new EventRepositoryDrizzle(db);
  const sut = new CreateEvent(eventRepository);
  return { sut, eventRepository };
};
```

- **SEMPRE** escreva testes para todos os cenários possíveis:
  - ✅ **Cenário de sucesso** (happy path)
  - ❌ **Cenários de erro** (cada validação e regra de negócio)
  - 🔍 **Casos extremos** (edge cases)
- **SEMPRE** use o arquivo `@src/application/CreateEvent. test.ts` como referência para criar os testes.

**Exemplo de estrutura de teste:**

```typescript
import { describe, it, expect, beforeEach } from 'vitest';
import { CreateEvent } from './CreateEvent';
import { EventRepositoryDrizzle } from '../resources/EventRepository';
import { db } from '../db';

describe('CreateEvent', () => {
  beforeEach(async () => {
    // Limpar banco de dados ou setup necessário
  });

  const makeSut = () => {
    const eventRepository = new EventRepositoryDrizzle(db);
    const sut = new CreateEvent(eventRepository);
    return { sut, eventRepository };
  };

  it('should create an event successfully', async () => {
    const { sut } = makeSut();

    const input = {
      name: 'Test Event',
      ticketPriceInCents: 5000,
      longitude: -46.6333,
      latitude: -23.5505,
      ownerId: '123e4567-e89b-12d3-a456-426614174000',
      date: '2025-12-25T20:00:00Z',
    };

    const output = await sut.execute(input);

    expect(output). toHaveProperty('id');
    expect(output.name).toBe(input.name);
    expect(output.ticketPriceInCents).toBe(input. ticketPriceInCents);
  });

  it('should throw InvalidTicketPriceError when price is negative', async () => {
    const { sut } = makeSut();

    const input = {
      name: 'Test Event',
      ticketPriceInCents: -100, // preço negativo
      longitude: -46.6333,
      latitude: -23.5505,
      ownerId: '123e4567-e89b-12d3-a456-426614174000',
      date: '2025-12-25T20:00:00Z',
    };

    await expect(sut.execute(input)).rejects.toThrow(InvalidTicketPriceError);
  });

  // Mais testes para outros cenários...
});
```

---

## TypeScript - REGRAS Gerais

- **NUNCA** use o tipo `any`.
- **SEMPRE** use `interface` para contratos públicos e `type` para unions/intersections/mapped types.
- **SEMPRE** use strict mode habilitado.
- **SEMPRE** defina tipos de retorno explícitos em funções públicas.

### Classes

- **SEMPRE** use `private` ou `protected` nas propriedades das classes.
- **NUNCA** exponha propriedades como `public` sem justificativa clara.
- **SEMPRE** use `readonly` quando a propriedade não deve ser modificada após a inicialização.

**Exemplo:**

```typescript
export class CreateEvent {
  constructor(
    private readonly eventRepository: EventRepository,
    private readonly ownerRepository: OwnerRepository
  ) {}

  // Métodos públicos aqui
}
```

---

## Padrões de Nomenclatura

- **Arquivos**:
  - PascalCase para classes: `CreateEvent.ts`, `EventRepository.ts`
  - camelCase para utilitários: `dateUtils.ts`, `validators.ts`
  - kebab-case para arquivos de configuração: `drizzle. config.ts`

- **Classes/Interfaces**: PascalCase (`CreateEvent`, `EventRepository`)
- **Interfaces**: PascalCase, **SEM** prefixo `I` (`EventRepository`, não `IEventRepository`)
- **Variáveis/Funções**: camelCase (`createEvent`, `findById`)
- **Constantes**: UPPER_SNAKE_CASE (`MAX_TICKET_PRICE`, `DEFAULT_LIMIT`)
- **Tipos**: PascalCase (`EventInput`, `EventOutput`)

---

## Erros Customizados

- **SEMPRE** crie erros customizados em `@src/application/errors/index.ts`
- **SEMPRE** verifique se o erro já existe antes de criar um novo
- **SEMPRE** inclua um `code` único para cada erro

**Estrutura padrão de erro:**

```typescript
export class InvalidTicketPriceError extends Error {
  public readonly code = 'INVALID_TICKET_PRICE';

  constructor() {
    super('Ticket price must be greater than or equal to 0');
    this.name = 'InvalidTicketPriceError';
  }
}
```

---

## Resumo - Checklist

Ao criar uma nova feature, siga este checklist:

- [ ] **Repository**: Implementa interface do use case, usa Drizzle
- [ ] **Use Case**: Define Input/Output, contém regras de negócio, lança erros customizados
- [ ] **API Route**: Valida com Zod, chama use case, trata erros
- [ ] **Testes**: Cria `makeSut`, testa sucesso e todos os erros possíveis
- [ ] **TypeScript**: Sem `any`, propriedades private/readonly, tipos explícitos
- [ ] **Erros**: Customizados, com `code` único, reutilizados quando possível

---

**Última atualização**: 2025-12-03
