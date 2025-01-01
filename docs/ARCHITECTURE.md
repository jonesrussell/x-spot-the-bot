# Architecture

## Overview

The X Spot The Bot extension is built with a modular, service-oriented architecture that emphasizes:
- Single Responsibility Principle (SRP)
- Don't Repeat Yourself (DRY)
- Separation of Concerns (SoC)

## Core Services

### Analysis Services
Located in `src/services/analysis/`:

1. **PatternMatcher**
   - Detects bot-like patterns in usernames
   - Uses regex patterns with weighted scores
   - Case-insensitive matching
   - Returns detailed match information

2. **ScoreCalculator**
   - Calculates final bot probability
   - Applies threshold-based analysis
   - Considers multiple factors
   - Returns probability and reasons

3. **ProfileAnalyzer**
   - Orchestrates bot detection process
   - Combines pattern matching and scoring
   - Handles verified accounts
   - Analyzes follower patterns

### DOM Services
Located in `src/services/dom/`:

1. **DOMExtractor**
   - Extracts profile data from notifications
   - Handles different notification types
   - Provides fallback values
   - Type-safe DOM operations

2. **ElementExtractor**
   - Low-level DOM element extraction
   - Error handling for missing elements
   - Consistent selector patterns
   - Performance optimizations

### UI Services
Located in `src/services/ui/`:

1. **Components**
   - SummaryPanel: Statistics display
   - WarningIndicator: Bot probability indicators
   - Modular, reusable design
   - Event-driven updates

2. **StyleManager**
   - Manages CSS injection
   - Handles theme variables
   - Consistent styling
   - Performance optimized

3. **ThemeManager**
   - Dark/light theme detection
   - Theme switching
   - CSS variable management
   - System theme integration

### Storage Service
Located in `src/services/`:

- Local storage management
- Profile data persistence
- Chrome storage API wrapper
- Error handling

## Data Flow

1. **Notification Detection**
   ```
   Feed Monitor -> DOM Extractor -> Profile Data
   ```

2. **Bot Analysis**
   ```
   Profile Data -> Pattern Matcher -> Score Calculator -> Final Score
   ```

3. **UI Updates**
   ```
   Final Score -> Warning Indicator -> Summary Panel
   ```

## Testing Architecture

1. **Test Organization**
   - Unit tests in `__tests__` directories
   - Integration tests separate
   - Shared fixtures in `test/fixtures`
   - Common helpers in `test/helpers`

2. **Test Utilities**
   - DOM helpers for element creation
   - Profile data fixtures
   - Mock implementations
   - Type-safe test data

3. **Coverage Requirements**
   - 80% minimum coverage
   - All services tested
   - Edge cases covered
   - Integration points verified

## Type System

1. **Core Types**
   - `ProfileData`: User profile information
   - `PatternMatch`: Pattern detection results
   - `BotScore`: Final analysis results
   - `InteractionType`: User interaction types

2. **Type Safety**
   - Strict null checks
   - Discriminated unions
   - Readonly properties
   - Type assertions minimized

## Performance Considerations

1. **DOM Operations**
   - Cached selectors
   - Batch updates
   - Efficient queries
   - Event delegation

2. **Analysis**
   - Early exits for verified accounts
   - Optimized regex patterns
   - Threshold-based processing
   - Cached results

3. **Storage**
   - Batched operations
   - Efficient key structure
   - Clear data lifecycle
   - Error recovery

## Future Extensibility

1. **Machine Learning**
   - Pattern weight optimization
   - User feedback integration
   - Training data collection
   - Model validation

2. **Analytics**
   - Pattern effectiveness tracking
   - False positive monitoring
   - User behavior analysis
   - Performance metrics

3. **UI Customization**
   - Theme customization
   - Indicator preferences
   - Detection thresholds
   - Display options 