# Mobile Device Testing Guide

## Overview
This guide provides instructions for testing the UI modernization animations on mobile devices to ensure smooth 60fps performance.

## Testing Checklist

### iOS Safari Testing

#### Device Requirements
- iPhone 12 or newer (recommended)
- iOS 15 or newer
- Safari browser

#### Test Scenarios

1. **Page Transitions**
   - [ ] Navigate between pages (Tickets → Analytics → Settings)
   - [ ] Use browser back/forward buttons
   - [ ] Verify smooth fade transitions (300ms)
   - [ ] Check for any jank or stuttering

2. **Ticket Card Animations**
   - [ ] Scroll through ticket list
   - [ ] Verify staggered entrance animations
   - [ ] Tap cards to navigate (no hover on mobile)
   - [ ] Check skeleton loading states

3. **Interactive Elements**
   - [ ] Tap buttons and verify press animation
   - [ ] Toggle switches smoothly
   - [ ] Open/close modals with animations
   - [ ] Test form validation feedback

4. **Status Indicators**
   - [ ] Verify pulse animation on "open" status
   - [ ] Check progress animation on "in_progress"
   - [ ] Confirm success animation on "resolved"

5. **Performance Monitoring**
   - [ ] Open Safari Web Inspector (connect to Mac)
   - [ ] Record timeline during interactions
   - [ ] Verify 60fps during animations
   - [ ] Check for dropped frames

### Android Chrome Testing

#### Device Requirements
- Pixel 5 or Samsung Galaxy S21 (or equivalent)
- Android 11 or newer
- Chrome browser

#### Test Scenarios

1. **Page Transitions**
   - [ ] Navigate between pages
   - [ ] Use gesture navigation
   - [ ] Verify smooth transitions
   - [ ] Test with Chrome DevTools remote debugging

2. **Scroll Performance**
   - [ ] Scroll through long ticket lists
   - [ ] Verify smooth 60fps scrolling
   - [ ] Check for layout shifts
   - [ ] Test pull-to-refresh (if implemented)

3. **Touch Interactions**
   - [ ] Tap buttons and cards
   - [ ] Verify tactile feedback
   - [ ] Test swipe gestures (if implemented)
   - [ ] Check touch target sizes (min 44x44px)

4. **Animations**
   - [ ] Verify all animations are smooth
   - [ ] Check notification slide-ins
   - [ ] Test loading states
   - [ ] Verify form validation animations

5. **Performance Monitoring**
   - [ ] Enable Chrome DevTools remote debugging
   - [ ] Record performance profile
   - [ ] Check FPS meter
   - [ ] Verify no memory leaks

## Performance Metrics

### Target Metrics
- **Frame Rate**: 60fps (16.67ms per frame)
- **Page Transition**: <300ms
- **Interaction Response**: <100ms
- **First Contentful Paint**: <1.5s
- **Time to Interactive**: <3.5s

### Acceptable Degradation
- **Frame Rate**: 30fps minimum on older devices
- **Page Transition**: <500ms on slow devices
- **Interaction Response**: <200ms

## Remote Debugging Setup

### iOS Safari
1. Enable Web Inspector on iPhone:
   - Settings → Safari → Advanced → Web Inspector
2. Connect iPhone to Mac via USB
3. Open Safari on Mac → Develop → [Your iPhone] → [Page]
4. Use Timeline tab to record performance

### Android Chrome
1. Enable Developer Options on Android:
   - Settings → About Phone → Tap Build Number 7 times
2. Enable USB Debugging:
   - Settings → Developer Options → USB Debugging
3. Connect Android to computer via USB
4. Open Chrome on computer → chrome://inspect
5. Click "Inspect" on your device
6. Use Performance tab to record

## Common Issues and Solutions

### Issue: Animations are janky
**Solutions:**
- Check if using GPU-accelerated properties (transform, opacity)
- Verify will-change is not overused
- Reduce animation complexity
- Check for layout thrashing

### Issue: Scrolling is not smooth
**Solutions:**
- Use `transform: translateZ(0)` for hardware acceleration
- Avoid expensive operations during scroll
- Debounce scroll event handlers
- Use Intersection Observer for lazy loading

### Issue: Touch targets too small
**Solutions:**
- Ensure minimum 44x44px touch targets
- Add padding to clickable elements
- Use larger tap areas than visual elements

### Issue: Animations don't respect reduced motion
**Solutions:**
- Check `useReducedMotion` hook is used
- Verify `prefers-reduced-motion` media query
- Provide instant transitions as fallback

## Automated Testing

### Performance Budget
Create performance budgets in `vitest.config.ts`:
```typescript
// Example performance assertions
expect(animationDuration).toBeLessThan(300);
expect(frameRate).toBeGreaterThanOrEqual(30);
```

### Visual Regression Testing
Use Playwright for visual regression:
```bash
npm run test:visual
```

## Testing Tools

### Browser DevTools
- **Chrome DevTools**: Performance profiling, FPS meter
- **Safari Web Inspector**: Timeline, Network, Console
- **Firefox DevTools**: Performance, Responsive Design Mode

### Third-Party Tools
- **Lighthouse**: Performance audits
- **WebPageTest**: Real device testing
- **BrowserStack**: Cross-browser testing
- **LambdaTest**: Mobile device testing

## Reporting Issues

When reporting performance issues, include:
1. Device model and OS version
2. Browser and version
3. Steps to reproduce
4. Performance recording/screenshot
5. Expected vs actual behavior
6. Network conditions (if relevant)

## Continuous Monitoring

### Setup Performance Monitoring
1. Add performance marks in code:
```typescript
performance.mark('animation-start');
// ... animation code
performance.mark('animation-end');
performance.measure('animation', 'animation-start', 'animation-end');
```

2. Monitor in production:
- Use Web Vitals API
- Track Core Web Vitals (LCP, FID, CLS)
- Set up alerts for performance degradation

## Sign-off Criteria

Before marking mobile testing complete:
- [ ] Tested on at least 2 iOS devices
- [ ] Tested on at least 2 Android devices
- [ ] All animations run at 30fps minimum
- [ ] No critical performance issues
- [ ] Reduced motion preferences respected
- [ ] Touch targets meet accessibility standards
- [ ] Performance metrics within budget
