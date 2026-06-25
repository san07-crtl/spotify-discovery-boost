import { CritiqueItem, MetricCard } from '../types';

export const CRITIQUE_SECTIONS: CritiqueItem[] = [
  {
    id: 'crit-1',
    title: '1. Senior PM Verdict & Product Market Fit',
    description: 'A critical review of the strategic rationale, user motivation, and long-term viability of Discovery Boost.',
    rating: 'moderate',
    analysis: `While "Discovery Boost" hits on a very real problem—"the music bubble" where long-term users fall into repetitive listening ruts—its current conception operates on weak strategic foundations.
Spotify is already highly optimized for active discovery (Discover Weekly, Release Radar) and passive continuation (Smart Shuffle, Autoplay).
Discovery Boost creates an awkward "limbo" state: it forces active decision-making onto a passive listening state.

If a user has repetitively listened to the same tracks, it is often intentional (comfort listening, focus states, deep-work playlists). Forcing a generic modal onto them during an active listening session breaks the primary rule of streaming: **don't disrupt the flow**.`,
    recommendation: `Reposition this from an intrusive "session interrupt" into a "contextual helper". Instead of asking *“Want to discover fresh songs?”* while they are in the zone, introduce a subtle, non-blocking nudge in the Now Playing screen, or a "Boost" control directly on the Queue interface. Let users *pull* discovery when they feel bored, rather than *pushing* discovery on them when they might be focused.`
  },
  {
    id: 'crit-2',
    title: '2. UX Weaknesses & Friction Points',
    description: 'Identifying key interaction flaws that trigger cognitive load or break the user experience.',
    rating: 'critical',
    analysis: `The current prototype suffers from four major interaction and visual UX flaws:
1. **Interruptive Modals**: Throwing a prompt while a user is actively listening violates Spotify's design system. It feels like adware.
2. **Mystery Injection**: Inserting items directly into the queue without showing *where*, *when*, or *how many* is terrifying. Users treat their active queue as sacred.
3. **No Safety Valve**: The user has no easy way to clear all boosted tracks if they dislike the direction, forcing them to manually prune the queue item by item.
4. **Poor State Transitions**: The "✨ New" tag doesn't convey *why* the song is there or how it links to their tastes, making it feel like a paid placement rather than a curated selection.`,
    recommendation: `1. Transition the modal into an expandable context card on the Now Playing view or a floating badge above the Queue list.
2. Provide a visual "Queue Wave preview" showing exactly where the boosted tracks are slotted.
3. Add a global "Revert Boost" action at the top of the queue.
4. Use contextual tags (e.g., "M83 Radio Pick") instead of generic "✨ New".`
  },
  {
    id: 'crit-3',
    title: '3. Onboarding & Microcopy Improvements',
    description: 'How to redesign the initial touchpoint and make user-facing text feel authentic to Spotify.',
    rating: 'critical',
    analysis: `The current microcopy is too dry and conversational in a robotic way (*"You've been enjoying the same tracks lately..."*). It reads like an accusation ("You have bad, repetitive tastes!").
Furthermore, there is no onboarding: clicking "Try Discovery Boost" immediately dumps songs into the queue with zero visual explanation of the rules of engagement (e.g., "We will add 1 new track for every 4 songs").`,
    recommendation: `Use positive reinforcement instead. Pivot the copywriting from criticizing repetition to celebrating their core taste and offering a "refresh".
Show a quick, single-card visual preview explaining the boost ratio and introducing the interactive feedback buttons inside the queue items.`
  },
  {
    id: 'crit-4',
    title: '4. The Rationale Engine ("Why This Song")',
    description: 'Leveraging transparency to convert skepticism into curiosity.',
    rating: 'excellent',
    analysis: `Users are inherently skeptical of algorithmic recommendations. If a random song plays, their default assumption is that Spotify's label contracts are pushing payola.
Adding a generic "✨ New" tag increases this suspicion because it provides zero context.
Showing the recommendation rationale (e.g., "Added because you like M83") transforms the song from an intruder into a welcome relative.`,
    recommendation: `Introduce the "Recommendation Rationale Capsule" directly below the track title in the Queue and inside the Now Playing view.
Utilize three tiered levels of rationale:
- **Direct Seed Connection**: "Similar to *Midnight City*" (for high-similarity fits).
- **Aesthetic Vibe Match**: "Matches the upbeat synth of *MGMT*" (for style-based fits).
- **Social Proofing**: "Trending with listeners who enjoy *Daft Punk*" (for popularity-based fits).`
  },
  {
    id: 'crit-5',
    title: '5. Improving Trust, Control, and Transparency',
    description: 'Empowering the user to guide the algorithm rather than being subject to it.',
    rating: 'critical',
    analysis: `The current flow operates on a simple binary: Enable or Disable. Once enabled, the algorithm operates as a black box. This is the fastest way to drive users to disable the feature forever.
In a real product environment, taste is highly dynamic. A user might want a "Light Refresh" (10% new songs) vs. a "Deep Exploration" (40% new songs), or they might want to exclude certain genres entirely.`,
    recommendation: `Implement three critical Trust and Control widgets:
1. **Interactive Feedback Loop**: Give every boosted track visible "More like this" / "Less like this" buttons directly in the Queue view, with instant visual confirmations.
2. **Opt-Out & Intensity Slider**: Let users tap a "Discovery Settings" gear to control the mixture ratio (Subtle / Balanced / Adventurous).
3. **One-Tap Prune**: A visible "Clear Boosted Tracks" banner at the top of the queue that instantly restores the playlist to its pristine, original state.`
  },
  {
    id: 'crit-6',
    title: '6. Student Project vs. Spotify Feature',
    description: 'An honest evaluation of the initial concept design against production standards.',
    rating: 'moderate',
    analysis: `The proposed prototype has the core functional ideas but feels like a **student project** due to its reliance on system interruptions and lack of structural guardrails.
A real Spotify feature is designed with edge cases in mind: offline playback, cellular data saving, kid/family accounts, explicit content filters, and mixed-device listening (Connect / Alexa).
Furthermore, the assumption that users will happily accept items injected into their active queue without prior notification underestimates how protective power-users are over their manual queue.`,
    recommendation: `To make this feel like a native Spotify feature:
1. Implement "Smart Slotting": Boosted tracks should only insert themselves *after* the next track (never immediately, which disrupts current enjoyment).
2. Create visual visualizers (waveforms) matching Spotify's styling.
3. Integrate with the existing "Heart/Plus" library system and show contextual overlays with micro-animations.`
  }
];

