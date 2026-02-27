# Documentation

This directory contains the central documentation and overarching architectural details for the application.

## System Overview

The project is structured into three main components:

1. **Agent Service (`/agent-service`)**
   - **Role**: Handles multiple agent AI operations at build time.
   - **Tech Stack**: Python 3, FastAPI, LangGraph.

2. **Backend Service (`/backend`)**
   - **Role**: Serves as the primary API connecting the frontend with data models and external services.
   - **Tech Stack**: Node.js, Express.js, TypeScript.

3. **Frontend Application (`/frontend`)**
   - **Role**: Provides the interactive user interface.
   - **Tech Stack**: React, TypeScript, Vite, TanStack Query.

## Getting Started

To get the entire application up and running locally, please refer to the individual service documentations for specific setup and installation instructions:

- [Agent Service Documentation](../agent-service/README.md)
- [Backend Service Documentation](../backend/README.md)
- [Frontend Application Documentation](../frontend/README.md)

## Future Documentation

(Add any shared architectural diagrams, API contracts, database schemas, or deployment instructions here.)
