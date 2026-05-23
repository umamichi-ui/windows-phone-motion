# @umamichi-ui/windows-phone-motion

> 本文本由 LLM 生成，未经人工检查，请谨慎对待

CSS motion tokens and presets derived from the Windows Phone Toolkit page transitions (Ms-PL), for Umamichi UI web projects.

## Install

```bash
npm install @umamichi-ui/windows-phone-motion
```

Local development:

```json
"@umamichi-ui/windows-phone-motion": "file:../umamichi-ui/windows-phone-motion"
```

## Usage

```js
import '@umamichi-ui/windows-phone-motion';
import { initWindowsPhoneMotionNavigation } from '@umamichi-ui/windows-phone-motion/navigation';

initWindowsPhoneMotionNavigation();
```

- Default route: **turnstile** (`data-wpm-route="turnstile"`). UA `::view-transition-group` morph is suppressed so regions use Toolkit-style enter/exit instead of sliding to new layout positions.
- Set `data-wpm-route="slide"` on links (e.g. prev/next) for horizontal slide transitions.
- Wrap staggered blocks in `.wpm-feather` with `data-wpm-feather-index` on children.

See [ATTRIBUTION.md](./ATTRIBUTION.md). Development conversation transcript: [docs/development-conversation-transcript.md](./docs/development-conversation-transcript.md).
