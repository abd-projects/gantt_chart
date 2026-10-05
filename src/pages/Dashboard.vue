<script setup>
import { useTaskStore } from '../stores/taskStore'
import {
  ref,
  computed,
  onMounted
} from 'vue'

const taskStore = useTaskStore()

const dayWidth = 40

const addTDialog = ref(false)
const taskName = ref('')
const taskStart = ref('')
const taskEnd = ref('')

const taskId = ref(null)
const addSTDialog = ref(false)
const sTaskName = ref('')
const sTaskStart = ref('')
const sTaskEnd = ref('')

const timelineStart = computed(() => {
  let earliestDate = new Date()

  taskStore.tasks.forEach(task => {
    const startDate = parseDate(task.start)
    if(startDate < earliestDate) {
      earliestDate = startDate
    }
  })

  earliestDate.setDate(earliestDate.getDate() - 3)
  return earliestDate
})

const timelineEnd = computed(() => {
  let latestDate = new Date()

  taskStore.tasks.forEach(task => {
    const endDate = parseDate(task.end)
    if (endDate > latestDate) {
      latestDate = endDate
    }
  })

  latestDate.setDate(latestDate.getDate() + 3)
  return latestDate
})

const dates = computed(() => {
  const result = []
  const current = new Date(timelineStart.value)
  while (current <= timelineEnd.value) {
    result.push(new Date(current))
    current.setDate(current.getDate() + 1)
  }
  return result
})

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

function month(date) {
  switch(date.getMonth()) {
    case 0:
      return 'Jan'      
    case 1:
      return 'Feb'      
    case 2:
      return 'Mar'     
    case 3:
      return 'Apr'     
    case 4:
      return 'May'     
    case 5:
      return 'Jun'     
    case 6:
      return 'Jul'    
    case 7:
      return 'Aug'
    case 8:
      return 'Sep'
    case 9:
      return 'Oct'
    case 10:
      return 'Nov'
    case 11:
      return 'Dec'
  }
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
  addTDialog.value = false
}

function openAddSubTask(task) {
  taskId.value = task.id
  addSTDialog.value = true
}

function addSubTask() {
  taskStore.addSubTask(
    taskId.value,
    sTaskName.value,
    sTaskStart.value,
    sTaskEnd.value
  )
  sTaskName.value = ''
  sTaskStart.value = ''
  sTaskEnd.value = ''
  addSTDialog.value = false
}

function parseDate(date) {
  const [year, month, day] = date.split('-').map(Number)
  return new Date(year, month-1, day)
}

function getDateOffset(date) {
  const difference = parseDate(date) - timelineStart.value
  return Math.round(difference / (1000 * 60 * 60 * 24))
}

function getTaskDuration(task) {
  const start = parseDate(task.start)
  const end = parseDate(task.end)
  const difference = end - start
  return Math.round(difference / (1000 * 60 * 60 * 24)) + 1
}

function taskStyle(task) {
  const offset = getDateOffset(task.start)
  const duration = getTaskDuration(task)
  return {
    left: `${offset * dayWidth}px`,
    width: `${duration * dayWidth}px`
  }
}

function isToday(date) {
  const today = new Date()
  return (
    date.getFullYear() == today.getFullYear() &&
    date.getMonth() == today.getMonth() &&
    date.getDate() == today.getDate()
  )
}

function overdueDuration(task) {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const end = parseDate(task.end)
  const difference = today - end
  return Math.round(
    difference / (1000 * 60 * 60 * 24)
  )
}

function overdueStyle(task) {
  const endOffset = getDateOffset(task.end)
  const duration = overdueDuration(task)
  return {
    left: `${(endOffset + 1) * dayWidth}px`,
    width: `${duration * dayWidth}px`
  }
}
</script>

