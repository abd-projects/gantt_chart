<script setup>
import * as XLSX from 'xlsx'
import { VBtn } from 'vuetify/components'
import { useTaskStore } from '../stores/taskStore'
import {
  ref,
  computed,
  onMounted
} from 'vue'

const taskStore = useTaskStore()

const addDialog = ref(false)
const editDialog = ref(false)
const addSubTaskDialog = ref(false)
const editSubTaskDialog = ref(false)

const taskName = ref('')
const taskStart = ref('')
const taskEnd = ref('')

const editName = ref('')
const editStart = ref('')
const editEnd = ref('')
const editStatus = ref('')
const editProgress = ref(0)
const editId = ref(null)

const taskId = ref(null)
const editSId = ref(null)

const tasks = computed(() => {
  const result = []

  taskStore.tasks.forEach(task => {
    result.push({
      ...task,
      isSubTask: false
    })
    task.subTasks.forEach(subTask => {
      result.push({
        ...subTask,
        isSubTask: true,
        taskId: task.id
      })
    })
  })
  return result
})

onMounted(() => {
  taskStore.updateOverdue()
})

async function importFile(event) {
  const file = event.target.files[0]

  if (!file) {
    return
  }
  
  const data = await file.arrayBuffer()
  const workbook = XLSX.read(data, { cellDates: true })
  const sheet = workbook.Sheets[workbook.SheetNames[0]]
  const rows = XLSX.utils.sheet_to_json(sheet)

  if (rows.length === 0) {
    alert('The file is empty.')
    event.target.value = ''
    return
  }

  const requiredColumns = [
    'Type',
    'Name',
    'Start',
    'End'
  ]
  const firstRow = rows[0]

  for (const column of requiredColumns) {
    if (!(column in firstRow)) {
      alert(`Missing column: ${column}`)
      event.target.value = ''
      return
    }
  }

  taskStore.importTasks(rows)
  alert(`${rows.length} rows imported successfully.`)
  eventName.target.value = ''
}

function addTask() {
  taskStore.addTask(
    taskName.value,
    taskStart.value,
    taskEnd.value
  )
  taskName.value = ''
  taskStart.value = ''
  taskEnd.value = ''
  addDialog.value = false
}

function openAddSubTask(task) {
  taskId.value = task.id
  addSubTaskDialog.value = true
}

function addSubTask() {
  taskStore.addSubTask(
    taskId.value,
    taskName.value,
    taskStart.value,
    taskEnd.value
  )
  taskName.value = ''
  taskStart.value = ''
  taskEnd.value = ''
  addSubTaskDialog.value = false
}

function openEdit(task) {
  editName.value = task.name
  editStart.value = task.start
  editEnd.value = task.end
  editStatus.value = task.status
  editProgress.value = task.progress
  editId.value = task.id
  editDialog.value = true
}

function saveEdit() {
  taskStore.updateTask(
      editName.value,
      editStart.value,
      editEnd.value,
      editStatus.value,
      editProgress.value,
      editId.value
  )
  editDialog.value = false
}

function openSubTaskEdit(task) {
  editName.value = task.name
  editStart.value = task.start
  editEnd.value = task.end
  editStatus.value = task.status
  editProgress.value = task.progress
  editId.value = task.taskId
  editSId.value = task.id
  editSubTaskDialog.value = true
}

function saveSubTaskEdit() {
  taskStore.updateSubTask(
      editId.value,
      editName.value,
      editStart.value,
      editEnd.value,
      editStatus.value,
      editProgress.value,
      editSId.value
  )
  editSubTaskDialog.value = false
}

function deleteTask(id) {
    taskStore.deleteTask(id)
}

function deleteSubTask(id, sId) {
    taskStore.deleteSubTask(id, sId)
}
</script>

