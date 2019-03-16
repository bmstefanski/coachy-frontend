import axios from "axios";
import {API_URL} from "@/utils/constants";
import {authorization} from "@/utils/headers";
import store from "@/store";
import {updateUserBoardIdentifier} from "./user.service";
import ObjectID from "bson-objectid";

export function createBoard() {
  return new Promise(resolve => {
    let user = store.state.user.user;
    let data = {
      name: "Board",
      owner: user,
      labels: [
        {
          identifier: ObjectID.generate(),
          name: "Do zrobienia",
          tasks: [
            {identifier: ObjectID.generate(), color: "#ff2db3", name: "Test task", content: "That's a test content 😋"},
            {identifier: ObjectID.generate(), color: "#06e7ff", name: "Test task", content: "That's a test content 😋"},
            {identifier: ObjectID.generate(), color: "#2b2b2b", name: "Test task", content: "That's a test content 😋"}
          ]
        },
        {
          identifier: ObjectID.generate(),
          name: "Gotowe",
          tasks: [
            {identifier: ObjectID.generate(), color: "#ff2db3", content: "That's a test content 😋"},
            {identifier: ObjectID.generate(), color: "#06e7ff", content: "That's a test content 😋"},
            {identifier: ObjectID.generate(), color: "#2b2b2b", content: "That's a test content 😋"}
          ]
        }
      ]
    };

    axios.post(`${API_URL}/boards`, data, authorization())
    .then(response => resolve(updateUserAndFetch(response.data.identifier)));
  });
}

export function fetch(payload) {
  return new Promise(resolve => {
    axios.get(`${API_URL}/boards/${payload.identifier}`, authorization())
    .then(response => resolve(response));
  })
}

export function updateUserAndFetch(identifier) {
  return updateUserBoardIdentifier({boardIdentifier: identifier})
  .then(() => fetch({identifier: identifier}))
}

export function update(board) {
  return axios.patch(`${API_URL}/boards/${board.identifier}`, board, authorization());
}

export function addTask(task, labelIndex, board) {
  board.labels[labelIndex].tasks.push(task);
  update(board);
}

export function addLabel(board) {
  board.labels.push({identifier: ObjectID.generate(), name: 'Nowa kolumna', tasks: []});
  update(board);
}

export function editTask(board, labelIndex, taskInstance) {
  board.labels[labelIndex].tasks.filter(task => taskInstance.task.identifier === task.identifier)
  .map(task => {
    task.name = taskInstance.name;
    task.color = taskInstance.color.hex || taskInstance.task.color;
    task.content = taskInstance.task.content;
  });

  update(board);
  taskInstance.closeModal();
}
