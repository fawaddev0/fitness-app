---
name: Kinetic AI Fitness
colors:
  surface: '#121316'
  surface-dim: '#121316'
  surface-bright: '#38393c'
  surface-container-lowest: '#0d0e11'
  surface-container-low: '#1b1b1f'
  surface-container: '#1f1f23'
  surface-container-high: '#292a2d'
  surface-container-highest: '#343538'
  on-surface: '#e3e2e6'
  on-surface-variant: '#c5c9ae'
  inverse-surface: '#e3e2e6'
  inverse-on-surface: '#2f3034'
  outline: '#8f937b'
  outline-variant: '#444934'
  surface-tint: '#aed50c'
  primary: '#ffffff'
  on-primary: '#293500'
  primary-container: '#c9f236'
  on-primary-container: '#576c00'
  inverse-primary: '#526600'
  secondary: '#64d9c7'
  on-secondary: '#003731'
  secondary-container: '#1aa291'
  on-secondary-container: '#00302a'
  tertiary: '#ffffff'
  on-tertiary: '#670414'
  tertiary-container: '#ffdad9'
  on-tertiary-container: '#af3d43'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#c9f236'
  primary-fixed-dim: '#aed50c'
  on-primary-fixed: '#171e00'
  on-primary-fixed-variant: '#3d4d00'
  secondary-fixed: '#82f6e3'
  secondary-fixed-dim: '#64d9c7'
  on-secondary-fixed: '#00201c'
  on-secondary-fixed-variant: '#005047'
  tertiary-fixed: '#ffdad9'
  tertiary-fixed-dim: '#ffb3b2'
  on-tertiary-fixed: '#410008'
  on-tertiary-fixed-variant: '#861f28'
  background: '#121316'
  on-background: '#e3e2e6'
  surface-variant: '#343538'
typography:
  display-hero:
    fontFamily: Space Grotesk
    fontSize: 56px
    fontWeight: '700'
    lineHeight: 60px
    letterSpacing: -0.03em
  display-hero-mobile:
    fontFamily: Space Grotesk
    fontSize: 40px
    fontWeight: '700'
    lineHeight: 44px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 38px
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 30px
    letterSpacing: -0.01em
  headline-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 24px
    letterSpacing: 0em
  body-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  body-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 16px
  label-numeric:
    fontFamily: Space Grotesk
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 24px
    letterSpacing: -0.01em
  label-caps:
    fontFamily: Space Grotesk
    fontSize: 11px
    fontWeight: '700'
    lineHeight: 14px
    letterSpacing: 0.08em
rounded:
  sm: 0.5rem
  DEFAULT: 1rem
  md: 1.5rem
  lg: 2rem
  xl: 3rem
  full: 9999px
spacing:
  gutter: 1rem
  margin: 1.25rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2rem
---

## Brand & Style

This design system embodies high-performance sports science merged with cutting-edge computer vision. It caters to athletes, gym-goers, and fitness enthusiasts who require millimeter precision in posture analysis, rep counting, and biometric telemetry. The interface evokes relentless energy, focus, and surgical intelligence. 

The aesthetic marries **High-Contrast Dark Mode** with **Refined Glassmorphism and Neon Cybernetics**. The visual foundation rests upon ultra-deep matte carbon backdrops punctuated by high-frequency electric lime and cyan glow tokens. Rather than noisy gradients, surfaces leverage deep slate charcoal elevation planes, ultra-crisp hairline glass borders (1px with translucent specular highlights), and pill-form interactive primitives that channel ergonomic athletic gear. The emotional response is immediate clarity, momentum, and technical authority during high-intensity training.

## Colors

The palette is engineered for instantaneous legibility in dark workout spaces and high-glare environments.

- **Primary (`#D4FE42` / Electric Lime):** The core active state, tracking indicator, positive rep confirmation, and primary CTA trigger. Radiates maximum luminescence against deep matte grounds.
- **Secondary (`#76EAD7` / Mint Cyan):** Dedicated to technical data, live skeletal landmark joint tracking (MediaPipe nodes), pacing targets, and secondary action pills.
- **Tertiary (`#F47174` / Coral Alert):** Reserved for posture misalignment warnings, shear-angle violations, heart rate peak alerts, and rest timer countdown terminations.
- **Neutral Core (`#121316` Canvas, `#1A1C20` Surface, `#22252B` Surface Elevated):** Deep charcoal and carbon layers providing depth without stark OLED pixel smear.
- **Typography & Structural Accents:** Pure bright white (`#FFFFFF`) for hero metrics, mid-gray (`#9CA3AF`) for structural labels, and muted hairline borders (`rgba(255, 255, 255, 0.08)`).

## Typography

The type system blends the smooth geometric curvature of **Plus Jakarta Sans** (capturing the rounded, modern SF Pro aesthetic) with the mechanical precision of **Space Grotesk** for numerical output, live rep counters, joint coordinate vectors, and uppercase status badges.