export const MICROCOPY_COMPARISON = [
  {
    context: 'Trigger Prompt Title',
    original: '“You’ve been enjoying the same tracks lately.”',
    revised: '“Want to refresh your session?”',
    why: 'The original feels critical and repetitive. The revised focuses on an active, positive benefit (refreshing) and respects the user\'s agency.'
  },
  {
    context: 'Trigger Prompt Body',
    original: '“Want to discover fresh songs with a similar vibe?”',
    revised: '“We can subtly blend in a few high-match tracks that fit your current mood perfectly.”',
    why: 'Explains *how* it works ("subtly blend") and sets correct expectations about taste alignment.'
  },
  {
    context: 'Primary Action Button',
    original: '“Try Discovery Boost”',
    revised: '“Boost This Session”',
    why: '"Boost This Session" feels temporary, low-commitment, and localized to their current mood, encouraging higher opt-in.'
  },
  {
    context: 'Secondary Action Button',
    original: '“Not Now”',
    revised: '“Keep Current Vibe”',
    why: '"Keep Current Vibe" validates their current choice of repetitive listening as a positive, intentional selection rather than a rejection of the feature.'
  },
  {
    context: 'Recommendation Tag',
    original: '“✨ New”',
    revised: '“✨ Discovery Match”',
    why: '"New" is ambiguous (new release? new to them? ad?). "Discovery Match" frames it as an intelligent algorithmic benefit.'
  }
];

export const METRICS_BOARD: MetricCard[] = [
  {
    name: 'Discovery Retention Rate',
    value: '42.6%',
    change: '+8.4%',
    status: 'up',
    description: 'Percentage of users who keep Discovery Boost active for more than 3 consecutive listening sessions.'
  },
  {
    name: 'Skip-to-Like Ratio',
    value: '2.3x',
    change: '-12.0%',
    status: 'down',
    description: 'Number of skips on boosted songs divided by the number of likes. Lower is better, indicating higher match quality.'
  },
  {
    name: 'Boost Bounce Rate',
    value: '4.8%',
    change: '-1.5%',
    status: 'down',
    description: 'Percentage of users who turn off Discovery Boost within 5 minutes of activation (primary indicator of taste mismatch).'
  },
  {
    name: 'Library Addition Rate',
    value: '18.7%',
    change: '+3.2%',
    status: 'up',
    description: 'Percentage of boosted songs that are saved to the user\'s "Liked Songs" or custom playlists.'
  },
  {
    name: 'Queue Pruning Frequency',
    value: '0.12',
    change: '-0.05',
    status: 'down',
    description: 'Average number of manual queue removals of boosted tracks per user session (lower is better, proving high taste accuracy).'
  }
];

export const FLOW_STEPS = [
  {
    step: '1. Repetitive State Trigger',
    action: 'Subtle nudge in Now Playing UI',
    detail: 'Algorithm detects that 5 of the last 8 played tracks are identical. A small "+" or glowing "Refine Vibe" badge appears organically on the cover art or queue icon, avoiding modal interruptions.'
  },
  {
    step: '2. Transparent Opt-In',
    action: 'Micro-Onboarding Bottom Sheet',
    detail: 'User taps the badge. A sleek bottom sheet highlights the rule: "We\'ll blend in 1 custom-matched track every 4 songs. You have full control to adjust or clear them instantly."'
  },
  {
    step: '3. Strategic Queue Insertion',
    action: 'Smart Slotting & Marking',
    detail: 'The queue regenerates. Discovered tracks are placed with a glowing, stylized "Discovery Match" tag and secondary text stating exactly why (e.g., "Inspired by Midnight City").'
  },
  {
    step: '4. In-Line Algorithmic Tuning',
    action: 'Immediate Control Overlay',
    detail: 'Users can interact with feedback pills right inside the Queue list: Save (Heart), More Like This, Less Like This, or Remove. Clicking Less Like This instantly swaps the song with a different candidate.'
  },
  {
    step: '5. Seamless Success Capture',
    action: 'Aesthetic Heart Pop & Stats Update',
    detail: 'Liking a boosted song triggers a premium vector haptic pop-up celebrating the discover spark and feeding immediate positive reinforcement back into the personalization model.'
  }
];
