<script lang="ts" setup>
  import { ref, nextTick, watch } from 'vue'
  import { Search, CloseBold } from '@element-plus/icons-vue'
  import type { CheckboxValueType } from 'element-plus'
  import { onMounted } from 'vue'

  const options = ref<
    {
      label: string
      value: string
    }[]
  >([])

  const optionValue = ref<
    {
      label: string
      value: string
    }[]
  >([])

  const props = defineProps<{
    optionArr: {
      label: string
      value: string
    }[]
    placeholder?: string
    // treat it as v-model
    modelValue: string[]
    useValue?: boolean
  }>()

  const emits = defineEmits(['update:modelValue'])

  const filterInput2 = ref<any>(null)
  const filterInput1 = ref<any>(null)
  const multiSelect = ref<any>(null)

  const selectValue = ref('')
  const input = ref('')
  const checkAll = ref(false)
  const isIndeterminate = ref(false)
  const allValue = ref<string[]>([])
  const modalValueRef = ref<string[]>([])

  const getValueFromProps = () => {
    options.value = optionValue.value
    if (props.optionArr.length > 0) {
      optionValue.value = [...props.optionArr]
      options.value = [...props.optionArr]
    }
  }

  const selectVal = () => {
    let allArr = ref<string[]>([])
    options.value.some((e) => {
      allArr.value.push(props.useValue ? e.value : e.label)
    })
    allValue.value = allArr.value

    if (modalValueRef.value.length == 0) return

    let bol = modalValueRef.value.toString() == optionValue.value.toString()

    if (bol) {
      if (!checkAll.value) {
        checkAll.value = true
        if (isIndeterminate.value) {
          isIndeterminate.value = false
        }
      }
    } else {
      if (modalValueRef.value.length == optionValue.value.length) {
        if (checkAll.value) {
          checkAll.value = false
        }
        if (!isIndeterminate.value) {
          isIndeterminate.value = true
        }
      }

      if (modalValueRef.value.length > optionValue.value.length) {
        let length = getInclude(modalValueRef.value, allValue.value)
        if (length == optionValue.value.length) {
          if (!checkAll.value) {
            checkAll.value = true
          }
          if (isIndeterminate.value) {
            isIndeterminate.value = false
          }
        }
        if (length < optionValue.value.length) {
          if (checkAll.value) {
            checkAll.value = false
          }
          if (!isIndeterminate.value) {
            isIndeterminate.value = true
          }
        }
      }

      if (modalValueRef.value.length < optionValue.value.length) {
        if (checkAll.value) {
          checkAll.value = false
        }
        if (!isIndeterminate.value) {
          isIndeterminate.value = true
        }
      }
    }
  }

  const getInclude = (arr1: string[], arr2: string[]) => {
    let temp: string[] = []
    for (const item of arr2) {
      arr1.find((i) => i === item) ? temp.push(item) : ''
    }
    return temp.length
  }

  const selectChange = (val: any) => {
    selectValue.value = val.length + ' Items Selected'
    if (val.length == optionValue.value.length) {
      if (!checkAll.value) {
        checkAll.value = true
      }
      if (isIndeterminate.value) {
        isIndeterminate.value = false
      }
    } else if (val.length == 0) {
      if (checkAll.value) {
        checkAll.value = false
      }
      if (isIndeterminate.value) {
        isIndeterminate.value = false
      }
    } else {
      if (!isIndeterminate.value) {
        isIndeterminate.value = true
      }
      if (checkAll.value) {
        checkAll.value = false
      }
    }
  }

  const checkAllChange = (val: CheckboxValueType) => {
    if (val && modalValueRef.value.length == allValue.value.length) {
      modalValueRef.value = []
      selectValue.value = '0 Items Selected'
    } else {
      modalValueRef.value = val ? allValue.value : []
      selectValue.value = val ? allValue.value.length + ' Items Selected' : '0 Items Selected'
    }

    if (val && allValue.value.length == optionValue.value.length) {
      isIndeterminate.value = false
    } else if (modalValueRef.value.length > 0) {
      isIndeterminate.value = true
    }

    // emits('change', modalValueRef.value)
    emits('update:modelValue', modalValueRef.value)
  }

  const filterChange = (val: any) => {
    let arr = optionValue.value.filter((e) => {
      if (e.label.toUpperCase().indexOf(val.toUpperCase()) != -1) {
        return e
      }
    })
    if (arr.length > 0 && options.value.length == 0) {
      filterInput1.value.focus()
    }

    options.value = arr
    nextTick(() => {
      if (arr.length == 0) {
        filterInput2.value.focus()
      }
    })
    selectVal()
  }

  const closeClick = () => {
    multiSelect.value.blur()
  }

  const focus = () => {
    multiSelect.value.toggleMenu()
  }

  defineExpose({
    focus
  })

  onMounted(() => {
    getValueFromProps()
    selectVal()
    selectValue.value = '0 Items Selected'
  })

  // 监听单一
  watch(
    modalValueRef,
    (newVal) => {
      // emits('change', newVal)
      emits('update:modelValue', newVal)
    },
    {
      deep: true // 深度监听
    }
  )

  watch(
    () => props.optionArr,
    () => {
      getValueFromProps()
      selectVal()
    }
  )

  watch(
    () => props.modelValue,
    () => {
      modalValueRef.value = props.modelValue
      selectChange(props.modelValue)
    }
  )
