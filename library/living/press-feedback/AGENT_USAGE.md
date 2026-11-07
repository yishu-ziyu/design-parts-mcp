# Press feedback · Agent usage

Use for subtle press feedback on native action buttons. Not for asynchronous state management, links or a complete button design system.

Read `distribution.json`, `press-feedback.css`, then `example.html`. `README.md` records the original specimen; `LICENSE` covers this extracted source.

1. Load the CSS and add `class="press-feedback"` to a real `<button>`.
2. Set `type="button"` unless the button intentionally submits a form. Retain the consuming project's click handler.
3. Change the documented `--pf-*` properties for the existing design. The stylesheet does not style unrelated elements.
4. Use native `disabled`. System reduced motion is automatic; the boolean `data-reduced-motion` attribute disables scaling for one button.
5. Check pointer hold/release, release outside without a click, rapid reversal, Tab plus Enter/Space, disabled behavior, reduced motion and two independent buttons in the consuming page.

No mount API, event listeners or teardown are required by the stylesheet. The example uses its own local click handler to demonstrate an actual visible result. It does not save to a backend or storage.

The sibling distribution project builds a snapshot from this canonical directory. Change source here, not the generated snapshot. Preserve the original `skill-samples` files. Browser acceptance does not certify real touch hardware, Safari or Firefox.