All tabular readouts (reps, cadence, heart rate, range of motion degrees) leverage `Space Grotesk` with tabular figures enabled (`font-variant-numeric: tabular-nums`) to prevent horizontal jitter during rapid real-time updates. Uppercase tracking is boosted on labels (`label-caps`) for instant legibility at arm’s length when the phone is mounted or propped on gym equipment.

## Layout & Spacing

The architecture operates on an 8pt base grid with a 4pt sub-mesh for micro-alignments, pill badge paddings, and camera viewport status overlays.

- **Mobile (Core Target, < 768px):** A single-column vertical flow with a sticky floating pill navigation bar or persistent HUD workout footer. Outer canvas margin is pinned to `1.25rem` (`20px`), allowing cards to maximize lateral tap targets while keeping thumb zones clear.
- **Tablet & Landscape Rig (768px - 1024px):** Split-view HUD. Left 60% viewport dedicated to the hardware camera feed with real-time pose vector rendering; right 40% reserved for biomechanics analysis cards, rep progress bars, and form error loggers.
- **Content Flow:** Workout phase cards and weekly splits conform to tight horizontal carousels with peek margins (`space-md`), driving continuous touch exploration.

## Elevation & Depth

This design system eliminates muddy, diffuse multi-layer drop shadows in favor of **Tonal Layering**, **High-Fidelity Edge Speculars**, and **Neon Back-Glows**.

- **Level 0 (Canvas Base):** Solid matte `#121316`. Non-interactive backdrop.
- **Level 1 (Card & Module Layer):** Solid `#1A1C20` framed with a subtle 1px border (`rgba(255, 255, 255, 0.07)`). Zero drop shadow. Provides stable contrast against camera overlays.
- **Level 2 (Floating Controls & Floating Navigation):** Frosted glass container using `#1A1C20` at 85% opacity with `backdrop-filter: blur(20px)` and an upper specular highlight stroke (`linear-gradient(180deg, rgba(255, 255, 255, 0.15) 0%, rgba(255, 255, 255, 0.02) 100%)`).
- **Level 3 (Neon Active State):** Applied strictly to active CTA pills, rep completion markers, and valid posture lines: `box-shadow: 0 0 24px rgba(212, 254, 66, 0.25)`. Posture failure signals switch instantly to an ambient coral radiance: `box-shadow: 0 0 24px rgba(244, 113, 116, 0.3)`.

## Shapes

The geometric signature is driven by tactile, rounded athletic forms. Interactive pills (`roundedness: 3`, fully pill-shaped / `9999px`) dominate navigation hubs, primary triggers, filter chips, and stepper buttons. 

Structural containers (workout phase trackers, exercise list cards, chart containers) employ `1.5rem` (`24px`) radius for modern comfort. Nested inner elements (thumbnails, input cells, stepper decrements) inherit proportional radii between `0.75rem` (`12px`) and `1rem` (`16px`) to preserve nested concentric geometry.

## Components

### Buttons & Steppers
- **Primary CTA:** Full pill-shaped button draped in solid Electric Lime (`#D4FE42`) with dark slate typography (`#121316`, `font-weight: 700`). Focus and active states apply a subtle scale-down (`0.98`) with a lime bloom aura.
- **Secondary / Ghost Pill:** Charcoal fill (`#22252B`) or transparent glass outline with white or cyan text.
- **Stepper Counter Controls:** Circular or rounded pill segments (`#22252B`) housing lime glyphs (`+` and `-`) for effortless resistance and rep adjustments with sweaty fingers.

### Navigation Pill Dock
- Floating bottom tab bar floating `1.25rem` above the bottom safe area. Encased in high-blur translucent charcoal (`#1A1C20` at 80% opacity) with a rounded-full pill boundary. Active destination triggers an illuminated neon lime pill background carrying crisp black iconography.

### Chips & Filter Pills
- Compact pill tokens (`h-8` to `h-10`) with `label-caps` typography. Inactive states live in muted charcoal (`#1E2127`) with soft gray text; selected states pop with neon lime background and contrasting dark typography.

### Live AI Posture HUD Overlays
- **Skeletal Tracking Landmarks:** 6px circular nodes colored in Mint Cyan (`#76EAD7`) connected by 2px vector lines. Misaligned joints instantly transition to Coral Alert (`#F47174`).
- **Metric Badges:** Glassmorphic pill tags pinned directly to joint nodes (e.g., knee flexion angles "92°") with tabular mono numerals.

### Workout Cards & Lists
- Surface container `#1A1C20` flanked by a rounded hairline border. Exercise entries feature left-aligned thumbnail avatars, primary titles in bright white, subtitle duration/reps in muted gray, and an inline status indicator or chevron trigger.
- **Phase Cards:** Segmented cards highlighting progress rings or horizontal fill bars drenched in Electric Lime against charcoal tracks.

### Input Fields & Stepper Rows
- Inset dark fields (`#15171B`) accompanied by subtle border illumination on active focus. Numeric stepper fields use prominent, centered `display-hero-mobile` text.