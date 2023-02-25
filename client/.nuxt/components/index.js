export { default as ActionTimeEntry } from '../..\\components\\Dashboard-Components\\DayView-Components\\ActionTimeEntry.vue'
export { default as AddNewTimeEntry } from '../..\\components\\Dashboard-Components\\DayView-Components\\AddNewTimeEntry.vue'
export { default as DayView } from '../..\\components\\Dashboard-Components\\DayView-Components\\DayView.vue'
export { default as DayViewContainer } from '../..\\components\\Dashboard-Components\\DayViewContainer.vue'
export { default as MobileContainer } from '../..\\components\\Dashboard-Components\\MobileContainer.vue'
export { default as ChartsCurrentWorkerUtilization } from '../..\\components\\Dashboard-Components\\Charts\\CurrentWorkerUtilization.vue'
export { default as ChartsRemainingLeave } from '../..\\components\\Dashboard-Components\\Charts\\RemainingLeave.vue'
export { default as ManagerTeamViewContainer } from '../..\\components\\Manager-Components\\ManagerTeamViewContainer.vue'
export { default as WorkerCard } from '../..\\components\\Manager-Components\\WorkerCard.vue'
export { default as CreateProject } from '../..\\components\\Admin-Components\\CreateProject.vue'
export { default as CreateTeam } from '../..\\components\\Admin-Components\\CreateTeam.vue'
export { default as CreateTimeCode } from '../..\\components\\Admin-Components\\CreateTimeCode.vue'
export { default as CreateTimeOffCode } from '../..\\components\\Admin-Components\\CreateTimeOffCode.vue'
export { default as CreateUser } from '../..\\components\\Admin-Components\\CreateUser.vue'
export { default as EditUser } from '../..\\components\\Admin-Components\\EditUser.vue'
export { default as UpdateAnnualLeavePolicy } from '../..\\components\\Admin-Components\\UpdateAnnualLeavePolicy.vue'
export { default as UpdateFTE } from '../..\\components\\Admin-Components\\UpdateFTE.vue'
export { default as UpdateProject } from '../..\\components\\Admin-Components\\UpdateProject.vue'
export { default as UpdateTeam } from '../..\\components\\Admin-Components\\UpdateTeam.vue'
export { default as UpdateTimeCode } from '../..\\components\\Admin-Components\\UpdateTimeCode.vue'
export { default as UpdateTimeOffCode } from '../..\\components\\Admin-Components\\UpdateTimeOffCode.vue'
export { default as ChangeMyPassword } from '../..\\components\\Profile-Components\\ChangeMyPassword.vue'
export { default as ChangeMyPhoto } from '../..\\components\\Profile-Components\\ChangeMyPhoto.vue'
export { default as UpdateMyDetails } from '../..\\components\\Profile-Components\\UpdateMyDetails.vue'
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
