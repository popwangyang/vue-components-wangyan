<template>
  <div class="ui-calendar">
    <div class="ui-calendar-cell__hd">
      <span class="icon">
        <slot name="left"></slot>
      </span>
      <span>{{ calendar.date }}</span>
      <span class="icon">
        <slot name="right"></slot>
      </span>
    </div>
    <div class="ui-calendar-cell__bd">
      <div class="week">
        <div class="week-item" v-for="item in week" :key="item">{{ item }}</div>
      </div>
      <div class="days">
        <div
          class="day"
          @click="dayBtn(item)"
          v-for="(item, index) in calendar.days"
          :key="index"
          :class="{
            isNotCurrentMonth: item.isCurrentMonth,
            selected: value.indexOf(item.format) > -1,
            disabled: item.disabled,
            today: item.isToday,
          }"
        >
          <span v-if="item.isToday">今天</span>
          <span v-else>{{ item.day }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import moment from "moment";
export default {
  props: {
    value: {
      type: Array,
      default: function () {
        return [];
      },
    },
    month: {
      type: [Date, String],
      require: true,
    },
    firstDayOfWeek: {
      type: Number,
      default: 1,
      validator: (value) => {
        return [1, 7].indexOf(value) > -1;
      },
    },
    disabledDate: {
      type: Function,
    },
  },
  watch: {
    month(newVal) {
      this.setDays();
    },
  },
  data() {
    return {
      calendar: {},
    };
  },
  computed: {
    week() {
      let week = ["日", "一", "二", "三", "四", "五", "六", "日"];
      if (this.firstDayOfWeek == 1) {
        week.splice(0, 1);
      } else {
        week.splice(7, 1);
      }
      return week;
    },
  },
  mounted() {
    this.setDays();
  },
  methods: {
    dayBtn(item) {
      let value,
        { disabled, format } = item;
      if (disabled) return;
      value = [...this.value];

      if (value.indexOf(format) > -1) {
        value.splice(value.indexOf(format), 1);
      } else {
        value.push(format);
      }

      this.$emit("input", value);
    },
    setDays() {
      this.calendar = {
        date: moment(this.month).format("YYYY年MM月"),
        days: this.handleGetMonthDays(this.month),
      };
    },
    handleGetMonthDays(time) {
      let calendatArr = [];
      // 先得到当前的年，月，日
      let { year, month, day } = this.handleGetYearMonthDay(time);
      // 获取当月的第一天 得到2019-5-1
      let currentFirstDay = this.handleGetDate(year, month, 1);

      // 获取第一天是星期几 得到 3
      let weekDay =
        currentFirstDay.getDay() - (this.firstDayOfWeek == 1 ? 1 : 0);

      // 用当月的第一天减去 周几前面几天 这样就能得到上个月开始的天数 （当前月1号是周三，那么周一就是上个月的最后两天）
      let startTime = currentFirstDay - weekDay * 24 * 60 * 60 * 1000;

      // 然后得到所有的日期
      for (let i = 0; i < 42; i++) {
        calendatArr.push(this.handleFormatDate(month + 1, startTime, i));
      }
      return calendatArr;
    },
    // 格式化日期
    handleFormatDate(month, startTime, i) {
      let date = new Date(startTime + i * 24 * 60 * 60 * 1000);
      let y = date.getFullYear();
      let m = date.getMonth() + 1;
      let d = date.getDate();
      let result = {
        isCurrentMonth: m != month,
        format:
          y + "-" + (m >= 10 ? m : "0" + m) + "-" + (d >= 10 ? d : "0" + d),
        year: y,
        month: m,
        day: d,
      };
      result.isToday = result.format == moment().format("YYYY-MM-DD");
      result.disabled =
        this.disabledDate == null ? false : this.disabledDate(result.format);
      return result;
    },
    //
    handleGetDate(y, m, d) {
      return new Date(y, m, d);
    },
    // 获取年月日
    handleGetYearMonthDay(date) {
      if (typeof date == "string") {
        date = new Date(date);
      }
      let year = date.getFullYear();
      let month = date.getMonth();
      let day = date.getDate();
      return { year, month, day };
    },
  },
};
</script>

<style lang="less">
.ui-calendar {
  width: 300px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  .ui-calendar-cell__hd {
    width: 100%;
    font-weight: bold;
    text-align: center;
    margin: 30px 20px 20px 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .icon {
      cursor: pointer;
    }
  }
  .ui-calendar-cell__bd {
    .week,
    .days {
      display: grid;
      grid-template-columns: repeat(7, 30px);
      font-size: 10px;
    }
    .week {
      grid-template-rows: 30px;
      .week-item {
        width: 80%;
        height: 80%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: bold;
      }
    }
    .days {
      height: 100%;
      grid-template-rows: repeat(6, 30px);
      .day {
        box-sizing: border-box;
        width: 80%;
        height: 80%;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        border-radius: 4px;
      }
      .isNotCurrentMonth {
        visibility: hidden;
        color: #ccc;
      }
      .today {
        color: #2bc355;
      }
      .selected {
        background: #2bc355;
        color: white;
      }
      .disabled {
        background: #c5c8ce;
        cursor: not-allowed;
        color: white;
      }
    }
  }
}
</style>
