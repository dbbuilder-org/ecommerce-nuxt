<template>
  <nav aria-label="Checkout progress" class="mb-8">
    <ol class="flex items-center justify-center">
      <li
        v-for="(step, index) in steps"
        :key="step.id"
        class="flex items-center"
      >
        <!-- Step circle and label -->
        <div class="flex flex-col items-center">
          <button
            :disabled="!canNavigateToStep(step.id)"
            @click="goToStep(step.id)"
            :class="[
              'flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all duration-200',
              getStepClasses(step.id),
            ]"
          >
            <!-- Completed checkmark -->
            <Icon
              v-if="isStepCompleted(step.id)"
              name="heroicons:check"
              class="w-5 h-5"
            />
            <!-- Current/upcoming step number or icon -->
            <Icon
              v-else-if="step.icon"
              :name="step.icon"
              class="w-5 h-5"
            />
            <span v-else class="text-sm font-semibold">{{ step.id }}</span>
          </button>
          <span
            :class="[
              'mt-2 text-xs font-medium',
              currentStep === step.id ? 'text-primary-600' : 'text-gray-500'
            ]"
          >
            {{ step.name }}
          </span>
        </div>

        <!-- Connector line -->
        <div
          v-if="index < steps.length - 1"
          :class="[
            'w-16 sm:w-24 h-0.5 mx-2 transition-colors duration-200',
            isStepCompleted(step.id) ? 'bg-primary-500' : 'bg-gray-200'
          ]"
        />
      </li>
    </ol>
  </nav>
</template>

<script setup lang="ts">
import { CHECKOUT_STEPS } from '~/types/checkout'

const props = defineProps<{
  currentStep: number
  completedSteps: number[]
}>()

const emit = defineEmits<{
  (e: 'navigate', step: number): void
}>()

const steps = CHECKOUT_STEPS

function isStepCompleted(stepId: number): boolean {
  return props.completedSteps.includes(stepId)
}

function isCurrentStep(stepId: number): boolean {
  return props.currentStep === stepId
}

function canNavigateToStep(stepId: number): boolean {
  // Can always go back to completed steps
  if (isStepCompleted(stepId)) return true
  // Can go to current step
  if (isCurrentStep(stepId)) return true
  // Can go to next step if current is completed
  if (stepId === props.currentStep + 1 && isStepCompleted(props.currentStep)) return true
  return false
}

function goToStep(stepId: number) {
  if (canNavigateToStep(stepId)) {
    emit('navigate', stepId)
  }
}

function getStepClasses(stepId: number): string {
  if (isStepCompleted(stepId)) {
    return 'bg-primary-500 border-primary-500 text-white cursor-pointer hover:bg-primary-600'
  }
  if (isCurrentStep(stepId)) {
    return 'bg-white border-primary-500 text-primary-600'
  }
  return 'bg-white border-gray-300 text-gray-400 cursor-not-allowed'
}
</script>
