export default {
  meta: {
    name: "users",
    templateVersion: "v0.1"
  },
  method: "GET",
  url: "{{ secrets.BASE_URL }}/users",
}
