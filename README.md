# Microsserviço de Cliente (customer)
[![Quality gate](https://sonarcloud.io/api/project_badges/quality_gate?project=PosTech-SOAT_Customer)](https://sonarcloud.io/summary/new_code?id=PosTech-SOAT_Customer)

[![Coverage](https://sonarcloud.io/api/project_badges/measure?project=PosTech-SOAT_Customer&metric=coverage)](https://sonarcloud.io/summary/new_code?id=PosTech-SOAT_Customer)
[![Maintainability Rating](https://sonarcloud.io/api/project_badges/measure?project=PosTech-SOAT_Customer&metric=sqale_rating)](https://sonarcloud.io/summary/new_code?id=PosTech-SOAT_Customer)

## Visão Geral

Este repositório contém o código-fonte e os recursos necessários para o microsserviço de Cliente do projeto de um Sistema de Controle de Pedidos, desenvolvido durante a Pós-graduação em Arquitetura de Software da FIAP. Este microsserviço faz parte de uma aplicação maior construída em Node.js com TypeScript, Docker e Kubernetes.

### Tecnologias Utilizadas:
- Node.js
- Express
- TypeORM
- PostgreSQL
- Docker
- MongoDB Atlas
- Kubernetes
- Jest

## Pipeline

A pipeline está configurada para facilitar a integração contínua e a entrega contínua (CI/CD) do microsserviço de Cliente:

1. **Testes Unitários:** Os testes unitários são executados automaticamente na pipeline.
2. **Construção da Imagem Docker:** Após a aprovação dos testes, a imagem Docker é construída a partir do Dockerfile fornecido.
3. **Deploy no Kubernetes:** Os manifestos Kubernetes em `k8s/` são aplicados no cluster Kubernetes utilizando `kubectl apply`.

## Configuração

Antes de executar a pipeline, certifique-se de configurar as seguintes variáveis de ambiente:

- `AWS_CREDENTIALS`: Credenciais de acesso à AWS.

Certifique-se de que essas variáveis de ambiente estejam configuradas corretamente para garantir o funcionamento adequado da pipeline.
