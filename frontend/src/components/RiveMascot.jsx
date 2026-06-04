import { useRive, useStateMachineInput, Layout, Fit, Alignment } from "@rive-app/react-canvas";
import { useT } from "../lib/i18n.jsx";

// Names the .riv file must use so it plugs into this component (set these up in
// the Rive editor — see RIVE.md):
//   - State machine: "State Machine 1"
//   - Trigger input (fires on tap): "tap"
const STATE_MACHINE = "State Machine 1";
const TAP_INPUT = "tap";

// Plays the rigged Rive mascot (/mascot.riv) with Duolingo-style motion. If the
// file fails to load it calls onUnavailable so the parent can fall back to PNG.
export default function RiveMascot({ size = 72, className = "", interactive = false, onUnavailable }) {
  const { t } = useT();
  const { rive, RiveComponent } = useRive({
    src: "/mascot.riv",
    stateMachines: STATE_MACHINE,
    autoplay: true,
    layout: new Layout({ fit: Fit.Contain, alignment: Alignment.Center }),
    onLoadError: () => onUnavailable?.(),
  });
  const tap = useStateMachineInput(rive, STATE_MACHINE, TAP_INPUT);

  return (
    <RiveComponent
      role="img"
      aria-label={t("mascot.alt")}
      style={{ width: size, height: size }}
      className={className}
      onClick={interactive && tap ? () => tap.fire() : undefined}
    />
  );
}
