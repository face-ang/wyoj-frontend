<template>
  <div id="addQuestionView">
    <!--    <h2 style="text-align: center">OJ 题目</h2>-->
    <div v-if="updatePage" style="text-align: center; margin-bottom: 10px">
      <!--      <a-typography-text type="warning"> 更新题目</a-typography-text>-->
      <a-tag color="gold" size="large" bordered>更新题目</a-tag>
    </div>
    <div v-else style="text-align: center; margin-bottom: 10px">
      <!--      <a-typography-text type="success"> 创建题目</a-typography-text>-->
      <a-tag color="cyan" size="large" bordered>创建题目</a-tag>
    </div>
    <a-form :model="form" label-align="right">
      <a-form-item field="title" label="标题">
        <a-input
          :style="{ width: '1000px' }"
          v-model="form.title"
          placeholder="请输入标题"
        />
      </a-form-item>
      <a-form-item field="tags" label="标签">
        <a-input-tag
          :style="{ width: '1000px' }"
          v-model="form.tags"
          placeholder="请选择标签"
          allow-clear
        />
      </a-form-item>
      <a-form-item field="content" label="题目内容">
        <MdEditor
          :value="form.content"
          :handle-change="onContentChange"
          style="min-width: 1000px"
        />
      </a-form-item>
      <a-form-item field="answer" label="答案">
        <MdEditor
          :value="form.answer"
          :handle-change="onAnswerChange"
          style="min-width: 1000px"
        />
      </a-form-item>
      <a-form-item label="判题配置" :content-flex="false" :merge-props="false">
        <a-space direction="vertical" style="min-width: 480px">
          <a-form-item field="judgeConfig.timeLimit" label="时间限制">
            <a-input-number
              :style="{ width: '320px' }"
              v-model="form.judgeConfig.timeLimit"
              placeholder="请输入时间限制"
              mode="button"
              :min="0"
              size="large"
            />
          </a-form-item>
          <a-form-item field="judgeConfig.memoryLimit" label="内存限制">
            <a-input-number
              :style="{ width: '320px' }"
              v-model="form.judgeConfig.memoryLimit"
              placeholder="请输入内存限制"
              mode="button"
              :min="0"
              size="large"
            />
          </a-form-item>
          <a-form-item field="judgeConfig.stackLimit" label="堆栈限制">
            <a-input-number
              :style="{ width: '320px' }"
              v-model="form.judgeConfig.stackLimit"
              placeholder="请输入堆栈限制"
              mode="button"
              :min="0"
              size="large"
            />
          </a-form-item>
        </a-space>
      </a-form-item>
      <a-form-item
        label="测试用例配置"
        :content-flex="false"
        :merge-props="false"
      >
        <a-form-item
          v-for="(judgeCaseItem, index) of form.judgeCase"
          :key="index"
          no-style
        >
          <a-space direction="vertical" style="min-width: 580px">
            <a-form-item
              :field="`form.judgeCase[${index}].input`"
              :label="`输入用例-${index}`"
              :key="index"
              :style="{ width: '550px' }"
            >
              <a-input
                :style="{ width: '300px' }"
                v-model="judgeCaseItem.input"
                placeholder="请输入测试输入用例"
              />
            </a-form-item>
            <a-form-item
              :field="`form.judgeCase[${index}].output`"
              :label="`输出用例-${index}`"
              :key="index"
              :style="{ width: '550px' }"
            >
              <a-input
                :style="{ width: '300px' }"
                v-model="judgeCaseItem.output"
                placeholder="请输入测试输出用例"
              />
            </a-form-item>
            <a-button status="danger" @click="handleDelete(index)">
              删除
            </a-button>
          </a-space>
        </a-form-item>
        <div style="margin-top: 32px">
          <a-button @click="handleAdd" type="outline" status="success"
            >新增测试用例
          </a-button>
        </div>
      </a-form-item>
      <div style="margin-top: 16px" />
      <a-form-item>
        <a-button
          type="primary"
          style="min-width: 200px; margin-left: 400px"
          @click="doSubmit"
          >提交
        </a-button>
      </a-form-item>
    </a-form>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import MdEditor from "@/components/MdEditor.vue";
import message from "@arco-design/web-vue/es/message";
import { useRoute, useRouter } from "vue-router";
import { QuestionControllerService } from "../../../generated";

const router = useRouter();
const route = useRoute();
// 如果页面地址包含 update，视为更新页面
const updatePage = route.path.includes("update");

let form = ref({
  title: "",
  tags: [],
  answer: "",
  content: "",
  judgeConfig: {
    memoryLimit: 1000,
    stackLimit: 1000,
    timeLimit: 1000,
  },
  judgeCase: [
    {
      input: "",
      output: "",
    },
  ],
});

/**
 * 新增判题用例
 */
const handleAdd = () => {
  form.value.judgeCase.push({
    input: "",
    output: "",
  });
};

/**
 * 删除判题用例
 */
const handleDelete = (index: number) => {
  form.value.judgeCase.splice(index, 1);
};

/**
 * 根据题目 id 获取老的数据
 */
const loadData = async () => {
  const id = route.query.id;
  if (!id) {
    return;
  }
  const res = await QuestionControllerService.getQuestionByIdUsingGet(
    id as any
  );
  if (res.code === 0) {
    form.value = res.data as any;
    // json 转 js 对象
    if (!form.value.judgeCase) {
      form.value.judgeCase = [
        {
          input: "",
          output: "",
        },
      ];
    } else {
      form.value.judgeCase = JSON.parse(form.value.judgeCase as any);
    }
    if (!form.value.judgeConfig) {
      form.value.judgeConfig = {
        memoryLimit: 1000,
        stackLimit: 1000,
        timeLimit: 1000,
      };
    } else {
      form.value.judgeConfig = JSON.parse(form.value.judgeConfig as any);
    }
    if (!form.value.tags) {
      form.value.tags = [];
    } else {
      form.value.tags = JSON.parse(form.value.tags as any);
    }
  } else {
    message.error("题目信息加载失败，" + res.message);
  }
};

onMounted(() => {
  loadData();
});

const onContentChange = (value: string) => {
  form.value.content = value;
};

const onAnswerChange = (value: string) => {
  form.value.answer = value;
};

// 提交
const doSubmit = async () => {
  console.log(form.value);
  // 区分更新还是创建
  if (updatePage) {
    const res = await QuestionControllerService.updateQuestionUsingPost(
      form.value
    );
    if (res.code === 0) {
      message.success("题目更新成功");
      router.push({
        path: "/manage/question",
      });
    } else {
      message.error("题目更新失败，" + res.message);
    }
  } else {
    const res = await QuestionControllerService.addQuestionUsingPost(
      form.value
    );
    if (res.code === 0) {
      message.success("题目创建成功");
    } else {
      message.error("题目创建失败，" + res.message);
    }
  }
};
</script>

<style scoped>
#addQuestionView {
}

:deep(.bytemd-fullscreen.bytemd) {
  z-index: 100;
}
</style>
