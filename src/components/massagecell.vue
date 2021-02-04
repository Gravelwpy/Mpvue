<template>
  <div class="massagecell">
    <div class="titleline">
      <img src="../assets/logo.png" class="headimg"/>
      <div class="title">{{ title }}</div>
      <div class="namemas">{{ name }} {{insert_time | formatDate}}</div>
    </div>
    <div class="artical">
      {{ massage }}
    </div>
  </div>
</template>

<script>
  import { formatDate } from './data.js';
  export default {
    props: {
      imgurl: {
        type: String,
        default: ''
      },
      title: {
        type: String,
        default: ''
      },
      massage: {
        type: [Number, String],
        default: ''
      },
      name: {
        type: String,
        default: ''
      },
      insert_time: {
        type: [Number, String],
        default: ''
      },
    },
    name: "massagecell",
    components: {},
    data: function () {
      return {
        time: ""
      }
    },
    filters: {
      /*
        时间格式自定义 只需把字符串里面的改成自己所需的格式
      */
      formatDate(time) {
        var date = new Date(time);
        return formatDate(date, 'yyyy.MM.dd');
      },
      formatDate2(time) {
        var date = new Date(time);
        return formatDate(date, 'hh:mm:ss');
      },
      formatDate3(time) {
        var date = new Date(time);
        return formatDate(date, 'yyyy年MM月dd日 hh:mm:ss');
      }
    },
    computed: {
    },
    methods: {
    },
    created() {

    },
    mounted() {
    }
  }
</script>

<style scoped>
  .massagecell {
    margin: 2px;
  }
  .titleline {
    display: flex;
    padding-top: 10px;
    padding-left: 10px;
    align-items: center;
  }
  .headimg {
    width: 10%;
    height: 10%;
    border-radius: 3em;
  }
  .title {
    font-size: 20px;
    margin-left: 15px;
  }
  .namemas {
    color: #969799;
    font-size: 10px;
    margin-left: 15px;
    margin-top: 6px;
    position: absolute;
    right: 20px;
  }
  .artical {
    text-align: left;
    margin-left: calc(10% + 25px);
    font-size: 13px;
    font-family:"Trebuchet MS", Arial, Helvetica, sans-serif;
    word-wrap: break-word;
    word-break: break-all;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    padding-bottom: 10px;
  }
</style>
