# Architecture

## Overview

X Spot The Bot is built using a modular architecture with clear separation of concerns. Each module has a specific responsibility and communicates with others through well-defined interfaces.

## Core Components

### Content Script (src/content/index.ts)
- Entry point for the extension
- Sets up MutationObserver for notification monitoring
- Coordinates between services

### Services

#### DOMExtractor (src/services/dom-extractor.ts)
- Handles all DOM operations
- Extracts profile data from notification elements
- Uses data-testid attributes for reliable element selection

#### ProfileAnalyzer (src/services/profile-analyzer.ts)
- Analyzes extracted profile data
- Implements bot detection algorithms
- Returns probability scores and reasons

#### StorageService (src/services/storage.ts)
- Manages local storage
- Tracks interaction history
- Caches analysis results

#### UIManager (src/services/ui-manager.ts)
- Handles UI element creation
- Manages warning indicators
- Controls hover states and tooltips

## Data Flow

1. MutationObserver detects new notifications
2. DOMExtractor pulls profile data
3. ProfileAnalyzer processes the data
4. StorageService records the interaction
5. UIManager updates the interface

## Module System

- Uses ES2022 modules (newest concrete version as of 2024)
- Explicit .js extensions for ESM compatibility
- Node module resolution for development tools 