<script>
import { Pie } from 'vue-chartjs'

export default {
  extends: Pie,
  props: {
    chartData: {
      type: Object,
      default: null,
    },
    options: {
      type: Object,
      default: null,
    },
  },
  mounted() {
    this.renderChart({
      labels: ['Leave used', 'Leave remaining'],
      datasets: [
        {
          label: 'Annual Leave',
          backgroundColor: ['#091C58', '#2D9FA0'],
          data: [16.25, 35],
        },
      ],
    })
  },
}
</script>
