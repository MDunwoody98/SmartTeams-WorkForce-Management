<script>
import { Pie } from 'vue-chartjs'

export default {
  extends: Pie,
  props: {
    workerId: {
      type: Number,
      default: null,
    },
    options: {
      type: Object,
      default: null,
    },
  },
  mounted() {
    const secondaryColor = window
      .getComputedStyle(document.body)
      .getPropertyValue('--color-secondary')
    const primaryColor = window
      .getComputedStyle(document.body)
      .getPropertyValue('--color-primary')
    // Ideally we would have some options here for providing a date range to calculate AL used
    const annualLeaveChartData = {
      labels: ['Leave used', 'Leave remaining'],
      datasets: [
        {
          label: 'Annual Leave',
          backgroundColor: [primaryColor, secondaryColor],
          data: [16.25, 35],
        },
      ],
    }
    this.renderChart(annualLeaveChartData, this.options)
  },
}
</script>
