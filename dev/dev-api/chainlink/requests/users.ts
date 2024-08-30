import text from "./test"

export default {
  meta: {
    name: `${text}users`,
    templateVersion: "v0.1"
  },
  method: "GET",
  url: "{{ secrets.BASE_URL }}/users",
}
