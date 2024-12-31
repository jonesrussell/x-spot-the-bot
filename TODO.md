# TODO

## High Priority
- [x] Fix TypeScript module configuration to use es2022
- [x] Update all import statements to use .js extensions for ESM compatibility
- [x] Implement basic bot detection logic in ProfileAnalyzer
- [x] Set up DOM monitoring for notifications page
- [x] Add local storage for tracking interaction history
- [x] Replace enums with const objects using 'as const'
- [ ] Fix UI inconsistencies between development and production builds
- [ ] Add follower/following count extraction from profile pages
- [ ] Implement rate limiting for API calls
- [ ] Fix test helper functions to avoid Promise returns in callbacks

## Medium Priority
- [x] Add unit tests for core services
- [x] Implement UI for showing bot warnings
- [x] Simplify test setup with helper functions
- [ ] Add settings page for customizing detection thresholds
- [ ] Create documentation for bot detection algorithms
- [ ] Add error handling and recovery for API failures
- [ ] Improve test coverage for edge cases
- [ ] Add integration tests for DOM manipulation
- [ ] Implement proper error boundaries for UI components
- [ ] Add type predicates for runtime type narrowing
- [ ] Use branded types for nominal typing where needed

## Low Priority
- [ ] Add telemetry for detection accuracy
- [ ] Create options page for user preferences
- [ ] Add support for dark mode in UI elements
- [ ] Optimize performance for large notification lists
- [ ] Add i18n support for multiple languages
- [ ] Add accessibility features (ARIA labels, keyboard navigation)
- [ ] Implement user feedback mechanism for false positives/negatives
- [ ] Add visual regression tests for UI components
- [ ] Add discriminated unions for pattern matching
- [ ] Use readonly arrays and tuples where appropriate 