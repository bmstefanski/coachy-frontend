import {get} from "@/service/schedule.service";
import {notification} from "@/utils/toastr.utils";
import draggable from 'vuedraggable'
import store from "@/store";
import exerciseModal from "./component/ExerciseModal";

export default {
  data: () => ({
    schedule: {},
    isCoach: store.state.user.user.accountType === 'COACH'
  }),
  components: {
    draggable,
    exerciseModal
  },
  mounted() {
    let identifier = this.$route.params.id;
    get({identifier: identifier})
    .then(response => {
          this.schedule = response.data;
        }
    )
    .catch(() => {
      notification.error('Nie znaleziono planu'); // todo
      this.$router.back();
    });
  },
  methods: {
    addExercise(dayIndex) {
      this.schedule.days[dayIndex].exercises.push({name: "Test" + Math.random()});
    },
    removeExercise(dayIndex, exerciseName) {
      this.schedule.days[dayIndex].exercises = this.schedule.days[dayIndex].exercises
      .filter(exercise => exercise.name !== exerciseName);
    },
    openExerciseModal() {
      this.$refs.exerciseModal.openModal();
    }
  }
}