<template>
  <v-app>
    <v-dialog v-model="addTDialog" max-width="500">
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

          <v-btn @click="addTDialog = false">
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

    <v-dialog v-model="addSTDialog" max-width="500">
      <v-card>
        <v-card-title>
          Add Subtask
        </v-card-title>

        <v-card-text>
          <v-text-field
            v-model="sTaskName"
            label="Subtask name"
          />

          <v-text-field
            v-model="sTaskStart"
            label="Subtask start"
            type="date"
          />

          <v-text-field
            v-model="sTaskEnd"
            label="Subtask end"
            type="date"
          />
        </v-card-text>

        <v-card-actions>
          <v-spacer>
          </v-spacer>

          <v-btn @click="addSTDialog = false">
            Cancel
          </v-btn>

          <v-btn
            @click="addSubTask"
            color="primary"
          >
            Add Task
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-main>
      <v-container fluid>
        <div class="page-header">
          <div>
            <h1>
              Project Progress
            </h1>

            <p>
              Project timeline and task management
            </p>
          </div>

          <v-btn
            color="primary"
            prepend-icon="mdi-plus"
            @click="addTDialog = true"
          >
            Add Task
          </v-btn>
        </div>
        
        <v-card>
          <v-card-title>
            Project Timeline
          </v-card-title>

          <v-card-text>
            <div class="gantt">
              <div class="gantt-header">
                <div
                  class="task-column"
                >
                  Task
                </div>

                <div
                  class="date-header"
                  :style="{gridTemplateColumns: `repeat(${dates.length}, ${dayWidth}px)`}"
                >
                  <div
                    v-for="date in dates"
                    :key="date.toISOString()"
                    :class="{
                      date: true,
                      today: isToday(date)
                    }"
                  >
                    <div class="date-name">
                      {{ month(date) }}
                    </div>

                    <div class="date-number">
                      {{ date.getDate() }}
                    </div>
                  </div>
                </div>
              </div>

              <div
                v-for="task in tasks"
                :key="task.id"
                class="gantt-row"
                :class="{
                  'subtask-row': task.isSubTask,
                  'main-task-row': !task.isSubTask
                }"
              >
                <div
                  class="task-column"
                  :class="{ 'subtask-column': task.isSubTask }"
                >
                  <div
                    class="task-name"
                    :class="{ subtask: task.isSubTask }"
                  >
                    {{ task.isSubTask ? '--- ' + task.name : task.name }}
                  </div>

                  <v-btn
                    v-if="!task.isSubTask"
                    prepend-icon="mdi-plus"
                    size="small"
                    @click="openAddSubTask(task)"
                  >
                  </v-btn>
                </div>

                <div
                  class="date-column"
                  :class="{ 'subtask-column': task.isSubTask }"
                  :style="{gridTemplateColumns: `repeat(${dates.length}, ${dayWidth}px)`}"
                >
                  <div
                    v-for="date in dates"
                    :key="date.toISOString()"
                    :class="{
                      grid_cell: true,
                      today: isToday(date)
                    }"
                  >
                  </div>

                  <div
                    class="task-bar"
                    :class="{
                      'in-progress': task.status === 'In Progress',
                      'not-started': task.status === 'Not Started',
                      'completed': task.status === 'Completed',
                      'overdue' : task.status === 'Overdue'
                    }"
                    :style="taskStyle(task)"
                  >
                    <div
                      class="task-progress"
                      :style="{ width: `${task.progress}%` }"
                    >
                    </div>
                  </div>

                  <div
                    v-if="task.overdue"
                    class="overdue-extension"
                    :class="{
                      overdue: task.status === 'Overdue',
                      completed: task.status === 'Completed'
                    }"
                    :style="overdueStyle(task)"
                  >
                  </div>
                </div>
              </div>
            </div>
          </v-card-text>
        </v-card>
      </v-container>
    </v-main>
  </v-app>
</template>

<style scoped>
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.page-header h1 {
  margin: 0;
}

.page-header p {
  margin: 4px 0 0;
  color: #666;
}

.gantt {
  width: 100%;
  overflow-x: auto;
}

.gantt-header,
.gantt-row {
  display: grid;
  grid-template-columns: 220px max-content;
}

.gantt-row {
  min-height: 55px;
}

.gantt-row.subtask-row {
  min-height: 25px;
  font-size: smaller;
}

.task-column {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 15px 8px 0px 12px;
  border-right: 1px solid #444;
  border-bottom: 1px solid #333;
  font-weight: 400;
  background: #1e1e1e;
  box-sizing: border-box;
}

.task-name {
  flex: 1;
  min-width: 0;
  overflow-wrap: anywhere;
  line-height: 1.3;
}

.subtask {
  padding-left: 25px;
}

.today {
  background: rgba(25, 118, 210, 0.15);
}

.today .date-number {
  color: #42a5f5;
}

.date-header {
  position: relative;
  display: grid;
  min-height: 70px;
  width: max-content;
}

.date-column {
  position: relative;
  display: grid;
  width: max-content;
}

.task-bar {
  position: absolute;
  top: 10px;
  height: 40px;
  border-radius: 6px;
  color: white;
  display: flex;
  align-items: center;
  padding: 0 10 0px;
  font-size: 13px;
  white-space: nowrap;
  z-index: 2;
  overflow: hidden;
}

.gantt-row.subtask-row .task-bar {
  top: 1px;
  height: 25px;
}

.task-bar:hover {
  transform: translateY(-1px);
  box-shadow: 0 3px 8px rgba(0, 0, 0, 0.25);
}

.in-progress {
  background: #1976d2;
}

.not-started {
  background: #757575;
}

.completed {
  background: #388e3c;
}

.overdue {
  background: red;
}

.task-progress {
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.5);
  transition: width 0.2s ease;
}

.overdue-extension {
  position: absolute;
  top: 10px;
  height: 40px;
  border-radius: 6px;
  z-index: 1;
}

.overdue-extension.overdue {
  background: repeating-linear-gradient(
    90deg,
    #444,
    #444 8px,
    red 6px,
    red 16px
  );
}

.overdue-extension.completed {
  background: repeating-linear-gradient(
    90deg,
    #444,
    #444 8px,
    #388e3c 8px,
    #388e3c 16px
  );
}

.gantt-row.gantt-row.subtask-row .overdue-extension {
  top: 1px;
  height: 25px;
}

.date {
  height: 70px;
  text-align: center;
  padding: 8px 5px;
  border-right: 1px solid #444;
  border-bottom: 1px solid #333;
}

.date-name {
  font-size: 11px;
  color: #777;
}

.date-number {
  font-size: 14px;
  font-weight: 600;
  margin-top: 4px;
}

.grid_cell {
  border-right: 1px solid #444;
  border-bottom: 1px solid #333;
  box-sizing: border-box;
}
</style>