<template>
  <v-card>
    <div class="page-header">
      <v-card-title>
        Tasks Overview
      </v-card-title>

      <div class="header-buttons">
        <v-btn
          color="primary"
          prepend-icon="mdi-plus"
          @click="addDialog = true"
        >
          Add Task
        </v-btn>

        <v-btn
          color="secondary"
          prepend-icon="mdi-file-upload"
          @click="$refs.fileInput.click()"
        >
          Import
        </v-btn>

        <input
          ref="fileInput"
          type="file"
          accept=".csv,.xlsx,.xls"
          style="display: none"
          @change="importFile"
        />
      </div>
    </div>

    <v-card-text>
      <v-table>
        <thead>
          <tr>
            <th>Task</th>
            <th>Start Date</th>
            <th>End Date</th>
            <th>Status</th>
            <th>Progress</th>
            <th>Task ID</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          <tr
            v-for="task in tasks"
            :key="task.id"
            :class="{
              'subtask-row': task.isSubTask,
              'main-task-row': !task.isSubTask
            }"
          >
            <td>{{ task.isSubTask ? '--- ' + task.name : task.name }}</td>
            <td>{{ task.start }}</td>
            <td>{{ task.end }}</td>
            <td>{{ task.status }}</td>
            <td>{{ task.progress }} %</td>
            <td>{{ task.id }}</td>
            <td>
              <template v-if="!task.isSubTask">
                <v-btn
                  icon="mdi-pencil"
                  variant="text"
                  @click="openEdit(task)"
                >
                </v-btn>

                <v-btn
                  icon="mdi-delete"
                  variant="text"
                  @click="deleteTask(task.id)"
                >
                </v-btn>

                <v-btn
                  icon="mdi-plus"
                  variant="text"
                  @click="openAddSubTask(task)"
                >
                </v-btn>
              </template>

              <template v-else>
                <v-btn
                  icon="mdi-pencil"
                  variant="text"
                  @click="openSubTaskEdit(task)"
                >
                </v-btn>

                <v-btn
                  icon="mdi-delete"
                  variant="text"
                  @click="deleteSubTask(task.taskId, task.id)"
                >
                </v-btn>
              </template>
            </td>
          </tr>
        </tbody>
      </v-table>
    </v-card-text>
  </v-card>

  <v-dialog v-model="editDialog" max-width="500">
    <v-card>
      <v-card-title>
        Edit Task
      </v-card-title>

      <v-card-text>
        <v-text-field
          v-model="editName"
          label="Task Name"
        >
        </v-text-field>

        <v-text-field
          v-model="editStart"
          label="Start Date"
          type="date"
        >
        </v-text-field>

        <v-text-field
          v-model="editEnd"
          label="End Date"
          type="date"
        >
        </v-text-field>

        <v-select
          v-model="editStatus"
          label="Status"
          :items="['Not Started', 'In Progress', 'Completed', 'Overdue']"
        >
        </v-select>

        <v-text-field
          v-model.number="editProgress"
          label="Progress"
          type="number"
          min="0"
          max="100"
        >
        </v-text-field>
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>

        <v-btn @click="editDialog = false">
          Cancel
        </v-btn>

        <v-btn
          @click="saveEdit"
          color="primary"
        >
          Save Changes
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <v-dialog v-model="addDialog" max-width="500">
    <v-card>
      <v-card-title>
        Add Task
      </v-card-title>

      <v-card-text>
        <v-text-field
          v-model="taskName"
          label="Task name"
        />

        <v-text-field
          v-model="taskStart"
          label="Task start"
          type="date"
        />

        <v-text-field
          v-model="taskEnd"
          label="Task end"
          type="date"
        />
      </v-card-text>

      <v-card-actions>
        <v-spacer>
        </v-spacer>

        <v-btn @click="addDialog = false">
          Cancel
        </v-btn>

        <v-btn
          @click="addTask"
          color="primary"
        >
          Add Task
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <v-dialog v-model="addSubTaskDialog" max-width="500">
    <v-card>
      <v-card-title>
        Add Subtask
      </v-card-title>

      <v-card-text>
        <v-text-field
          v-model="taskName"
          label="Subtask name"
        />

        <v-text-field
          v-model="taskStart"
          label="Subtask start"
          type="date"
        />

        <v-text-field
          v-model="taskEnd"
          label="Subtask end"
          type="date"
        />
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>

        <v-btn @click="addSubTaskDialog = false">
          Cancel
        </v-btn>

        <v-btn
          @click="addSubTask"
          color="primary"
        >
          Add Subtask
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <v-dialog v-model="editSubTaskDialog" max-width="500">
    <v-card>
      <v-card-title>
        Edit Subtask
      </v-card-title>

      <v-card-text>
        <v-text-field
          v-model="editName"
          label="Subtask Name"
        />

        <v-text-field
          v-model="editStart"
          label="Start Date"
          type="date"
        />

        <v-text-field
          v-model="editEnd"
          label="End Date"
          type="date"
        />

        <v-select
          v-model="editStatus"
          label="Status"
          :items="['Not Started', 'In Progress', 'Completed', 'Overdue']"
        />

        <v-text-field
          v-model.number="editProgress"
          label="Progress"
          type="number"
          min="0"
          max="100"
        />
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>

        <v-btn @click="editSubTaskDialog = false">
          Cancel
        </v-btn>

        <v-btn
          @click="saveSubTaskEdit"
          color="primary"
        >
          Save Changes
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<style scoped>
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 24px 24px 0px 0px;
}

.header-buttons {
  display: flex;
  gap: 5px;
}

.subtask-row td {
  background-color: #38383a;
}

.subtask-row td:first-child{
  padding-left: 50px;
}
</style>