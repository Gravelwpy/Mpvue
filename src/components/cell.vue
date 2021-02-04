<template>
  <div v-bind:class="classObject" ref="height_judge">
    <van-grid :column-num="1" v-bind:style="{ height: hSize + 'px' }">
      {{classname}} {{local}}
    </van-grid>
  </div>
</template>

<script>
    export default {
        props: {
          classname: {
            type: String,
            default: ''
          },
          teacher: {
            type: String,
            default: ''
          },
          local: {
            type: [Number, String],
            default: ''
          },
          number: {
            type: Number,
            default: 3
          }
        },
        name: "cell",
        components: {},
        data: function () {
            return {
              hSize: 0,
              wSize: 0,
            }
        },
        computed: {
          classObject: function () {
            return {
              'cell': true,
              'backcolor': this.classname != '',
            }
          }
        },
        methods: {
          timer() {
            clearInterval(this.time);
            this.hSize = this.$refs.height_judge.offsetWidth * this.number - 6;
          }
        },
        created() {

        },
        mounted() {
          this.time=setInterval(this.timer,1);
        }
    }
</script>

<style scoped>
  .cell {
    overflow: hidden;
    color: #7d7e80;
    font-size: 12px;
    padding: 4px;
    border-radius: 6px;
    margin: 1px;
  }
  .backcolor {
    background: #D1EEEE;
  }
</style>
