# Evently — Event Management System

## Overview
Este projeto é um sistema de gestão de eventos presenciais construído com foco em alta escalabilidade, desempenho e boas práticas de arquitetura.
Ele integra conceitos modernos como:

- Arquitetura Orientada a Eventos (EDA)
- Processamento assíncrono
- Filas, mensageria e comunicação desacoplada
- Serverless
- BuildMQ
- Integração com AWS (Lambda, SQS, SNS)
- Geolocalização de eventos
- Arquitetura Hexagonal (Ports & Adapters)
- Inversão de Dependência (DIP)

## Features Principais
- CRUD de eventos
- Recuperação de eventos por ID
- Validação avançada de entrada
- Processamento assíncrono com filas
- Disparo de notificações via mensageria
- Cálculo e manipulação de geolocalização
- Deploy serverless com AWS Lambda
- Camadas desacopladas via Hexagonal Architecture

# Uso de IA & Programação Assistida

Este projeto também funciona como um ambiente de experimentação em
**produtividade com LLMs**, explorando como diferentes ferramentas de IA
podem auxiliar no ciclo de desenvolvimento moderno.

Ferramentas estudadas:

### **Cursor AI** (`.cursor/rules`)

-   Automação de geração de código\
-   Regras e styleguides personalizados\
-   Auxílio em refatoração e testes

### **GitHub Copilot** (`.vscode/copilot-instructions`)

-   Sugestões alinhadas à Arquitetura Hexagonal\
-   Documentação e testes automatizados\
-   Regras personalizadas por pasta

### **Claude** (`CLAUDE.md`)

-   Análise de contexto e raciocínio profundo\
-   Refatoração orientada a arquitetura limpa\
-   Geração de documentação técnica detalhada

### **Gemini CLI** (`GEMINI.md`)

-   Execução de prompts via terminal\
-   Geração de documentação, scripts e consultas\
-   Testes com diferentes modelos de IA

------------------------------------------------------------------------

# IA Aplicada ao Projeto (Busca Semântica)

O Evently também explora o uso de **IA dentro do domínio da aplicação**,
incluindo:

-   **Busca semântica baseada em embeddings**\
-   Uso de **vetores** para encontrar eventos similares por descrição,
    categoria ou localização\
-   Processamento otimizado com **batching**\
-   Preparação para consultas **KNN** e recomendações inteligentes\
-   Base para futuras integrações com **RAG** e análises contextuais

Essa camada permite uma navegação e filtragem mais inteligente, indo
além da busca textual tradicional.

------------------------------------------------------------------------
