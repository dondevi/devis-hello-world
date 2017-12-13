---
    aurhor: dondevi
    create: 2014-05-26
---

# Cordova Hello World
> [官方文档](http://cordova.apache.org/docs/en/latest/)

<small>&emsp;&emsp;2011年10月，Adobe 收购 Nitobi Software 和它的 PhoneGap 产品，然后宣布这个移动开发框架将会继续开源，并把它提交到 Apache Incubator，以便完全接受 ASF 的管治。PhoneGap 项目主管 Brian LeRoux 指出开源 PhoneGap 的决定在 Adobe 收购 Nitobi 之前就做出了，由于 Adobe 现在拥有 PhoneGap 商标，他们不得不换个名 字。第一个选中的名字是 Callback，毫无创意，因此再改一次，产品现在叫 Apache Cordova。Apache Cordova 是 PhoneGap 贡献给 Apache 后的开源项目，是从 PhoneGap 中抽出的核心代码，是驱动 PhoneGap 的核心引擎，你可以把他想象成类似于 Webkit 和 Google Chrome 的关系。</small>

## 运行环境

  - 安装 [NodeJS](http://nodejs.org/)
  - 安装 [Java JDK](http://www.oracle.com/technetwork/java/javase/downloads/index.html)
  - 安装 [Apache Ant](http://ant.apache.org/)
  - 安装 [Android Studio](http://developer.android.com/sdk/installing/studio.html)

## 环境变量

  1. 新建变量<small>（可选）</small>
  ```shell
  %ANT_HOME%: (ant_install_path)
  %JAVA_HOME%: (jdk_install_path)
  %NODE_HOME%: (node_install_path)
  %ANDROID_HOME%: (android_studio_path)\sdk
  ```

  2. 添加以下内容到 `PATH` 变量
  ```text
  %NODE_HOME%\node_modules; %NODE_HOME%\npm; %ANT_HOME%\bin; %ANDROID_HOME%\platform-tools; %ANDROID_HOME%\tools;
  ```

## 创建项目

  1. 安装框架：`npm install -g cordova`
  2. 创建项目：`cordova create myApp`
  3. 添加平台：`cordova platform add android`
  4. 建立项目：`cordova build android`
  5. 增加插件：`cordova plugin add org.apache.cordova.(your_plugin)`

## Android Studio

  1. 引入项目：`(your_path_to)\myApp\platforms\android`
  2. 移动文件：`myAppCordovaLib\src` → `myApp\src`
  3. 进行开发。

