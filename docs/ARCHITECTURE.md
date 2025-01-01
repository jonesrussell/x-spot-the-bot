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

## CSS Architecture

The extension uses a modular CSS architecture with the following principles:

1. Component Scoping
   - Each UI component has its own CSS module
   - Styles are scoped using the .xbd- prefix
   - BEM-like naming for clarity and specificity
   - CSS variables for theme customization

2. Theme System
   - Dark/light mode support via media queries
   - CSS variables for color schemes
   - Runtime theme switching capability
   - High contrast accessibility support

3. Layout Patterns
   - Flexbox for component layouts
   - Mobile-first responsive design
   - z-index management for overlays
   - Position sticky for summary panel

4. X Integration
   - !important rules to override X styles
   - Shadow DOM consideration for isolation
   - Consistent spacing with X's design
   - Matching X's dark theme colors

5. Performance
   - CSS modules for code splitting
   - Minification in production
   - Critical CSS inlining
   - Efficient selectors

6. Maintainability
   - Consistent naming conventions
   - Separation of concerns
   - Documentation comments
   - Reusable mixins

## File Structure

```
src/services/ui/
  ├── components/     # UI Components
  │   ├── SummaryPanel.ts
  │   └── WarningIndicator.ts
  ├── styles/        # CSS Modules
  │   ├── panel.css      # Panel styles
  │   ├── indicators.css # Indicator styles
  │   └── variables.css  # Theme variables
  ├── style-manager.ts   # Style injection
  └── theme-manager.ts   # Theme handling
```

## Style Guidelines

1. Naming Convention
   - Component: .xbd-{component}
   - Element: .xbd-{component}-{element}
   - Modifier: .xbd-{component}--{modifier}
   - State: .xbd-{component}.is-{state}

2. CSS Variables
   ```css
   :root {
     --xbd-bg-color: #fff;
     --xbd-text-color: #000;
     --xbd-high-risk: #ff0000;
     --xbd-medium-risk: #ff8c00;
     --xbd-low-risk: #00aa00;
   }
   ```

3. Media Queries
   ```css
   @media (prefers-color-scheme: dark) {
     :root {
       --xbd-bg-color: #15202b;
       --xbd-text-color: #fff;
     }
   }
   ```

4. z-index Layers
   - Base content: 1-10
   - Tooltips: 100
   - Overlays: 1000
   - Modals: 9999999

5. Responsive Breakpoints
   ```css
   @media (max-width: 768px) {
     .xbd-summary-panel {
       padding: 8px;
     }
   }
   ```

## Implementation Details

1. Style Injection
   - Styles are injected via StyleManager
   - CSS modules are bundled with Vite
   - Runtime theme switching supported
   - Media query listeners for theme

2. Theme Management
   - ThemeManager handles mode switching
   - CSS variables for dynamic updates
   - System preference detection
   - Smooth transitions

3. Component Styling
   - Scoped to component instance
   - Consistent spacing/sizing
   - Flexible layouts
   - Accessibility support

4. Performance Optimization
   - Minimal DOM operations
   - Efficient selectors
   - Bundle size optimization
   - Critical CSS inlining 