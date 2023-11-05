<template>
  <nav>
    <ul class="nav-bar">
      <RouterLink to="/mytracks">
        <li><span class="material-symbols-outlined"> timeline </span> My Tracks</li>
      </RouterLink>
      <RouterLink to="/search">
        <li><span class="material-symbols-outlined"> search </span> Search</li>
      </RouterLink>
      <hr />
      <a @click.prevent="logout" href="#">
        <li><span class="material-symbols-outlined"> logout </span> Logout</li>
      </a>
    </ul>
  </nav>
</template>

<script setup lang="ts">
import { useAuthStore } from '@/stores/auth'
import { useMessagesStore } from '@/stores/messages'
const store = useAuthStore()
const messages = useMessagesStore()

async function logout() {
  await store.logout()
  messages.info('You have logged out')
}
</script>

<style lang="scss">
ul.nav-bar {
  padding: 0;
  margin: 0.5em 0;
  list-style: none;

  a {
    color: black;
    text-decoration: none;
    transition: color 0.15s linear;
    &:hover {
      color: #23a;
    }
  }
  li {
    display: block;
    padding: 0.3em 1em;
    font-size: 1.2em;
    font-family: Montserrat, sans-serif;
    text-transform: uppercase;

    .material-symbols-outlined {
      position: relative;
      top: 4px;
      padding-right: 4px;
    }
  }
}
</style>
