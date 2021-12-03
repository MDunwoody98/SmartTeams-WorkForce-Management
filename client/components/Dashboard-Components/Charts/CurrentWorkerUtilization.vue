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
      labels: ['Absence', 'Non-utilized', 'Utilized'],
      datasets: [
        {
          label: 'Annual Leave',
          backgroundColor: ['grey', '#091C58', '#2D9FA0'],
          data: [4, 20, 76],
        },
      ],
    })
  },
}
</script>
