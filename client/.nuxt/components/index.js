export { default as ActionTimeEntry } from '../..\\components\\Dashboard-Components\\DayView-Components\\ActionTimeEntry.vue'
export { default as AddNewTimeEntry } from '../..\\components\\Dashboard-Components\\DayView-Components\\AddNewTimeEntry.vue'
export { default as DayView } from '../..\\components\\Dashboard-Components\\DayView-Components\\DayView.vue'
export { default as DayViewContainer } from '../..\\components\\Dashboard-Components\\DayViewContainer.vue'
export { default as MobileContainer } from '../..\\components\\Dashboard-Components\\MobileContainer.vue'
export { default as ChartsCurrentWorkerUtilization } from '../..\\components\\Dashboard-Components\\Charts\\CurrentWorkerUtilization.vue'
export { default as ChartsRemainingLeave } from '../..\\components\\Dashboard-Components\\Charts\\RemainingLeave.vue'
export { default as ManagerTeamViewContainer } from '../..\\components\\Manager-Components\\ManagerTeamViewContainer.vue'
export { default as WorkerCard } from '../..\\components\\Manager-Components\\WorkerCard.vue'
export { default as Login } from '../..\\components\\Login.vue'
export { default as Logo } from '../..\\components\\Logo.vue'
export { default as ManagedTeams } from '../..\\components\\ManagedTeams.vue'
export { default as Navbar } from '../..\\components\\Navbar.vue'

// nuxt/nuxt.js#8607
function wrapFunctional(options) {
  if (!options || !options.functional) {
    return options
  }

  const propKeys = Array.isArray(options.props) ? options.props : Object.keys(options.props || {})

  return {
    render(h) {
      const attrs = {}
      const props = {}

      for (const key in this.$attrs) {
        if (propKeys.includes(key)) {
          props[key] = this.$attrs[key]
        } else {
          attrs[key] = this.$attrs[key]
        }
      }

      return h(options, {
        on: this.$listeners,
        attrs,
        props,
        scopedSlots: this.$scopedSlots,
      }, this.$slots.default)
    }
  }
}
