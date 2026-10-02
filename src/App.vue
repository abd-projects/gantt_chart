<template>
  <v-app>
    <v-app-bar>
      <v-app-bar-title>
        Gantt Chart
      </v-app-bar-title>
    </v-app-bar>

    <v-navigation-drawer permanent>
      <v-list>
        <v-list-item
          prepend-icon="mdi-view-dashboard"
          title="Dashboard"
          to="/dashboard"
        >
        </v-list-item>

        <v-list-item
          prepend-icon="mdi-format-list-bulleted"
          title="Tasks"
          to="/tasks"
        >
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-main>
      <router-view />
    </v-main>

  </v-app>
</template>