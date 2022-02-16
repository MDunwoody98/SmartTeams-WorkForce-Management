<script>
import { Pie } from 'vue-chartjs'

export default {
  extends: Pie,
  props: {
    workerId: {
      type: String,
      default: null,
    },
    options: {
      type: Object,
      default: null,
    },
  },
  async mounted() {
    const secondaryColor = window
      .getComputedStyle(document.body)
      .getPropertyValue('--color-secondary')
    const primaryColor = window
      .getComputedStyle(document.body)
      .getPropertyValue('--color-primary')
    // Start and End date params should be available somewhere to generate utilization charts
    const utilizationChartData = {
      labels: ['Absence', 'Non-utilized', 'Utilized'],
      datasets: [
        {
          label: 'Annual Leave',
          backgroundColor: ['grey', primaryColor, secondaryColor],
          data: [4, 20, 76],
        },
      ],
    }
    await this.renderChart(utilizationChartData, this.options)
  },
  methods: {
    retrieveUtilization(startDate, endDate) {
      return [4, 20, 76]
    },
  },
}
</script>
