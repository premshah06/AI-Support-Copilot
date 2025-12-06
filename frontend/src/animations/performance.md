# Animation Performance Optimization Guide

## GPU-Accelerated Properties

All animations in this application use GPU-accelerated CSS properties for optimal performance:

### ✅ Optimized Properties (60fps)
- `transform` (translate, scale, rotate)
- `opacity`

### ❌ Avoid These Properties (causes reflow/repaint)
- `width`, `height`
- `top`, `left`, `right`, `bottom`
- `margin`, `padding`
- `border-width`

## Will-Change Management

Framer Motion automatically manages `will-change` for animated properties:
- Adds `will-change` when animation starts
- Removes `will-change` after animation completes
- Prevents performance issues from overuse

## Performance Best Practices

### 1. Use Transform Instead of Position
```tsx
// ❌ Bad - causes reflow
animate={{ left: 100 }}

// ✅ Good - GPU accelerated
animate={{ x: 100 }}
```

### 2. Lazy Load Animations with Intersection Observer
```tsx
const { ref, isIntersecting } = useIntersectionObserver({ threshold: 0.1 });

<motion.div
  ref={ref}
  initial="hidden"
  animate={isIntersecting ? "visible" : "hidden"}
  variants={fadeInVariants}
>
```

### 3. Respect Reduced Motion Preferences
```tsx
const prefersReducedMotion = useReducedMotion();

<motion.div
  animate={prefersReducedMotion ? {} : { scale: 1.05 }}
>
```

### 4. Use Layout Animations Sparingly
Layout animations can be expensive. Use them only when necessary:
```tsx
// Only use layout when animating position changes
<motion.div layout>
```

### 5. Optimize List Animations
Use stagger with reasonable delays:
```tsx
const containerVariants = {
  visible: {
    transition: {
      staggerChildren: 0.05, // Not too long
      delayChildren: 0.1,
    },
  },
};
```

## Performance Monitoring

### Check Frame Rate
Open Chrome DevTools > Performance > Record interaction
- Target: 60fps (16.67ms per frame)
- Acceptable: 30fps (33.33ms per frame)
- Poor: <30fps

### Identify Bottlenecks
1. Long tasks (>50ms)
2. Layout thrashing
3. Excessive repaints
4. Memory leaks

## Current Implementation Status

✅ All animations use transform and opacity
✅ Framer Motion handles will-change automatically
✅ Intersection observer hook available for lazy animations
✅ Reduced motion preferences respected
✅ Stagger animations optimized with 50ms delays