</script>

<template>
  <div class="selectMultiple">
    <el-select
      v-model="modalValueRef"
      popper-class="selectMultiplePopper"
      :class="checkAll ? 'selectAll' : ''"
      ref="multiSelect"
      multiple
      collapse-tags
      :placeholder="placeholder"
      @change="selectChange"
    >
      <template #prefix>
        <div v-if="checkAll" class="el-tag el-tag--info el-tag--default el-tag--light">All</div>
      </template>

      <template #empty>
        <div class="inputClass inputClass2">
          <el-checkbox
            v-model="checkAll"
            :indeterminate="isIndeterminate"
            @change="checkAllChange"
            label=""
          ></el-checkbox>
          <el-input
            v-model="input"
            placeholder=" "
            :suffix-icon="Search"
            class="input"
            @input="filterChange"
            ref="filterInput2"
          />
          <el-icon class="closeIcon" @click="closeClick"><CloseBold /></el-icon>
        </div>
      </template>
      <p class="inputClassHeigh"></p>
      <div class="inputClass inputClass1">
        <el-checkbox
          v-model="checkAll"
          :indeterminate="isIndeterminate"
          @change="checkAllChange"
          label=""
        ></el-checkbox>
        <el-input
          v-model="input"
          placeholder=" "
          :suffix-icon="Search"
          class="input"
          @input="filterChange"
          ref="filterInput1"
        />
        <el-icon class="closeIcon" @click="closeClick"><CloseBold /></el-icon>
      </div>
      <el-checkbox-group v-model="modalValueRef" class="noPoint">
        <el-option
          v-for="item in options"
          :key="useValue ? item.value : item.label"
          :label="item.label"
          :value="useValue ? item.value : item.label"
        >
          <el-checkbox :label="useValue ? item.value : item.label">{{ item.label }}</el-checkbox>
        </el-option>
      </el-checkbox-group>
    </el-select>
  </div>
</template>

<style>
  .selectMultiplePopper .el-popper__arrow::before {
    background: #efefef !important;
  }
</style>

<style scoped>
  .inputClassHeigh {
    height: 54px;
    margin: 0;
    padding: 0;
  }
  .el-select-dropdown__item.selected::after {
    opacity: 0 !important;
  }

  .inputClass {
    display: flex;
    align-items: center;
    box-sizing: border-box;
    background-color: #efefef;
  }
  .inputClass .input {
    margin: 0 10px 0 7px;
  }

  .inputClass1 {
    margin-top: -10px;
    padding: 20px 20px 10px;
    border-bottom: 1px solid #ddd;
    position: absolute;
    width: 100%;
    top: 0;
    z-index: 1000;
  }

  .inputClass2 {
    padding: 15px 20px 20px;
  }
  .noPoint .el-checkbox {
    pointer-events: none;
  }

  .selectAll :deep .el-select__tags {
    display: none !important;
  }
  .all {
    z-index: 1000;
  }
</style>
