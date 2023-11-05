import { defineStore } from 'pinia'
import { ref, type Ref } from 'vue'

export enum MessageType {
  Error,
  Warning,
  Info
}

export interface Message {
  id: number
  type: MessageType
  text: string
  extraClasses: string
}

const MESSAGE_TTL = 80000

const CLASSES_MAP: Record<MessageType, string> = {
  [MessageType.Error]: 'alert-danger',
  [MessageType.Warning]: 'alert-warn',
  [MessageType.Info]: 'alert-info'
}

export const useMessagesStore = defineStore('messages', () => {
  const messages: Ref<Message[]> = ref([])

  function removeMessage(id: number) {
    messages.value = messages.value.filter((msg) => msg.id !== id)
  }

  function addMessage(text: string, type: MessageType) {
    const id = new Date().getTime()
    const extraClasses = CLASSES_MAP[type]
    messages.value.push({ id, type, text, extraClasses })
    setTimeout(() => {
      removeMessage(id)
    }, MESSAGE_TTL)
  }

  function alert(text: string) {
    addMessage(text, MessageType.Error)
  }
  function error(text: string) {
    addMessage(`Error: ${text}`, MessageType.Error)
  }
  function warn(text: string) {
    addMessage(text, MessageType.Warning)
  }
  function info(text: string) {
    addMessage(text, MessageType.Info)
  }

  return { messages, addMessage, removeMessage, alert, error, warn, info }
})
