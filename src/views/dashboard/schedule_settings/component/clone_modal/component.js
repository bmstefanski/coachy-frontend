import {SweetModal, SweetModalTab} from "sweet-modal-vue";
import {notification} from "@/utils/toastr.utils";
import {getErrorMessage} from "@/utils/validation.utils";
import {fetchAll} from "@/service/schedule.service";
import store from "@/store";
import axios from "axios";
import {API_URL} from "@/utils/constants";

export default {
  name: 'schedule-clone-modal',
  components: {
    sweetModal: SweetModal,
    sweetModalTab: SweetModalTab
  },
  props: ['schedule'],
  data: () => ({
    charge: '',
    suggestionAttribute: 'username',
    suggestions: []
  }),
  methods: {
    openModal() {
      this.$refs.scheduleCloneModal.open();
    },
    closeModal() {
      this.$refs.scheduleCloneModal.close();
    },
    cloneSchedule() {
      console.log(this.schedule);
      store.dispatch('schedule/create', {
        name: this.schedule.name,
        creator: {identifier: JSON.parse(localStorage.getItem('user')).identifier},
        charge: {identifier: this.suggestions[0].identifier},
        note: this.schedule.note,
        active: this.schedule.active,
        days: this.schedule.days
      })
      .then(response => {
        notification.success(this.$t('create_schedule.created'));
        fetchAll();
        this.$router.push(`/dashboard/schedules/${response.data.identifier}`);
      })
      .catch(error => notification.error(getErrorMessage('create_schedule', error)));
    },
    changed: function () {
      let that = this;

      this.suggestions = [];
      axios.get(`${API_URL}/users?username=${this.charge}`)
      .then(function (response) {
        response.data.content.forEach((rawCharge) => {
          that.suggestions.push(rawCharge);
        })
      })
    }
  }
}