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
  mounted() {
    // Ideally we would have some options here for providing a date range to calculate AL used
    const annualLeaveChartData = {
      labels: ['Leave used', 'Leave remaining'],
      datasets: [
        {
          label: 'Annual Leave',
          backgroundColor: ['#091C58', '#2D9FA0'],
          data: [16.25, 35],
        },
      ],
    }
    this.renderChart(annualLeaveChartData, this.options)
  },
}
</script>
