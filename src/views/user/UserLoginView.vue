<template>
  <div id="userLoginView">
    <h2 style="margin-bottom: 40px">用户登录</h2>
    <!--    <a-typography-title :heading="2" style="margin-bottom: 40px">-->
    <!--      用户登录-->
    <!--    </a-typography-title>-->
    <a-form
      label-align="left"
      auto-label-width
      :model="form"
      style="max-width: 480px; margin: 0 auto"
      @submit="handleSubmit"
    >
      <a-form-item field="userAccount" tooltip="请输入账号" label="账号">
        <a-input v-model="form.userAccount" placeholder="请输入账号" />
      </a-form-item>
      <a-form-item field="userPassword" tooltip="密码不少于8位" label="密码">
        <a-input-password
          v-model="form.userPassword"
          placeholder="请输入密码"
        />
      </a-form-item>
      <a-form-item>
        <a-button
          type="primary"
          html-type="submit"
          style="width: 120px; margin-right: 180px"
          >登录
        </a-button>
        <a-button type="outline" style="width: 120px" @click="toRegister"
          >注册
        </a-button>
      </a-form-item>
    </a-form>
  </div>
</template>

<script setup lang="ts">
import { reactive } from "vue";
import { UserControllerService, UserLoginRequest } from "../../../generated";
import message from "@arco-design/web-vue/es/message";
import { useRouter } from "vue-router";
import { useStore } from "vuex";

const router = useRouter();
const store = useStore();

/**
 * 表单信息
 */
const form = reactive({
  userAccount: "",
  userPassword: "",
} as UserLoginRequest);
/**
 * 提交表单
 */
const handleSubmit = async () => {
  const res = await UserControllerService.userLoginUsingPost(form);
  // 登录成功，跳转到主页
  if (res.code === 0) {
    store.dispatch("user/getLoginUser");
    router.push({
      path: "/",
      replace: true,
    });
    message.success("登陆成功");
  } else {
    message.error(res.message);
  }
};

const toRegister = () => {
  router.push({
    path: "/user/register",
  });
};
</script>
