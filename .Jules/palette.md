## 2025-05-15 - [Icon-only Button Accessibility]
**Learning:** Icon-only buttons, such as password visibility toggles, need explicit focus-visible styles (e.g., `focus-visible:text-primary`) to be clearly identifiable during keyboard navigation.
**Action:** Always include focus-visible utility classes for icon-only buttons to enhance accessibility.

## 2026-04-23 - [Consistent Focus-Visible Styles]
**Learning:** For a cohesive and accessible user experience, all interactive elements in the header and footer (Logo, Theme Toggle, User Menu, Legal Links) should have consistent, high-contrast focus indicators that respect the design system's primary color.
**Action:** Use `focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 outline-none` as a standard pattern for primary navigation and utility elements.
