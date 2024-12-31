# Architecture

## Overview

X Spot The Bot is built using a modular architecture with clear separation of concerns. Each module has a specific responsibility and communicates with others through well-defined interfaces.

## Core Components

### Content Script (src/content/index.ts)
- Entry point for the extension
- Sets up MutationObserver for notification monitoring
- Coordinates between services
- Tracks processed usernames to prevent duplicates
- Handles initialization and feed detection

### Services

#### DOMExtractor (src/services/dom-extractor.ts)
- Handles all DOM operations
- Extracts profile data from notification elements
- Uses data-testid attributes for reliable element selection
- Provides detailed error reporting for extraction failures

#### ProfileAnalyzer (src/services/profile-analyzer.ts)
- Analyzes extracted profile data
- Implements bot detection algorithms
- Calculates probability scores based on multiple factors:
  - Username patterns (up to 0.5)
  - Follower/following status (0.3)
  - Display name similarity (0.2)
- Maximum total score of 0.9
- Provides detailed scoring breakdown

#### StorageService (src/services/storage.ts)
- Manages local storage
- Tracks interaction history
- Caches analysis results
- Handles data pruning to prevent storage overflow

#### UIManager (src/services/ui-manager.ts)
- Handles UI element creation
- Manages warning indicators
- Controls hover states and tooltips
- Ensures styles are added only once

## Data Flow

1. MutationObserver detects new notifications
2. BotDetector checks for duplicates
3. DOMExtractor pulls profile data
4. ProfileAnalyzer processes the data
5. If probability >= 0.6:
   - UIManager adds warning
   - StorageService records interaction

## Debug Logging

- Uses consistent prefixes:
  - [XBot:Core] - Main bot detector
  - [XBot:DOM] - DOM extraction
  - [XBot:Analysis] - Profile analysis
- Includes detailed context in logs
- Helps track extraction failures

## Module System

- Uses ES2022 modules (newest concrete version as of 2024)
- Explicit .js extensions for ESM compatibility
- Node module resolution for development tools 