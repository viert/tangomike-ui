<template>
  <div class="whole-damn-page">
    <form @submit.prevent="onSubmit" class="signup-form">
      <h4>Track My Flight</h4>
      <div class="form-group">
        <label for="username">Username</label>
        <input v-focus v-model="username" type="text" class="form-control" id="username" />
      </div>
      <div class="form-group">
        <label for="first_name">First Name</label>
        <input v-model="firstName" type="text" class="form-control" id="first_name" />
      </div>
      <div class="form-group">
        <label for="last_name">Last Name</label>
        <input v-model="lastName" type="text" class="form-control" id="last_name" />
      </div>
      <div class="form-group">
        <label for="email">Email</label>
        <input v-model="email" type="text" class="form-control" id="email" />
      </div>
      <hr />
      <div class="form-group">
        <label for="password">Password</label>
        <input v-model="password" type="password" class="form-control" id="password" />
      </div>
      <div class="form-group">
        <label for="password_c">Confirm Password</label>
        <input v-model="passwordConfirm" type="password" class="form-control" id="password_c" />
      </div>
      <div class="change-mode">
        Already a member? <a href="#" @click.prevent="changeMode">Sign in</a>
      </div>
      <div class="form-buttons">
        <button type="submit" class="btn btn-primary">Sign up</button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { useGlobalStore, AuthState } from '@/stores/global'
import { useMessagesStore } from '@/stores/messages'
import { ref } from 'vue'

const store = useGlobalStore()
const messages = useMessagesStore()
const username = ref('')
const password = ref('')
const passwordConfirm = ref('')
const firstName = ref('')
const lastName = ref('')
const email = ref('')

async function onSubmit() {
  const user = await store.signup(
    username.value,
    password.value,
    passwordConfirm.value,
    firstName.value,
    lastName.value,
    email.value
  )
  if (user) {
    messages.info('User created successfully, you can now log in')
  } else {
    password.value = ''
    passwordConfirm.value = ''
  }
}
function changeMode() {
  store.setAuthState(AuthState.NotLoggedIn)
}
</script>

<style lang="scss">
@use 'sass:math';
@use '@/assets/mixins.scss';

$form-height: 450px;

.signup-form {
  @extend %center-form;
  top: calc(50% - math.div($form-height, 2));
  left: calc(50% - 180px);
  width: 360px;
  height: $form-height;
  padding: 12px;

  .change-mode {
    margin-bottom: 2em;
  }
}
</style>
@/stores/global
