# MARP Diagrams Guide

## What is MARP?

MARP (Markdown Presentation Ecosystem) is a tool that converts Markdown files into beautiful presentations, slides, or images. It's particularly useful for creating professional-looking technical diagrams and architecture documentation that goes beyond what standard Mermaid diagrams can offer.

Think of MARP as "PowerPoint meets Markdown" - you write in Markdown, style with CSS, and get polished visual outputs.

## Quick Start

### Installation

```bash
npm install --save-dev @marp-team/marp-cli
```

### Basic Usage

1. Create a Markdown file with MARP frontmatter in `.project/docs/diagrams/`:

```markdown
---
marp: true
theme: default
backgroundColor: #f5f5f5
size: 16:9
---

# Your Content Here
```

2. Generate an image:

```bash
cd .project/docs/diagrams
npx marp your-diagram.md --html --image png --output your-diagram.png
```

**Important**: Always use the `--html` flag when your diagram includes any HTML/CSS styling!

## Key Lessons from Our Troubleshooting Session

### 1. The HTML Flag is CRUCIAL

**Problem**: Raw HTML tags appearing as text in the output (like `<div>` tags showing literally).

**Solution**: ALWAYS use the `--html` flag:
```bash
npx marp diagram.md --html --image png --output diagram.png
```

Without this flag, MARP escapes all HTML for security reasons, causing your styled content to appear as raw text.

### 2. Tables Work Better Than Flexbox Divs

**Problem**: Complex nested `<div>` structures with flexbox often render incorrectly or show as raw HTML.

**Solution**: Use HTML tables for side-by-side layouts:

```html
<table>
<tr>
<td class="left-box">
  Left content
</td>
<td class="right-box">
  Right content
</td>
</tr>
</table>
```

### 3. Centering Content is Tricky

**Problem**: Content appears pushed to one side instead of centered.

**Solution**: Use flexbox on the wrapper with explicit centering:

```css
.wrapper {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 30px;
}
```

Add `!important` to section styles if needed to override MARP defaults.

### 4. Watch Your Vertical Space

**Problem**: Content gets cut off at the bottom of the slide.

**Solution**: 
- Set table height to 90% instead of 100%
- Reduce padding and margins
- Use smaller font sizes for dense content
- Consider using `overflow-y: auto` for scrollable content

### 5. Simplify Complex Sections

**Problem**: "Deployments from:" section with complex HTML was rendering as raw text.

**Solution**: Convert to simple nested bullet points:

```markdown
- Deployments from:
  - main branch → staging
  - feature branches → preview URLs
```

### 6. Font Sizing for Visual Impact

**Problem**: Small text doesn't fill the available space effectively.

**Solution**: Increase font sizes progressively:
- Headers (h2): 38px
- Subheaders (h3): 20px  
- Body text (li): 17px
- Sub-bullets: 16px
- Footer text: 16px

## File Organization

Always create MARP diagrams in `.project/docs/diagrams/` to keep them organized:

```
.project/docs/diagrams/
├── deployment-architecture.mmd    # Mermaid diagrams
├── deployment-architecture.png    
├── worker-architecture.md         # MARP diagrams
└── worker-architecture.png
```

## Common MARP Commands

### Generate PNG (Most Common)
```bash
npx marp diagram.md --html --image png --output diagram.png
```

### Generate PDF
```bash
npx marp diagram.md --html --pdf --output diagram.pdf
```

### Generate with Higher Resolution
```bash
npx marp diagram.md --html --image png --output diagram.png --image-scale 2
```

## Best Practices

1. **Always test incrementally** - Build up complex layouts step by step
2. **Check the output immediately** - Look at the generated PNG after each change
3. **Use consistent styling** - Create reusable CSS classes for similar elements
4. **Keep HTML simple** - Prefer Markdown where possible, use HTML only for layout
5. **Document your approach** - Comment complex CSS for future reference

## When to Use MARP vs Mermaid

**Use MARP when you need:**
- Side-by-side comparisons
- Custom styling and branding
- Professional presentation-quality diagrams
- Complex layouts with multiple sections
- Gradient backgrounds and shadows

**Use Mermaid when you need:**
- Quick flowcharts or sequence diagrams
- Standard diagramming notation
- Version-controllable text-based diagrams
- Simple relationships and flows

## Troubleshooting Checklist

- [ ] Did you include the `--html` flag?
- [ ] Is your content actually fitting in the viewport?
- [ ] Are you using tables instead of complex nested divs?
- [ ] Have you checked the generated PNG for rendering issues?
- [ ] Are your font sizes appropriate for the box sizes?
- [ ] Is your content properly centered?

## Example Working Configuration

Here's a proven working setup from our session:

```markdown
---
marp: true
theme: default
backgroundColor: #f5f5f5
size: 16:9
---

<style>
section {
  padding: 40px;
  display: flex !important;
  justify-content: center !important;
  align-items: center !important;
}

.box {
  width: 45%;
  border-radius: 15px;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
}
</style>

<!-- Your content here -->
```

This configuration reliably produces centered, professional-looking diagrams.