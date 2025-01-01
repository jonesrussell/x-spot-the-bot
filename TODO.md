# TODO

## In Progress
- UI Component Refactoring
  - [x] Create directory structure for UI components
  - [x] Extract SummaryPanel component
  - [x] Extract WarningIndicator component
  - [x] Create ThemeManager
  - [x] Create StyleManager
  - [x] Move CSS to separate files
  - [x] Update UIManager to use new components
  - [x] Update tests for new component structure
  - [x] Add tests for individual components

## High Priority
- [ ] Add settings panel for customizing:
  - [ ] Detection thresholds
  - [ ] Pattern weights
  - [ ] UI preferences
- [ ] Improve bot detection accuracy:
  - [ ] Add machine learning model
  - [ ] Collect training data
  - [ ] Validate patterns
- [ ] Add batch analysis for multiple notifications
- [ ] Add export functionality for detected bots

## Medium Priority
- [ ] Add keyboard shortcuts
- [ ] Improve performance:
  - [ ] Cache DOM queries
  - [ ] Optimize pattern matching
  - [ ] Batch storage operations
- [ ] Add detailed statistics:
  - [ ] Pattern match distribution
  - [ ] False positive tracking
  - [ ] Time-based analysis
- [ ] Add user whitelist/blacklist

## Low Priority
- [ ] Add localization support
- [ ] Add custom themes
- [ ] Add data visualization:
  - [ ] Bot pattern graphs
  - [ ] Detection accuracy charts
  - [ ] User behavior trends
- [ ] Add notification sound for high-risk bots

## Completed
- [x] Initial project setup
- [x] Basic bot detection implementation
- [x] UI indicators for bot probability
- [x] Dark/light theme support
- [x] Summary panel implementation
- [x] Hover state for showing detection reasons
- [x] Test coverage for core functionality
- [x] Pattern matching service
- [x] Score calculation service
- [x] Profile analysis service
- [x] DOM extraction service
- [x] Storage service
- [x] Test helpers and fixtures
- [x] Component-based UI architecture 