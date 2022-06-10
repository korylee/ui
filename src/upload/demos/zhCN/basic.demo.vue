<markdown>
# 基础用法
</markdown>

<template>
  <k-upload
    action="__HTTP__://www.mocky.io/v2/5e4bafc63100007100d8b70f"
    :headers="{
      'naive-info': 'hello!'
    }"
    :data="{
      'naive-data': 'cool! naive!'
    }"
  >
    <k-button>上传文件</k-button>
  </k-upload>
</template>
