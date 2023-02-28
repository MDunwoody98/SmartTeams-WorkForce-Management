<script>
export default {
  async validate({ params }) {
    // Check if the tenant ID is valid by calling a REST API endpoint that
    // returns a boolean indicating whether the tenant exists
    const tenantId = params.tenant;
    const isValid = await fetch(`/api/tenants/${tenantId}/validate`);

    // If the tenant ID is not valid, redirect to an error page
    if (!isValid) {
      return { path: "/error" };
    }
  },

  async asyncData({ params }) {
    // Load tenant-specific data from a database based on the tenant ID in the URL
    const tenantId = params.tenant;
    const data = await fetch(`/api/tenants/${tenantId}/dashboard-data`);

    // Return the data as a prop to the page component
    return { dashboardData: data };
  }
};
</script>
