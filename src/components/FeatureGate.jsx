/**
 * FeatureGate — wraps premium features for future monetization.
 *
 * RIGHT NOW: pure pass-through. Everything is unlocked.
 *
 * LATER: check useTeam().isPaid and show an upgrade prompt
 * for locked features instead of the children.
 *
 * Usage:
 *   <FeatureGate feature="unlimited_scenarios">
 *     <DecisionGame ... />
 *   </FeatureGate>
 */
// import { useTeam } from '../context/TeamContext.jsx'

export default function FeatureGate({ children /*, feature */ }) {
  // --- MONETIZATION OFF: everything unlocked ---
  return children

  // --- MONETIZATION ON (uncomment when ready): ---
  // const { isPaid } = useTeam()
  //
  // const FREE_FEATURES = [
  //   'field_diagram',      // DiamondView always free
  //   'basic_plays',        // 3 plays free
  //   'basic_quiz',         // 5 questions free
  //   'basic_scenarios',    // 3 scenarios free
  // ]
  //
  // if (isPaid || FREE_FEATURES.includes(feature)) {
  //   return children
  // }
  //
  // return (
  //   <div className="card p-6 text-center">
  //     <p className="text-2xl mb-2">🔒</p>
  //     <p className="text-white font-bold mb-1">Team Feature</p>
  //     <p className="text-sm text-slate-400 mb-4">
  //       Ask your coach to enter your team code to unlock this!
  //     </p>
  //   </div>
  // )
}
