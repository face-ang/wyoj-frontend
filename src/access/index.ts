import router from "@/router";
import store from "@/store";
import ACCESS_ENUM from "@/access/accessEnum";
import checkAccess from "@/access/checkAccess";
import message from "@arco-design/web-vue/es/message";

router.beforeEach(async (to, from, next) => {
  console.log("登录用户信息", store.state.user.loginUser);
  const loginUser = store.state.user.loginUser;
  // 如果之前没登录过。自动登录
  if (!loginUser || !loginUser.userRole) {
    // 加 await 是为了等用户登陆成功之后，再执行后续的代码
    await store.dispatch("user/getLoginUser");
  }
  // 再次从 store 获取最新的登录用户信息
  const updatedLoginUser = store.state.user.loginUser;
  const needAccess = (to.meta?.access as string) ?? ACCESS_ENUM.NOT_LOGIN;
  // 要跳转的页面必须登录
  if (needAccess !== ACCESS_ENUM.NOT_LOGIN) {
    // 如果没有登录，跳转到登录页面
    if (
      !updatedLoginUser ||
      !updatedLoginUser.userRole ||
      updatedLoginUser.userRole === ACCESS_ENUM.NOT_LOGIN
    ) {
      message.warning("请登录后操作");
      next(`/user/login?redirect=${to.fullPath}`);
      return;
    }
    // 如果已经登录了，但是权限不足，那么跳转到无权限界面
    if (!checkAccess(updatedLoginUser, needAccess)) {
      next("/noAuth");
      return;
    }
  }
  next();
});
