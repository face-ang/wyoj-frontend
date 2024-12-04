<template>
  <div id="userLayout">
    <a-layout style="min-height: 100vh">
      <a-layout-header class="header">
        <a-space>
          <img class="logo" src="../assets/yang-logo.svg" />
          <a-typography-title> Yang Online Judge</a-typography-title>
        </a-space>
      </a-layout-header>
      <a-layout-content class="content">
        <router-view />
      </a-layout-content>
      <a-layout-footer class="footer">
        <a-space>
          <a-link href="https://www.xjtu.edu.cn/" icon
            >by 西安交通大学电信学部
          </a-link>
          <a-link href="https://github.com/face-ang" icon>face-ang</a-link>
        </a-space>
      </a-layout-footer>
    </a-layout>
  </div>
</template>

<style scoped>
#userLayout {
  text-align: center;
  background: url("https://gw.alipayobjects.com/zos/rmsportal/FfdJeJRQWjEeGTpqgBKj.png")
    0% 0% / 100% 100%;
}

#userLayout .logo {
  width: 100px;
  height: 100px;
}

#userLayout .header {
  margin-top: 50px;
  margin-bottom: 30px;
}

#userLayout .content {
  margin-bottom: 16px;
  padding: 150px;
}

#userLayout .footer {
  padding: 16px;
  position: sticky;
  bottom: 0;
  left: 0;
  right: 0;
  text-align: center;
}
</style>
<script setup lang="ts"></script>
