<template>
  <div class="calendarBox">
    <div class="loadBox" v-if="loading">
      <wy-load></wy-load>
    </div>
    <div class="content" v-else>
      <ui-calendar
        v-model="dates"
        :month="firstMonth"
        :disabledDate="disabledDate"
      >
        <i
          class="iconfont icon-zuobian"
          @click="timeChange('back')"
          slot="left"
        ></i>
      </ui-calendar>
      <!-- <span class="fengeixian"></span> -->
      <ui-calendar
        v-model="dates"
        :month="secondMonth"
        :disabledDate="disabledDate"
      >
        <i
          class="iconfont icon-youbian"
          @click="timeChange('forward')"
          slot="right"
        ></i>
      </ui-calendar>
    </div>
  </div>
</template>

<script>
import wyLoad from "../wyLoad";
import uiCalendar from "./widgets/ui-calendar";
import moment from "moment";
export default {
  props: {
    value: {
      type: Array,
      default: function () {
        return [];
      },
    },
    useDate: {
      type: [Function, Array],
    },
  },
  components: {
    uiCalendar,
    wyLoad,
  },
  data() {
    return {
      dates: [],
      loading: true,
      month: new Date(),
      noForbidDateList: [],
      cacheData: {}, //缓存数据
    };
  },
  computed: {
    firstMonth() {
      return moment(this.month).format("YYYY-MM");
    },
    secondMonth() {
      return moment(this.month).add(1, "month").format("YYYY-MM");
    },
  },
  watch: {
    value(newVal) {
      this.dates = newVal;
    },
    dates(newVal) {
      this.$emit("input", newVal);
    },
  },
  methods: {
    async timeChange(type) {
      let month;
      if (type == "back") {
        month = moment(this.month).subtract(2, "month");
      } else {
        month = moment(this.month).add(2, "month");
      }

      await this.setForbidDate(month);
      this.month = month;
    },

    async setForbidDate(month) {
      this.loading = true;
      if (Array.isArray(this.useDate)) {
        this.noForbidDateList = this.useDate;
      } else if (typeof this.useDate == "function") {
        let start_time = moment(month).format("YYYY-MM-DD"),
          end_time = moment(month).add(2, "month").format("YYYY-MM-DD");
        this.noForbidDateList =
          this.cacheData[`${start_time}-${end_time}`] ||
          (this.cacheData[`${start_time}-${end_time}`] = await this.useDate(
            start_time,
            end_time
          ));
      } else {
        this.noForbidDateList = [];
      }
      this.loading = false;
    },
    disabledDate(date) {
      if (!this.useDate) return false;
      return !(this.noForbidDateList.indexOf(date) > -1);
    },
  },
  mounted() {
    let month = new Date();
    this.month = month;
    this.dates = this.value;
    this.setForbidDate(month);
  },
};
</script>

<style scoped lang='less'>
.calendarBox {
  background: white;
  display: inline-block;
  padding: 10px;
  width: 540px;
  height: 366px;
  position: relative;
  .loadBox {
    width: 100%;
    height: 100%;
    position: absolute;
    background: rgba(241, 239, 239, 0.644);
    left: 0;
    top: 0;
  }
  .content {
    background: #fafafa;
    display: flex;
    padding: 20px;
    justify-content: space-between;
    .fengeixian {
      width: 1px;
      background: #f1f3f4;
    }
  }
}
</style>