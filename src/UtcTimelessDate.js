class UtcTimelessDate extends Date {  
  addDays(days) {
    let date = new Date (this.getTime());
    date.setDate(date.getDate() + (days || 0));
    this.setTime(date.getTime());
    return this;
  }
  floor() {
    let date = new Date (
      Date.UTC (
        this.getFullYear(),
        this.getMonth(),
        this.getDate()
      )
    );
    this.setTime(date.getTime());
    return this;
  }
  ceil() {
    let date = new Date (
      Date.UTC (
        this.getFullYear(),
        this.getMonth(),
        this.getDate() + 1
      )
    );
    this.setTime(date.getTime());
    return this;
  }
}

export default UtcTimelessDate;
//module.exports = UtcTimelessDate;